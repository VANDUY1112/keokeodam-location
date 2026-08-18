import { db } from '../database/db.js';

export class ExpensesController {
  // GET /api/v1/expenses
  static getAll(req, res) {
    const { category, status } = req.query;
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const expenses = db.prepare(query).all(...params);

    const totalSpent = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE status = 'Đã duyệt'").get().total;
    const pendingCount = db.prepare("SELECT COUNT(*) as count FROM expenses WHERE status = 'Chờ duyệt'").get().count;

    return res.json({
      success: true,
      data: {
        totalSpent,
        pendingCount,
        expenses: expenses.map((e) => ({
          id: e.id,
          title: e.title,
          amount: e.amount,
          category: e.category,
          subtitle: e.subtitle,
          icon: e.icon,
          status: e.status,
          receiptUrl: e.receipt_url,
          createdAt: e.created_at
        }))
      }
    });
  }

  // POST /api/v1/expenses
  static create(req, res) {
    const data = req.body;
    const expenseId = `EXP-${Date.now().toString().slice(-6)}`;

    db.prepare(`
      INSERT INTO expenses (id, title, amount, category, subtitle, icon, status, receipt_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      expenseId, data.title, data.amount, data.category,
      data.subtitle || 'Hôm nay', data.icon || 'receipt',
      data.status || 'Đã duyệt', data.receiptUrl || null
    );

    return res.status(201).json({
      success: true,
      message: 'Ghi nhận khoản chi thành công',
      data: { id: expenseId }
    });
  }

  // PATCH /api/v1/expenses/:id/approve
  static approve(req, res) {
    const { id } = req.params;
    const { status } = req.body; // 'Đã duyệt' | 'Từ chối'

    const result = db.prepare('UPDATE expenses SET status = ? WHERE id = ?').run(status || 'Đã duyệt', id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy hóa đơn chi phí' });
    }

    return res.json({
      success: true,
      message: `Đã cập nhật trạng thái chi phí thành '${status || 'Đã duyệt'}'`
    });
  }
}
