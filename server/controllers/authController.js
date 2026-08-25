import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';
import { config } from '../config/index.js';

export class AuthController {
  // POST /api/v1/auth/register
  static async register(req, res) {
    const { fullName, password, avatarUrl } = req.body;
    if (!fullName || !password) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp đầy đủ thông tin Họ tên và Mật khẩu'
      });
    }

    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const email = req.body.email || `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}${Date.now().toString().slice(-4)}@dam.vn`;
    const passwordHash = await bcrypt.hash(password, 10);
    const finalAvatar = avatarUrl || '/pink.png';

    try {
      db.prepare(`
        INSERT INTO users (id, email, password_hash, full_name, role, avatar_url, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'customer', ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(userId, email, passwordHash, fullName, finalAvatar);

      const accessToken = jwt.sign(
        { userId, role: 'customer' },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      return res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công',
        data: {
          token: accessToken,
          user: {
            id: userId,
            email,
            fullName,
            role: 'customer',
            avatarUrl: finalAvatar,
            points: 200
          }
        }
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Lỗi khi tạo tài khoản'
      });
    }
  }

  // POST /api/v1/auth/login
  static async login(req, res) {
    const { email, password } = req.body;
    const identifier = (email || '').trim().toLowerCase();

    const user = db.prepare(`
      SELECT * FROM users 
      WHERE LOWER(email) = ? 
         OR LOWER(id) = ? 
         OR LOWER(email) LIKE ?
         OR LOWER(full_name) = ?
    `).get(identifier, identifier, `${identifier}@%`, identifier);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Tài khoản hoặc mật khẩu không chính xác'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Tài khoản của bạn đã bị vô hiệu hóa'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Tài khoản hoặc mật khẩu không chính xác'
      });
    }

    // 🛡️ Single Active Session: Generate unique session ID for this login instance
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const userAgent = req.headers['user-agent'] || 'Thiết bị lạ';
    const deviceName = userAgent.includes('Mobile')
      ? 'Điện thoại di động'
      : userAgent.includes('Windows')
        ? 'Máy tính Windows'
        : userAgent.includes('Mac')
          ? 'Máy tính Mac'
          : 'Trình duyệt Web';

    // Invalidate previous sessions by saving new active_session_id in DB
    db.prepare('UPDATE users SET active_session_id = ?, last_login_device = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(sessionId, deviceName, user.id);

    // Generate JWT Access & Refresh Tokens with embedded sessionId
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, sessionId },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, sessionId },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiresIn }
    );

    // Save refresh token in DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare(`
      INSERT INTO refresh_tokens (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(`ref-${Date.now()}-${Math.random().toString(36).substring(7)}`, user.id, refreshToken, expiresAt);

    // Set secure HttpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15m
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
    });

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token: accessToken,
        sessionId,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          avatarUrl: user.avatar_url,
          lastDevice: deviceName
        }
      }
    });
  }

  // GET /api/v1/auth/session-check
  static sessionCheck(req, res) {
    const user = req.user;
    const clientSessionId = req.headers['x-session-id'] || req.query.sessionId;
    const currentDbUser = db.prepare('SELECT active_session_id, last_login_device FROM users WHERE id = ?').get(user.id);

    if (currentDbUser?.active_session_id && clientSessionId && currentDbUser.active_session_id !== clientSessionId) {
      return res.status(401).json({
        success: false,
        code: 'SESSION_REVOKED',
        error: 'Tài khoản của bạn vừa đăng nhập ở một thiết bị khác. Phiên làm việc trên thiết bị này đã kết thúc.',
        lastDevice: currentDbUser?.last_login_device || 'Thiết bị khác'
      });
    }

    return res.json({
      success: true,
      active: true,
      sessionId: currentDbUser?.active_session_id || clientSessionId
    });
  }

  // GET /api/v1/auth/me
  static async getCurrentUser(req, res) {
    return res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          fullName: req.user.full_name,
          role: req.user.role,
          avatarUrl: req.user.avatar_url
        }
      }
    });
  }

  // POST /api/v1/auth/logout
  static async logout(req, res) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.json({
      success: true,
      message: 'Đã đăng xuất an toàn'
    });
  }

  // POST /api/v1/auth/refresh
  static async refreshToken(req, res) {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'Không tìm thấy refresh token' });
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
      const tokenRecord = db.prepare('SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ?').get(refreshToken, decoded.userId);

      if (!tokenRecord) {
        return res.status(403).json({ success: false, error: 'Refresh token đã bị hủy hoặc không hợp lệ' });
      }

      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.userId);
      if (!user || !user.is_active) {
        return res.status(403).json({ success: false, error: 'Tài khoản không khả dụng' });
      }

      // Rotate token: issue new access token
      const newAccessToken = jwt.sign(
        { userId: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
      });

      return res.json({
        success: true,
        data: { token: newAccessToken }
      });
    } catch {
      return res.status(403).json({ success: false, error: 'Refresh token đã hết hạn hoặc không hợp lệ' });
    }
  }
}
