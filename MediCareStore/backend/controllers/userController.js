const User = require('../models/User');
const { uploadBuffer } = require('../config/cloudinary');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    if (req.file) {
      const result = await uploadBuffer(req.file.buffer, 'medicarestore/avatars');
      updateData.avatar = result.url;
    }

    const updated = await User.update(req.user.id, updateData);
    res.json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

const getAddresses = async (req, res) => {
  try {
    const addresses = await User.getAddresses(req.user.id);
    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get addresses' });
  }
};

const addAddress = async (req, res) => {
  try {
    const { name, phone, address_line1, address_line2, city, state, pincode, is_default } = req.body;

    if (!name || !phone || !address_line1 || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'All required address fields must be provided' });
    }

    const id = await User.addAddress(req.user.id, { name, phone, address_line1, address_line2, city, state, pincode, is_default });
    res.status(201).json({ success: true, message: 'Address added successfully', data: { id } });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, message: 'Failed to add address' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await User.deleteAddress(req.params.id, req.user.id);
    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete address' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const { query } = require('../config/db');
    const items = await query(`
      SELECT w.*, p.name, p.price, p.compare_price,
             (SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order LIMIT 1) as image,
             COALESCE(AVG(r.rating), 0) as avg_rating
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
      WHERE w.user_id = ?
      GROUP BY w.id, p.id
      ORDER BY w.created_at DESC
    `, [req.user.id]);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get wishlist' });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { query } = require('../config/db');
    const { product_id } = req.body;

    const existing = await query('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);

    if (existing.length) {
      await query('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);
      return res.json({ success: true, message: 'Removed from wishlist', data: { inWishlist: false } });
    }

    await query('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)', [req.user.id, product_id]);
    res.json({ success: true, message: 'Added to wishlist', data: { inWishlist: true } });
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ success: false, message: 'Failed to update wishlist' });
  }
};

module.exports = { getProfile, updateProfile, getAddresses, addAddress, deleteAddress, getWishlist, toggleWishlist };
