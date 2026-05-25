const Coupon = require('../models/Coupon');

const getCoupons = async (req, res) => {
  try {
    const result = await Coupon.getAll(req.query);
    res.json({ success: true, data: result.coupons, pagination: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code || !orderAmount) {
      return res.status(400).json({ success: false, message: 'Coupon code and order amount required' });
    }

    const result = await Coupon.validate(code, req.user.id, parseFloat(orderAmount));
    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({ success: true, message: 'Coupon applied', data: { discount: result.discount, coupon: { code: result.coupon.code, discount_type: result.coupon.discount_type, discount_value: result.coupon.discount_value } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to validate coupon' });
  }
};

const createCoupon = async (req, res) => {
  try {
    const id = await Coupon.create(req.body);
    const coupon = await Coupon.findById(id);
    res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    const updated = await Coupon.update(req.params.id, req.body);
    res.json({ success: true, message: 'Coupon updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update coupon' });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    await Coupon.delete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
};

module.exports = { getCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon };
