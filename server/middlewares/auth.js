import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { db } from '../database/db.js';

export function authenticate(req, res, next) {
  try {
    let token = req.cookies?.accessToken;

    // Fallback to Authorization Header (Bearer token)
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Chưa đăng nhập hoặc phiên làm việc đã hết hạn'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = db.prepare('SELECT id, email, full_name, role, avatar_url, is_active FROM users WHERE id = ?').get(decoded.userId);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Tài khoản không tồn tại hoặc đã bị khóa'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Phiên đăng nhập đã hết hạn',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Token không hợp lệ hoặc đã bị chỉnh sửa'
    });
  }
}

// Optional Auth (For public-read endpoints with optional user state)
export function optionalAuth(req, res, next) {
  try {
    let token = req.cookies?.accessToken;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = db.prepare('SELECT id, email, full_name, role, avatar_url, is_active FROM users WHERE id = ?').get(decoded.userId);
      if (user && user.is_active) {
        req.user = user;
      }
    }
  } catch {
    // Ignore error for optional auth
  }
  next();
}

// Role-Based Access Control (RBAC Guard)
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Chưa xác thực người dùng' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Bạn không có quyền thực hiện hành động này (Forbidden)'
      });
    }
    next();
  };
}
