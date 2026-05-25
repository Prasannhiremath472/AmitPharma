const express = require('express');
const router = express.Router();
const { getProductReviews, createReview, updateReview, deleteReview, approveReview, getAllReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin
router.get('/', protect, admin, getAllReviews);
router.put('/:id/approve', protect, admin, approveReview);

module.exports = router;
