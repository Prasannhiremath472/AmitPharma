const { query, transaction } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async findById(id) {
    const users = await query(
      'SELECT id, name, email, phone, role, avatar, is_active, is_verified, created_at FROM users WHERE id = ?',
      [id]
    );
    return users[0] || null;
  }

  static async findByEmail(email) {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0] || null;
  }

  static async create(userData) {
    const { name, email, password, phone, role = 'user' } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || null, role]
    );
    return { id: result.insertId, name, email, role };
  }

  static async update(id, data) {
    const allowed = ['name', 'phone', 'avatar', 'is_active', 'is_verified'];
    const fields = Object.keys(data).filter(k => allowed.includes(k));
    if (!fields.length) return null;

    const sql = `UPDATE users SET ${fields.map(f => `${f} = ?`).join(', ')}, updated_at = NOW() WHERE id = ?`;
    await query(sql, [...fields.map(f => data[f]), id]);
    return this.findById(id);
  }

  static async updatePassword(id, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 12);
    await query('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?', [hashed, id]);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAll({ page = 1, limit = 20, search = '', role = '' } = {}) {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    const [users, total] = await Promise.all([
      query(`SELECT id, name, email, phone, role, avatar, is_active, is_verified, created_at FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), parseInt(offset)]),
      query(`SELECT COUNT(*) as count FROM users ${whereClause}`, params)
    ]);

    return { users, total: total[0].count, page: parseInt(page), limit: parseInt(limit) };
  }

  static async addAddress(userId, address) {
    const result = await query(
      'INSERT INTO user_addresses (user_id, name, phone, address_line1, address_line2, city, state, pincode, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, address.name, address.phone, address.address_line1, address.address_line2 || null, address.city, address.state, address.pincode, address.is_default ? 1 : 0]
    );
    return result.insertId;
  }

  static async getAddresses(userId) {
    return query('SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC', [userId]);
  }

  static async deleteAddress(addressId, userId) {
    await query('DELETE FROM user_addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
  }
}

module.exports = User;
