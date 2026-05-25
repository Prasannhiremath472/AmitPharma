const { query, transaction } = require('../config/db');

class Order {
  static generateOrderId() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  static async findById(id) {
    const orders = await query(`
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    if (!orders.length) return null;
    const order = orders[0];
    order.items = await this.getOrderItems(id);
    return order;
  }

  static async findByOrderId(orderId) {
    const orders = await query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
    if (!orders.length) return null;
    const order = orders[0];
    order.items = await this.getOrderItems(order.id);
    return order;
  }

  static async getOrderItems(orderId) {
    return query(`
      SELECT oi.*, p.name as product_name,
             (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);
  }

  static async create(orderData) {
    return transaction(async (connection) => {
      const orderId = this.generateOrderId();
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (order_id, user_id, total_amount, discount_amount, tax_amount, shipping_amount, final_amount,
         payment_method, shipping_address, billing_address, coupon_code, coupon_discount, store_id, store_name, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          orderData.user_id,
          orderData.total_amount,
          orderData.discount_amount || 0,
          orderData.tax_amount || 0,
          orderData.shipping_amount || 0,
          orderData.final_amount,
          orderData.payment_method,
          JSON.stringify(orderData.shipping_address),
          JSON.stringify(orderData.billing_address || orderData.shipping_address),
          orderData.coupon_code || null,
          orderData.coupon_discount || 0,
          orderData.store_id || null,
          orderData.store_name || null,
          'pending'
        ]
      );

      const dbOrderId = orderResult.insertId;

      for (const item of orderData.items) {
        await connection.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)',
          [dbOrderId, item.product_id, item.quantity, item.price, item.quantity * item.price]
        );

        await connection.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
          [item.quantity, item.product_id, item.quantity]
        );
      }

      return { id: dbOrderId, order_id: orderId };
    });
  }

  static async updateStatus(id, status, note = null) {
    await query(
      'UPDATE orders SET status = ?, status_note = ?, updated_at = NOW() WHERE id = ?',
      [status, note, id]
    );

    await query(
      'INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)',
      [id, status, note]
    );
  }

  static async updatePayment(id, paymentData) {
    await query(
      `UPDATE orders SET payment_status = ?, razorpay_order_id = ?, razorpay_payment_id = ?,
       razorpay_signature = ?, paid_at = NOW(), updated_at = NOW() WHERE id = ?`,
      [paymentData.status, paymentData.razorpay_order_id, paymentData.razorpay_payment_id, paymentData.razorpay_signature, id]
    );
  }

  static async getUserOrders(userId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      query(`
        SELECT o.*,
               (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
        FROM orders o
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
        LIMIT ? OFFSET ?
      `, [userId, parseInt(limit), parseInt(offset)]),
      query('SELECT COUNT(*) as count FROM orders WHERE user_id = ?', [userId])
    ]);

    return { orders, total: total[0].count, page: parseInt(page), limit: parseInt(limit) };
  }

  static async getAll({ page = 1, limit = 20, status = '', search = '', dateFrom = '', dateTo = '' } = {}) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (status) {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }
    if (search) {
      whereClause += ' AND (o.order_id LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (dateFrom) {
      whereClause += ' AND DATE(o.created_at) >= ?';
      params.push(dateFrom);
    }
    if (dateTo) {
      whereClause += ' AND DATE(o.created_at) <= ?';
      params.push(dateTo);
    }

    const [orders, total] = await Promise.all([
      query(`
        SELECT o.*, u.name as customer_name, u.email as customer_email,
               (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ${whereClause}
        ORDER BY o.created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, parseInt(limit), parseInt(offset)]),
      query(`SELECT COUNT(*) as count FROM orders o LEFT JOIN users u ON o.user_id = u.id ${whereClause}`, params)
    ]);

    return { orders, total: total[0].count, page: parseInt(page), limit: parseInt(limit) };
  }

  static async getStatusHistory(orderId) {
    return query('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC', [orderId]);
  }
}

module.exports = Order;
