const User = require('../models/User');
const { query } = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const { page, limit, search, role } = req.query;
    const result = await User.getAll({ page, limit, search, role });
    res.json({
      success: true,
      data: result.users,
      pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: Math.ceil(result.total / result.limit) }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { role, is_active } = req.body;
    const updateData = {};

    if (role && ['user', 'admin'].includes(role)) updateData.role = role;
    if (typeof is_active !== 'undefined') updateData.is_active = is_active ? 1 : 0;

    const user = await query('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (!user.length) return res.status(404).json({ success: false, message: 'User not found' });

    const fields = Object.keys(updateData);
    if (!fields.length) return res.status(400).json({ success: false, message: 'No valid update fields' });

    const sql = `UPDATE users SET ${fields.map(f => `${f} = ?`).join(', ')}, updated_at = NOW() WHERE id = ?`;
    await query(sql, [...fields.map(f => updateData[f]), req.params.id]);

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    await query('UPDATE users SET is_active = 0 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser };
