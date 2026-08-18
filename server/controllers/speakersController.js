import { db } from '../database/db.js';

export class SpeakersController {
  // GET /api/v1/speakers
  static getAll(req, res) {
    const { status, search } = req.query;
    let query = 'SELECT * FROM speakers WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR model LIKE ? OR id LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY id ASC';
    const speakers = db.prepare(query).all(...params);

    return res.json({
      success: true,
      data: speakers.map((s) => ({
        id: s.id,
        name: s.name,
        model: s.model,
        powerWatts: s.power_watts,
        hourlyRate: s.hourly_rate,
        depositAmount: s.deposit_amount,
        status: s.status,
        batteryPercent: s.battery_percent,
        lat: s.lat,
        lng: s.lng,
        address: s.address,
        serialNumber: s.serial_number,
        imageUrl: s.image_url,
        createdAt: s.created_at
      }))
    });
  }

  // GET /api/v1/speakers/:id
  static getById(req, res) {
    const { id } = req.params;
    const s = db.prepare('SELECT * FROM speakers WHERE id = ?').get(id);

    if (!s) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy thông tin loa' });
    }

    // Get current active rental if renting
    const activeRental = db.prepare('SELECT * FROM rentals WHERE speaker_id = ? AND status = ? ORDER BY created_at DESC LIMIT 1').get(id, 'active');

    return res.json({
      success: true,
      data: {
        speaker: {
          id: s.id,
          name: s.name,
          model: s.model,
          powerWatts: s.power_watts,
          hourlyRate: s.hourly_rate,
          depositAmount: s.deposit_amount,
          status: s.status,
          batteryPercent: s.battery_percent,
          lat: s.lat,
          lng: s.lng,
          address: s.address,
          serialNumber: s.serial_number,
          imageUrl: s.image_url,
          createdAt: s.created_at
        },
        activeRental: activeRental ? {
          id: activeRental.id,
          customerName: activeRental.customer_name,
          customerPhone: activeRental.customer_phone,
          address: activeRental.address,
          startTime: activeRental.start_time,
          durationHours: activeRental.duration_hours,
          totalAmount: activeRental.total_amount
        } : null
      }
    });
  }

  // POST /api/v1/speakers
  static create(req, res) {
    const data = req.body;
    const stmt = db.prepare(`
      INSERT INTO speakers (id, name, model, power_watts, hourly_rate, deposit_amount, status, battery_percent, lat, lng, address, serial_number, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.id, data.name, data.model || null, data.powerWatts || 600,
      data.hourlyRate || 60000, data.depositAmount || 500000, data.status || 'available',
      data.batteryPercent || 100, data.lat || 10.8505, data.lng || 106.7718,
      data.address || 'Kho Tổng Locahome', data.serialNumber || null, data.imageUrl || null
    );

    return res.status(201).json({
      success: true,
      message: 'Thêm loa mới vào kho thành công',
      data: { id: data.id }
    });
  }

  // PATCH /api/v1/speakers/:id
  static update(req, res) {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM speakers WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy loa' });
    }

    const updates = req.body;
    const fields = [];
    const values = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
    if (updates.batteryPercent !== undefined) { fields.push('battery_percent = ?'); values.push(updates.batteryPercent); }
    if (updates.hourlyRate !== undefined) { fields.push('hourly_rate = ?'); values.push(updates.hourlyRate); }
    if (updates.lat !== undefined) { fields.push('lat = ?'); values.push(updates.lat); }
    if (updates.lng !== undefined) { fields.push('lng = ?'); values.push(updates.lng); }
    if (updates.address !== undefined) { fields.push('address = ?'); values.push(updates.address); }

    if (fields.length === 0) {
      return res.json({ success: true, message: 'Không có dữ liệu thay đổi' });
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    db.prepare(`UPDATE speakers SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    return res.json({
      success: true,
      message: 'Cập nhật thiết bị thành công'
    });
  }
}
