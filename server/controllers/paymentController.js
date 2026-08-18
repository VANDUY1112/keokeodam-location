import { db } from '../database/db.js';
import { broadcastGpsUpdate } from '../socket/gpsSocket.js';

export class PaymentController {
  // POST /api/v1/payment/webhook (Standard SePAY / Casso / Bank Webhook)
  static handleWebhook(req, res) {
    const { transferAmount, content, referenceCode, gateway, accountNumber } = req.body;
    const amount = Number(transferAmount) || 0;
    const note = content || 'Chuyển khoản VietQR';
    const txId = referenceCode || `TX-${Date.now()}`;

    if (amount <= 0) {
      return res.status(400).json({ success: false, error: 'Số tiền giao dịch không hợp lệ' });
    }

    // 1. Record income transaction in database
    const insertIncome = db.prepare(`
      INSERT INTO expenses (id, title, amount, category, subtitle, icon, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertIncome.run(
      `INC-${Date.now()}`,
      `Thu tiền VietQR - ${note}`,
      amount,
      'Doanh thu',
      `Vừa xong • Chuyển khoản ${gateway || 'Napas 247'}`,
      'qr_code_2',
      'Đã duyệt'
    );

    // 2. Broadcast payment success event to WebSocket clients
    const payload = {
      type: 'PAYMENT_SUCCESS',
      data: {
        transactionId: txId,
        amount,
        content: note,
        gateway: gateway || 'MBBank',
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

  // POST /api/v1/payment/simulate-success (For Instant Testing / Demo)
  static simulateSuccess(req, res) {
    const { amount = 500000, content = 'KEO KEO DAM nhan 500.000' } = req.body;
    const txId = `MB-${Date.now().toString().slice(-6)}`;

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
