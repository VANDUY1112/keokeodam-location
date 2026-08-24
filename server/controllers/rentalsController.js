import { db } from '../database/db.js';

export class RentalsController {
  // GET /api/v1/rentals
  static getAll(req, res) {
    const { status, speakerId } = req.query;
    let query = `
      SELECT r.*, s.name as speaker_name, s.model as speaker_model
      FROM rentals r
      LEFT JOIN speakers s ON r.speaker_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    if (speakerId) {
      query += ' AND r.speaker_id = ?';
      params.push(speakerId);
    }

    query += ' ORDER BY r.created_at DESC';
    const rentals = db.prepare(query).all(...params);

    return res.json({
      success: true,
      data: rentals.map((r) => ({
        id: r.id,
        speakerId: r.speaker_id,
        speakerName: r.speaker_name,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        address: r.address,
        startLat: r.start_lat,
        startLng: r.start_lng,
        destLat: r.dest_lat,
        destLng: r.dest_lng,
        pathCoordinates: r.path_coordinates ? (typeof r.path_coordinates === 'string' ? JSON.parse(r.path_coordinates) : r.path_coordinates) : [],
        startTime: r.start_time,
        endTime: r.end_time,
        durationHours: r.duration_hours,
        rentPrice: r.rent_price,
        shippingFee: r.shipping_fee,
        totalAmount: r.total_amount,
        depositAmount: r.deposit_amount,
        depositStatus: r.deposit_status,
        status: r.status,
        note: r.note,
        createdAt: r.created_at
      }))
    });
  }

  // POST /api/v1/rentals
  static create(req, res) {
    const data = req.body;
    const rentalId = `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const pathCoordsStr = data.pathCoordinates ? (typeof data.pathCoordinates === 'string' ? data.pathCoordinates : JSON.stringify(data.pathCoordinates)) : null;

    // Use transaction to create rental and update speaker status atomically
    const createRentalTx = db.transaction(() => {
      // 1. Insert Rental
      db.prepare(`
        INSERT INTO rentals (
          id, speaker_id, customer_name, customer_phone, address, start_lat, start_lng, dest_lat, dest_lng, path_coordinates,
          start_time, duration_hours, rent_price, shipping_fee, total_amount,
          deposit_amount, deposit_status, status, note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        rentalId, data.speakerId, data.customerName, data.customerPhone, data.address,
        data.startLat || null, data.startLng || null,
        data.destLat || null, data.destLng || null, pathCoordsStr,
        new Date().toISOString(),
        data.durationHours, data.rentPrice, data.shippingFee || 0, data.totalAmount,
        data.depositAmount || 500000, data.depositStatus || 'Đã giữ cọc', 'active', data.note || null
      );

      // 2. Mark Speaker as 'renting'
      db.prepare('UPDATE speakers SET status = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run('renting', data.address, data.speakerId);
    });

    createRentalTx();

    return res.status(201).json({
      success: true,
      message: 'Tạo đơn thuê loa thành công',
      data: { id: rentalId }
    });
  }

  // PATCH /api/v1/rentals/:id/status
  static updateStatus(req, res) {
    const { id } = req.params;
    const { status, depositStatus, note } = req.body;

    const rental = db.prepare('SELECT * FROM rentals WHERE id = ?').get(id);
    if (!rental) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy đơn thuê' });
    }

    const updateStatusTx = db.transaction(() => {
      const endTime = status === 'completed' ? new Date().toISOString() : rental.end_time;
      
      db.prepare(`
        UPDATE rentals 
        SET status = ?, deposit_status = COALESCE(?, deposit_status), note = COALESCE(?, note), end_time = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(status, depositStatus || null, note || null, endTime, id);

      // If completed or cancelled, return speaker to available
      if (status === 'completed' || status === 'cancelled') {
        db.prepare('UPDATE speakers SET status = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run('available', 'Kho Tổng Locahome - 10 Kha Vạn Cân, TP. Thủ Đức', rental.speaker_id);
      }
    });

    updateStatusTx();

    return res.json({
      success: true,
      message: `Cập nhật trạng thái đơn thuê thành '${status}' thành công`
    });
  }
}
