import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';
import { config } from '../config/index.js';

export class AuthController {
  // POST /api/v1/auth/login
  static async login(req, res) {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không chính xác'
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
        error: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Generate JWT Access & Refresh Tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
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
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          avatarUrl: user.avatar_url
        }
      }
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
