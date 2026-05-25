const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getFeaturedProducts, createProduct, updateProduct, deleteProduct, uploadProductImage, deleteProductImage } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { uploadToMemory, uploadMultipleToMemory } = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, admin, uploadToMemory, createProduct);
router.put('/:id', protect, admin, uploadToMemory, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/images', protect, admin, uploadToMemory, uploadProductImage);
router.delete('/:id/images/:imageId', protect, admin, deleteProductImage);

module.exports = router;
