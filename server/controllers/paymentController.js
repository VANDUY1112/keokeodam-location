import { db } from '../database/db.js';
import { broadcastGpsUpdate } from '../socket/gpsSocket.js';

export class PaymentController {
  // POST /api/v1/payment/webhook (Standard SePAY / Casso / Bank Webhook)
  static handleWebhook(req, res) {
    let amount = 0;
    let note = 'Chuyển khoản VietQR';
    let txId = `TX-${Date.now()}`;
    let gateway = 'MBBank';

    // 1. Check Casso Format: { data: [ { amount, description, tid, ... } ] }
    if (Array.isArray(req.body?.data) && req.body.data.length > 0) {
      const item = req.body.data[0];
      amount = Number(item.amount) || 0;
      note = item.description || note;
      txId = item.tid ? String(item.tid) : txId;
      gateway = 'Casso Bank Webhook';
    } 
    // 2. Check SePay Format: { transferAmount, content, referenceCode, gateway }
    else if (req.body?.transferAmount !== undefined || req.body?.content !== undefined) {
      amount = Number(req.body.transferAmount || req.body.amount) || 0;
      note = req.body.content || req.body.description || note;
      txId = req.body.referenceCode || req.body.transactionId || txId;
      gateway = req.body.gateway || 'SePay Napas 247';
    } 
    // 3. Generic Format
    else {
      amount = Number(req.body?.amount) || 0;
      note = req.body?.content || req.body?.note || note;
      txId = req.body?.transactionId || txId;
      gateway = req.body?.gateway || 'Napas 247';
    }

    if (amount <= 0) {
      return res.status(400).json({ success: false, error: 'Số tiền giao dịch không hợp lệ' });
    }

    // Record income transaction in database
    const insertIncome = db.prepare(`
      INSERT INTO expenses (id, title, amount, category, subtitle, icon, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertIncome.run(
      `INC-${Date.now()}`,
      `Thu tiền VietQR - ${note}`,
      amount,
      'Doanh thu',
      `Vừa xong • Chuyển khoản ${gateway}`,
      'qr_code_2',
      'Đã duyệt'
    );

    // Broadcast payment success event to WebSocket clients
    const payload = {
      type: 'PAYMENT_SUCCESS',
      data: {
        transactionId: txId,
        amount,
        content: note,
        gateway,
        timestamp: new Date().toISOString()
      }
    };

    broadcastGpsUpdate(payload);

    return res.json({
      success: true,
      message: 'Xử lý webhook thanh toán thành công',
      data: payload.data
    });
  }

  // GET /api/v1/payment/check (For Polling Fallback)
  static checkRecentPayment(req, res) {
    const { note, amount } = req.query;
    try {
      // Find latest income expense in the last 2 minutes
      const latestIncome = db.prepare(`
        SELECT * FROM expenses 
        WHERE category = 'Doanh thu' 
        ORDER BY created_at DESC 
        LIMIT 1
      `).get();

      if (latestIncome) {
        return res.json({
          success: true,
          data: latestIncome
        });
      }
      return res.json({ success: true, data: null });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // POST /api/v1/payment/simulate-success (For Instant Testing / Demo)
  static simulateSuccess(req, res) {
    const { amount = 500000, content = 'KEO KEO DAM nhan 500.000' } = req.body;
    const txId = `MB-${Date.now().toString().slice(-6)}`;

    // Insert into income database
    const insertIncome = db.prepare(`
      INSERT INTO expenses (id, title, amount, category, subtitle, icon, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertIncome.run(
      `INC-${Date.now()}`,
      `Thu tiền VietQR - ${content}`,
      Number(amount) || 500000,
      'Doanh thu',
      `Vừa xong • Chuyển khoản MBBank Napas 247`,
      'qr_code_2',
      'Đã duyệt'
    );

    // Broadcast to WebSocket clients
    const payload = {
      type: 'PAYMENT_SUCCESS',
      data: {
        transactionId: txId,
        amount: Number(amount) || 500000,
        content,
        gateway: 'MBBank (Napas 247)',
        timestamp: new Date().toISOString()
      }
    };

    broadcastGpsUpdate(payload);

    return res.json({
      success: true,
      message: 'Đã phát tín hiệu thanh toán thành công qua WebSocket',
      data: payload.data
    });
  }
}
