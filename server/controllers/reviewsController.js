import { db } from '../database/db.js';

export class ReviewsController {
  // GET /api/v1/reviews
  static getAll(req, res) {
    try {
      const { rating, category, sort } = req.query;
      let query = 'SELECT * FROM reviews WHERE 1=1';
      const params = [];

      if (rating) {
        query += ' AND rating = ?';
        params.push(Number(rating));
      }

      if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
      }

      if (sort === 'oldest') {
        query += ' ORDER BY created_at ASC';
      } else if (sort === 'highest') {
        query += ' ORDER BY rating DESC, created_at DESC';
      } else {
        query += ' ORDER BY created_at DESC';
      }

      const rows = db.prepare(query).all(...params);

      const reviews = rows.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role || 'Khách hàng thân thiết',
        rating: r.rating,
        category: r.category || 'karaoke',
        comment: r.comment,
        avatar: r.avatar_url,
        avatarLetter: r.avatar_letter || (r.name ? r.name.charAt(0).toUpperCase() : 'K'),
        avatarColor: r.avatar_color || 'pink',
        colorScheme: r.color_scheme || 'pink',
        title: r.title,
        bannerImage: r.banner_image,
        verified: Boolean(r.verified),
        time: r.post_time_formatted || r.created_at,
        ownerReply: r.owner_reply || null,
        ownerReplyAt: r.owner_reply_at || null,
        ownerReplyBy: r.owner_reply_by || null,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      }));

      // Calculate review summary stats
      const totalCount = reviews.length;
      const averageRating = totalCount > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalCount).toFixed(1)
        : 5.0;

      return res.json({
        success: true,
        data: {
          totalCount,
          averageRating: Number(averageRating),
          reviews
        }
      });
    } catch (err) {
      console.error('[ReviewsController.getAll Error]:', err);
      return res.status(500).json({ success: false, error: 'Không thể lấy danh sách đánh giá' });
    }
  }

  // POST /api/v1/reviews
  static create(req, res) {
    try {
      const data = req.body;

      if (!data.name || !data.name.trim()) {
        return res.status(400).json({ success: false, error: 'Vui lòng nhập tên của bạn' });
      }
      if (!data.comment || !data.comment.trim() || data.comment.trim().length < 5) {
        return res.status(400).json({ success: false, error: 'Nội dung đánh giá phải có ít nhất 5 ký tự' });
      }

      const id = `REV-${Date.now()}`;
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const formattedPostTime = data.time || `${pad(now.getHours())}:${pad(now.getMinutes())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

      const avatarLetter = data.avatarLetter || data.name.trim().charAt(0).toUpperCase();
      const avatarColors = ['pink', 'blue', 'green', 'purple'];
      const colorSchemes = ['pink', 'blue', 'green'];
      const avatarColor = data.avatarColor || avatarColors[Math.floor(Math.random() * avatarColors.length)];
      const colorScheme = data.colorScheme || colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
      const defaultAvatarForColor = colorScheme === 'green' ? '/green.png' : colorScheme === 'blue' ? '/blue.png' : '/pink.png';
      const avatarUrl = data.avatar || data.avatarUrl || data.avatar_url || defaultAvatarForColor;

      const stmt = db.prepare(`
        INSERT INTO reviews (
          id, name, role, rating, category, comment, avatar_url,
          avatar_letter, avatar_color, color_scheme, title, banner_image,
          verified, post_time_formatted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        data.name.trim(),
        '',
        rating,
        data.category || 'karaoke',
        data.comment.trim(),
        avatarUrl,
        avatarLetter,
        avatarColor,
        colorScheme,
        data.title || null,
        data.bannerImage || null,
        data.verified !== undefined ? (data.verified ? 1 : 0) : 1,
        formattedPostTime
      );

      return res.status(201).json({
        success: true,
        message: 'Gửi đánh giá thành công! Cảm ơn bạn đã đóng góp ý kiến.',
        data: {
          id,
          name: data.name.trim(),
          rating,
          time: formattedPostTime
        }
      });
    } catch (err) {
      console.error('[ReviewsController.create Error]:', err);
      return res.status(500).json({ success: false, error: 'Lỗi khi gửi đánh giá, vui lòng thử lại' });
    }
  }

  // PATCH /api/v1/reviews/:id/reply (Owner/Admin Reply)
  static reply(req, res) {
    try {
      const { id } = req.params;
      const { replyText, ownerName } = req.body;

      if (replyText === undefined) {
        return res.status(400).json({ success: false, error: 'Nội dung phản hồi không được để trống' });
      }

      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const replyTime = `${pad(now.getHours())}:${pad(now.getMinutes())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
      const responder = ownerName || 'Kẹo Kéo Dặm';

      const cleanReply = replyText ? replyText.trim() : null;

      const result = db.prepare(`
        UPDATE reviews
        SET owner_reply = ?,
            owner_reply_at = ?,
            owner_reply_by = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(cleanReply, cleanReply ? replyTime : null, cleanReply ? responder : null, id);

      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy đánh giá cần trả lời' });
      }

      return res.json({
        success: true,
        message: cleanReply ? 'Đã đăng phản hồi từ chủ quán thành công' : 'Đã xóa phản hồi',
        data: {
          id,
          ownerReply: cleanReply,
          ownerReplyAt: cleanReply ? replyTime : null,
          ownerReplyBy: cleanReply ? responder : null
        }
      });
    } catch (err) {
      console.error('[ReviewsController.reply Error]:', err);
      return res.status(500).json({ success: false, error: 'Lỗi khi cập nhật câu trả lời' });
    }
  }

  // DELETE /api/v1/reviews/:id
  static delete(req, res) {
    try {
      const { id } = req.params;
      const result = db.prepare('DELETE FROM reviews WHERE id = ?').run(id);

      if (result.changes === 0) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy đánh giá' });
      }

      return res.json({
        success: true,
        message: 'Đã xóa đánh giá thành công'
      });
    } catch (err) {
      console.error('[ReviewsController.delete Error]:', err);
      return res.status(500).json({ success: false, error: 'Lỗi khi xóa đánh giá' });
    }
  }
}
