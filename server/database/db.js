import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

// Ensure data folder exists
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(config.dbPath);

// ─── High Performance & Safety SQLite Pragmas ───
db.pragma('journal_mode = WAL'); // Write-Ahead Logging for high concurrency
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON'); // Enforce Foreign Key constraints

// ─── Initialize Database Schema ───
export function initDatabase() {
  db.exec(`
    -- 1. USERS & AUTH TABLE
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff', -- 'admin', 'staff', 'driver'
      avatar_url TEXT,
      active_session_id TEXT,
      last_login_device TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. REFRESH TOKENS (For secure token rotation & blacklisting)
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 3. SPEAKERS & INVENTORY TABLE
    CREATE TABLE IF NOT EXISTS speakers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      model TEXT,
      power_watts INTEGER NOT NULL DEFAULT 600,
      hourly_rate INTEGER NOT NULL DEFAULT 60000,
      deposit_amount INTEGER NOT NULL DEFAULT 500000,
      status TEXT NOT NULL DEFAULT 'available', -- 'available', 'renting', 'maintenance'
      battery_percent INTEGER NOT NULL DEFAULT 100,
      lat REAL,
      lng REAL,
      address TEXT,
      serial_number TEXT UNIQUE,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. RENTALS & ORDERS TABLE
    CREATE TABLE IF NOT EXISTS rentals (
      id TEXT PRIMARY KEY,
      speaker_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      address TEXT NOT NULL,
      start_lat REAL,
      start_lng REAL,
      dest_lat REAL,
      dest_lng REAL,
      path_coordinates TEXT,
      start_time DATETIME NOT NULL,
      end_time DATETIME,
      duration_hours REAL NOT NULL DEFAULT 4,
      rent_price INTEGER NOT NULL DEFAULT 240000,
      shipping_fee INTEGER NOT NULL DEFAULT 40000,
      total_amount INTEGER NOT NULL DEFAULT 280000,
      deposit_amount INTEGER NOT NULL DEFAULT 500000,
      deposit_status TEXT NOT NULL DEFAULT 'Đã giữ cọc', -- 'Đã giữ cọc', 'Đã hoàn cọc'
      status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'cancelled'
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (speaker_id) REFERENCES speakers(id)
    );

    -- 5. GPS TELEMETRY & BREADCRUMBS TABLE
    CREATE TABLE IF NOT EXISTS gps_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      speaker_id TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      speed_kmh REAL DEFAULT 0,
      heading REAL DEFAULT 0,
      battery_percent INTEGER,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE
    );

    -- Index for fast GPS history queries
    CREATE INDEX IF NOT EXISTS idx_gps_speaker_time ON gps_logs(speaker_id, recorded_at DESC);

    -- 6. EXPENSES & ACCOUNTING TABLE
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount INTEGER NOT NULL,
      category TEXT NOT NULL, -- 'Nhiên liệu & Xăng xe', 'Bảo trì thiết bị', 'Ăn uống & Tiếp khách', 'Phụ kiện', 'Khác'
      subtitle TEXT,
      date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Đã thanh toán',
      speaker_id TEXT,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE SET NULL
    );

    -- 7. SETTINGS & APP CONFIG TABLE
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 8. CUSTOMER REVIEWS & OWNER REPLIES TABLE
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'Khách hàng thân thiết',
      rating INTEGER NOT NULL DEFAULT 5,
      category TEXT DEFAULT 'karaoke',
      comment TEXT NOT NULL,
      avatar_url TEXT,
      avatar_letter TEXT,
      avatar_color TEXT DEFAULT 'pink',
      color_scheme TEXT DEFAULT 'pink',
      title TEXT,
      banner_image TEXT,
      verified INTEGER NOT NULL DEFAULT 1,
      post_time_formatted TEXT,
      owner_reply TEXT,
      owner_reply_at DATETIME,
      owner_reply_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Auto-migrate new columns for existing SQLite database
  try { db.exec('ALTER TABLE rentals ADD COLUMN start_lat REAL;'); } catch (e) {}
  try { db.exec('ALTER TABLE rentals ADD COLUMN start_lng REAL;'); } catch (e) {}
  try { db.exec('ALTER TABLE rentals ADD COLUMN path_coordinates TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE users ADD COLUMN active_session_id TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE users ADD COLUMN last_login_device TEXT;'); } catch (e) {}

  // Clean out initial mock seed rows so only real user data remains
  try {
    db.exec(`
      DELETE FROM rentals WHERE id IN ('ORD-2026-001', 'ORD-2026-002', 'ORD-2026-003');
      DELETE FROM expenses WHERE id IN ('EXP-01', 'EXP-02', 'EXP-03', 'EXP-04');
    `);
  } catch (e) {}
}
