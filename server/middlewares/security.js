import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { config } from '../config/index.js';

// ─── 1. CORS Configuration ───
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow all origins including Vercel production deployments, custom domains, and localhost
    callback(null, true);
  },
  credentials: true, // Allow cookies & authorization headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'x-session-id',
    'x-client-device',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['x-session-id']
});

// ─── 2. Helmet HTTP Security Headers ───
export const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // Handled if serving frontend from same origin
  crossOriginEmbedderPolicy: false
});

// ─── 3. Tiered Rate Limiters ───
// Auth Rate Limiter (Brute-force protection)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 login attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Quá nhiều lần thử đăng nhập thất bại. Vui lòng thử lại sau 15 phút.'
  }
});

// General API Rate Limiter
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Hệ thống đang tiếp nhận quá nhiều yêu cầu. Vui lòng chậm lại.'
  }
});

// GPS Telemetry Burst Rate Limiter
export const gpsRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120, // 120 GPS pings per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Tần suất gửi toạ độ GPS quá cao.'
  }
});

// ─── 4. Global Error Handler ───
export function errorHandler(err, req, res, next) {
  console.error('🔥 [Unhandled Error]:', err);

  const statusCode = err.statusCode || 500;
  const message = config.nodeEnv === 'production' 
    ? 'Đã xảy ra lỗi hệ thống máy chủ nội bộ' 
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.nodeEnv !== 'production' && { stack: err.stack })
  });
}
