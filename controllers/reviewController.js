const Review = require('../models/Review');

const getProductReviews = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await Review.getProductReviews(req.params.productId, { page, limit });
    res.json({ success: true, data: result.reviews, stats: result.stats, pagination: { page: result.page, limit: result.limit, total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

const createReview = async (req, res) => {
  try {
    const { product_id, rating, title, comment } = req.body;

    const hasReviewed = await Review.userHasReviewed(product_id, req.user.id);
    if (hasReviewed) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this product' });
    }

    const id = await Review.create({ product_id, user_id: req.user.id, rating, title, comment });
    const review = await Review.findById(id);
    res.status(201).json({ success: true, message: 'Review submitted for approval', data: review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, message: 'Failed to create review' });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await Review.update(req.params.id, req.body);
    const updated = await Review.findById(req.params.id);
    res.json({ success: true, message: 'Review updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await Review.delete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};

const approveReview = async (req, res) => {
  try {
    await Review.approve(req.params.id);
    res.json({ success: true, message: 'Review approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve review' });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const { page, limit, approved } = req.query;
    const result = await Review.getAll({ page, limit, approved });
    res.json({ success: true, data: result.reviews, pagination: { total: result.total } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

module.exports = { getProductReviews, createReview, updateReview, deleteReview, approveReview, getAllReviews };
