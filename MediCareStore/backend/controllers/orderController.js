const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const { createOrder: createRazorpayOrder, verifyPaymentSignature } = require('../config/razorpay');
const { sendOrderConfirmationEmail } = require('../config/mailer');

// @desc    Create order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { shipping_address, billing_address, payment_method, coupon_code, store_id, store_name } = req.body;
    const userId = req.user.id;

    const cartItems = await Cart.getByUserId(userId);
    if (!cartItems.length) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Check stock
    for (const item of cartItems) {
      if (!item.is_active) {
        return res.status(400).json({ success: false, message: `Product "${item.name}" is no longer available` });
      }
      if (item.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for "${item.name}"` });
      }
    }

    const totals = Cart.calculateTotals(cartItems);
    let couponDiscount = 0;
    let validCouponCode = null;

    if (coupon_code) {
      const validation = await Coupon.validate(coupon_code, userId, totals.subtotal);
      if (!validation.valid) {
        return res.status(400).json({ success: false, message: validation.message });
      }
      couponDiscount = validation.discount;
      validCouponCode = coupon_code.toUpperCase();
    }

    const finalAmount = Math.max(0, totals.total - couponDiscount);

    const orderData = {
      user_id: userId,
      total_amount: totals.subtotal,
      discount_amount: totals.savings,
      tax_amount: totals.tax,
      shipping_amount: totals.shipping,
      final_amount: finalAmount,
      payment_method,
      shipping_address,
      billing_address,
      coupon_code: validCouponCode,
      coupon_discount: couponDiscount,
      store_id: store_id || null,
      store_name: store_name || null,
      items: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    const order = await Order.create(orderData);

    if (validCouponCode) {
      await Coupon.incrementUsage(validCouponCode);
    }

    // For Razorpay, create payment order
    if (payment_method === 'razorpay') {
      const razorpayOrder = await createRazorpayOrder(finalAmount, 'INR', order.order_id);
      await Order.updatePayment(order.id, { razorpay_order_id: razorpayOrder.id, status: 'pending' });

      await Cart.clear(userId);

      return res.status(201).json({
        success: true,
        message: 'Order created. Complete payment.',
        data: {
          orderId: order.order_id,
          dbOrderId: order.id,
          razorpayOrderId: razorpayOrder.id,
          amount: finalAmount,
          currency: 'INR',
          keyId: process.env.RAZORPAY_KEY_ID
        }
      });
    }

    // For COD
    await Order.updateStatus(order.id, 'confirmed', 'Order confirmed with Cash on Delivery');
    await Cart.clear(userId);

    try {
      await sendOrderConfirmationEmail(req.user.email, {
        orderId: order.order_id,
        customerName: req.user.name,
        totalAmount: finalAmount,
        paymentMethod: 'Cash on Delivery'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { orderId: order.order_id, dbOrderId: order.id, amount: finalAmount }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await Order.updatePayment(order.id, {
      status: 'paid',
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    await Order.updateStatus(order.id, 'confirmed', 'Payment received successfully');

    try {
      await sendOrderConfirmationEmail(req.user.email, {
        orderId,
        customerName: req.user.name,
        totalAmount: order.final_amount,
        paymentMethod: 'Online Payment'
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.json({
      success: true,
      message: 'Payment verified and order confirmed',
      data: { orderId }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await Order.getUserOrders(req.user.id, { page, limit });
    res.json({
      success: true,
      data: result.orders,
      pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: Math.ceil(result.total / result.limit) }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:orderId
const getOrder = async (req, res) => {
  try {
    const order = await Order.findByOrderId(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const statusHistory = await Order.getStatusHistory(order.id);
    res.json({ success: true, data: { ...order, statusHistory } });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:orderId/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByOrderId(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }

    await Order.updateStatus(order.id, 'cancelled', req.body.reason || 'Cancelled by user');
    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const { page, limit, status, search, dateFrom, dateTo } = req.query;
    const result = await Order.getAll({ page, limit, status, search, dateFrom, dateTo });
    res.json({
      success: true,
      data: result.orders,
      pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: Math.ceil(result.total / result.limit) }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:orderId/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByOrderId(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await Order.updateStatus(order.id, status, note);
    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

module.exports = { createOrder, verifyPayment, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus };
