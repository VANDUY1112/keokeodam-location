import { db } from '../database/db.js';

export class ReportsController {
  // GET /api/v1/reports/summary?range=7d|30d|ytd
  static getSummary(req, res) {
    const range = req.query.range || '7d';

    let dayInterval = 7;
    if (range === '30d') dayInterval = 30;
    if (range === 'ytd') dayInterval = 365;

    // Aggregate statistics from rentals
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_rentals,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(shipping_fee), 0) as total_shipping_income,
        COALESCE(AVG(duration_hours), 4.0) as avg_duration,
        COALESCE(AVG(total_amount), 0) as avg_per_rental
      FROM rentals
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `).get(dayInterval);

    // Aggregate by speaker category
    const categoryShare = db.prepare(`
      SELECT 
        s.name as speaker_name,
        COUNT(r.id) as count,
        COALESCE(SUM(r.total_amount), 0) as revenue
      FROM speakers s
      LEFT JOIN rentals r ON s.id = r.speaker_id
      GROUP BY s.id
      ORDER BY revenue DESC
    `).all();

    // Chart daily or weekly aggregation
    const chartData = db.prepare(`
      SELECT 
        strftime('%Y-%m-%d', created_at) as date_label,
        COUNT(id) as orders,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM rentals
      WHERE created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY strftime('%Y-%m-%d', created_at)
      ORDER BY date_label ASC
    `).all(dayInterval);

    return res.json({
      success: true,
      data: {
        range,
        summary: {
          totalRentals: stats.total_rentals || 0,
          totalRevenue: stats.total_revenue || 0,
          shippingIncome: stats.total_shipping_income || 0,
          avgDurationHours: stats.total_rentals > 0 ? Number(stats.avg_duration.toFixed(1)) : 0,
          avgPerRental: stats.total_rentals > 0 ? Math.round(stats.avg_per_rental) : 0,
          distanceKm: 0
        },
        categoryShare: categoryShare.map((c) => ({
          name: c.speaker_name,
          count: c.count || 0,
          revenue: c.revenue || 0,
          percent: stats.total_revenue > 0 ? Math.round((c.revenue / stats.total_revenue) * 100) : 0
        })),
        chartData: chartData
      }
    });
  }
}

export class SettingsController {
  // GET /api/v1/settings
  static getSettings(req, res) {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};

    for (const r of rows) {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    }

    return res.json({
      success: true,
      data: settings
    });
  }

  // PUT /api/v1/settings
  static updateSettings(req, res) {
    const updates = req.body;
    const updateTx = db.transaction(() => {
      const stmt = db.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `);

      for (const [key, val] of Object.entries(updates)) {
        stmt.run(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
      }
    });

    updateTx();

    return res.json({
      success: true,
      message: 'Cập nhật cấu hình hệ thống thành công'
    });
  }
}
