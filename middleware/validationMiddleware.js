const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

const validateRegister = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone('any').withMessage('Valid phone number required'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateProduct = [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Product name must be 2-200 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category_id').isInt({ min: 1 }).withMessage('Valid category is required'),
  handleValidationErrors
];

const validateOrder = [
  body('shipping_address').notEmpty().withMessage('Shipping address is required'),
  body('payment_method').isIn(['razorpay', 'cod']).withMessage('Payment method must be razorpay or cod'),
  handleValidationErrors
];

const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters'),
  handleValidationErrors
];

const validateCoupon = [
  body('code').trim().isLength({ min: 3, max: 20 }).withMessage('Coupon code must be 3-20 characters'),
  body('discount_type').isIn(['percentage', 'fixed']).withMessage('Discount type must be percentage or fixed'),
  body('discount_value').isFloat({ min: 0.01 }).withMessage('Discount value must be positive'),
  body('min_order_amount').optional().isFloat({ min: 0 }).withMessage('Minimum order amount must be non-negative'),
  body('max_uses').optional().isInt({ min: 1 }).withMessage('Max uses must be at least 1'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  validateReview,
  validateCoupon,
  handleValidationErrors
};
