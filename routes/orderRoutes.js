const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.use(protect);

router.post('/', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/my-orders', getMyOrders);
router.get('/:orderId', getOrder);
router.put('/:orderId/cancel', cancelOrder);

// Admin routes
router.get('/', admin, getAllOrders);
router.put('/:orderId/status', admin, updateOrderStatus);

module.exports = router;
