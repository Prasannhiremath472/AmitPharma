const { query } = require('../config/db');

class Coupon {
  static async findById(id) {
    const coupons = await query('SELECT * FROM coupons WHERE id = ?', [id]);
    return coupons[0] || null;
  }

  static async findByCode(code) {
    const coupons = await query('SELECT * FROM coupons WHERE code = ?', [code.toUpperCase()]);
    return coupons[0] || null;
  }

  static async validate(code, userId, orderAmount) {
    const coupon = await this.findByCode(code);

    if (!coupon) return { valid: false, message: 'Invalid coupon code' };
    if (!coupon.is_active) return { valid: false, message: 'This coupon is inactive' };
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return { valid: false, message: 'Coupon has expired' };
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return { valid: false, message: 'Coupon usage limit reached' };
    if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
      return { valid: false, message: `Minimum order amount of ₹${coupon.min_order_amount} required` };
    }

    // Check user usage
    const userUsage = await query(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND coupon_code = ?',
      [userId, code.toUpperCase()]
    );
    if (coupon.max_uses_per_user && userUsage[0].count >= coupon.max_uses_per_user) {
      return { valid: false, message: 'You have already used this coupon' };
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (orderAmount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discount = Math.min(discount, coupon.max_discount_amount);
      }
    } else {
      discount = coupon.discount_value;
    }

    discount = Math.min(discount, orderAmount);

    return { valid: true, coupon, discount: Math.round(discount * 100) / 100 };
  }

  static async incrementUsage(code) {
    await query('UPDATE coupons SET used_count = used_count + 1 WHERE code = ?', [code.toUpperCase()]);
  }

  static async create(data) {
    const { code, discount_type, discount_value, min_order_amount, max_discount_amount, max_uses, max_uses_per_user, expires_at } = data;
    const result = await query(
      'INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount_amount, max_uses, max_uses_per_user, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [code.toUpperCase(), discount_type, discount_value, min_order_amount || null, max_discount_amount || null, max_uses || null, max_uses_per_user || null, expires_at || null]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const allowed = ['code', 'discount_type', 'discount_value', 'min_order_amount', 'max_discount_amount', 'max_uses', 'max_uses_per_user', 'expires_at', 'is_active'];
    const fields = Object.keys(data).filter(k => allowed.includes(k));
    if (!fields.length) return null;

    const sql = `UPDATE coupons SET ${fields.map(f => `${f} = ?`).join(', ')}, updated_at = NOW() WHERE id = ?`;
    await query(sql, [...fields.map(f => data[f]), id]);
    return this.findById(id);
  }

  static async delete(id) {
    await query('DELETE FROM coupons WHERE id = ?', [id]);
  }

  static async getAll({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const [coupons, total] = await Promise.all([
      query('SELECT * FROM coupons ORDER BY created_at DESC LIMIT ? OFFSET ?', [parseInt(limit), parseInt(offset)]),
      query('SELECT COUNT(*) as count FROM coupons')
    ]);
    return { coupons, total: total[0].count };
  }
}

module.exports = Coupon;
