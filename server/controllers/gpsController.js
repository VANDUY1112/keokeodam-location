import { db } from '../database/db.js';
import { broadcastGpsUpdate } from '../socket/gpsSocket.js';

export class GpsController {
  // POST /api/v1/gps/ping (Record telemetry & broadcast to WebSocket clients)
  static ping(req, res) {
    const { speakerId, lat, lng, speedKmh, heading, batteryPercent } = req.body;

    const speaker = db.prepare('SELECT id FROM speakers WHERE id = ?').get(speakerId);
    if (!speaker) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy loa' });
    }

    const logTx = db.transaction(() => {
      // 1. Insert GPS History Log
      db.prepare(`
        INSERT INTO gps_logs (speaker_id, lat, lng, speed_kmh, heading, battery_percent)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(speakerId, lat, lng, speedKmh || 0, heading || 0, batteryPercent || null);

      // 2. Update Speaker's live location and battery
      db.prepare(`
        UPDATE speakers 
        SET lat = ?, lng = ?, battery_percent = COALESCE(?, battery_percent), updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(lat, lng, batteryPercent || null, speakerId);
    });

    logTx();

    const payload = {
      speakerId,
      lat,
      lng,
      speedKmh: speedKmh || 0,
      heading: heading || 0,
      batteryPercent,
      timestamp: new Date().toISOString()
    };

    // Realtime broadcast to connected frontend map clients
    broadcastGpsUpdate(payload);

    return res.json({
      success: true,
      message: 'Cập nhật toạ độ GPS thành công',
      data: payload
    });
  }

  // GET /api/v1/gps/history/:speakerId
  static getHistory(req, res) {
    const { speakerId } = req.params;
    const limit = parseInt(req.query.limit || '100', 10);

    const logs = db.prepare(`
      SELECT lat, lng, speed_kmh, heading, battery_percent, recorded_at
      FROM gps_logs
      WHERE speaker_id = ?
      ORDER BY recorded_at DESC
      LIMIT ?
    `).all(speakerId, limit);

    return res.json({
      success: true,
      data: {
        speakerId,
        points: logs.reverse().map((l) => ({
          lat: l.lat,
          lng: l.lng,
          speedKmh: l.speed_kmh,
          heading: l.heading,
          battery: l.battery_percent,
          recordedAt: l.recorded_at
        }))
      }
    });
  }
}
