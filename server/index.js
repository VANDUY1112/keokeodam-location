import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { initDatabase } from './database/db.js';
import { seedDatabase } from './database/seed.js';
import { corsMiddleware, helmetMiddleware, apiRateLimiter, errorHandler } from './middlewares/security.js';
import { router } from './routes/index.js';
import { initWebSocketServer } from './socket/gpsSocket.js';

// Initialize Database & Seed
initDatabase();
await seedDatabase();

const app = express();
const server = http.createServer(app);

// Initialize Realtime WebSocket GPS Server
initWebSocketServer(server);

// Standard Security & Body Parsers
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Apply General Rate Limiter to all API routes
app.use('/api', apiRateLimiter);

// Mount API v1
app.use('/api/v1', router);

// Global Error Handler
app.use(errorHandler);

// Start HTTP & WS Server
server.listen(config.port, () => {
  console.log(`
🚀 Locahome Secure Backend Server Running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 API Endpoint : http://localhost:${config.port}/api/v1
🛰️ WebSocket GPS : ws://localhost:${config.port}/ws/gps
🛡️ Security     : Helmet + Rate Limiting + OWASP JWT HttpOnly
📦 Database     : SQLite (WAL Mode High Performance)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

export default app;
