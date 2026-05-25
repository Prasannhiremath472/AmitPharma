const { query } = require('../config/db');

class Review {
  static async findById(id) {
    const reviews = await query(`
      SELECT r.*, u.name as user_name, u.avatar as user_avatar
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [id]);
    return reviews[0] || null;
  }

  static async getProductReviews(productId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const [reviews, total, stats] = await Promise.all([
      query(`
        SELECT r.*, u.name as user_name, u.avatar as user_avatar
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ? AND r.is_approved = 1
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, [productId, parseInt(limit), parseInt(offset)]),
      query('SELECT COUNT(*) as count FROM reviews WHERE product_id = ? AND is_approved = 1', [productId]),
      query(`
        SELECT
          COALESCE(AVG(rating), 0) as avg_rating,
          COUNT(*) as total,
          SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
          SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
          SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
          SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
          SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
        FROM reviews WHERE product_id = ? AND is_approved = 1
      `, [productId])
    ]);

    return { reviews, total: total[0].count, page: parseInt(page), limit: parseInt(limit), stats: stats[0] };
  }

  static async create(data) {
    const { product_id, user_id, rating, title, comment } = data;
    const result = await query(
      'INSERT INTO reviews (product_id, user_id, rating, title, comment) VALUES (?, ?, ?, ?, ?)',
      [product_id, user_id, rating, title || null, comment || null]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { rating, title, comment } = data;
    await query(
      'UPDATE reviews SET rating = ?, title = ?, comment = ?, updated_at = NOW() WHERE id = ?',
      [rating, title || null, comment || null, id]
    );
  }

  static async approve(id) {
    await query('UPDATE reviews SET is_approved = 1, updated_at = NOW() WHERE id = ?', [id]);
  }

  static async delete(id) {
    await query('DELETE FROM reviews WHERE id = ?', [id]);
  }

  static async getAll({ page = 1, limit = 20, approved = '' } = {}) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (approved !== '') {
      whereClause += ' AND r.is_approved = ?';
      params.push(approved === 'true' ? 1 : 0);
    }

    const [reviews, total] = await Promise.all([
      query(`
        SELECT r.*, u.name as user_name, p.name as product_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN products p ON r.product_id = p.id
        ${whereClause}
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, parseInt(limit), parseInt(offset)]),
      query(`SELECT COUNT(*) as count FROM reviews r ${whereClause}`, params)
    ]);

    return { reviews, total: total[0].count };
  }

  static async userHasReviewed(productId, userId) {
    const reviews = await query(
      'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?',
      [productId, userId]
    );
    return reviews.length > 0;
  }
}

module.exports = Review;
