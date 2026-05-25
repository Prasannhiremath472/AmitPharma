const { query } = require('../config/db');

class Cart {
  static async getByUserId(userId) {
    const items = await query(`
      SELECT ci.*, p.name, p.price, p.stock, p.is_active,
             (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) as image,
             p.compare_price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [userId]);
    return items;
  }

  static async findItem(userId, productId) {
    const items = await query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return items[0] || null;
  }

  static async addItem(userId, productId, quantity = 1) {
    const existing = await this.findItem(userId, productId);
    if (existing) {
      await query(
        'UPDATE cart_items SET quantity = quantity + ?, updated_at = NOW() WHERE id = ?',
        [quantity, existing.id]
      );
      return { ...existing, quantity: existing.quantity + quantity };
    }

    const result = await query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
    return { id: result.insertId, user_id: userId, product_id: productId, quantity };
  }

  static async updateQuantity(userId, productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }
    await query(
      'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
  }

  static async removeItem(userId, productId) {
    await query('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId]);
  }

  static async clear(userId) {
    await query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  }

  static async getCount(userId) {
    const result = await query(
      'SELECT SUM(quantity) as count FROM cart_items WHERE user_id = ?',
      [userId]
    );
    return result[0].count || 0;
  }

  static calculateTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const savings = items.reduce((sum, item) => {
      if (item.compare_price && item.compare_price > item.price) {
        return sum + ((item.compare_price - item.price) * item.quantity);
      }
      return sum;
    }, 0);
    const shipping = subtotal > 499 ? 0 : 49;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const total = subtotal + shipping;

    return { subtotal: Math.round(subtotal * 100) / 100, savings: Math.round(savings * 100) / 100, shipping, tax, total: Math.round(total * 100) / 100 };
  }
}

module.exports = Cart;
