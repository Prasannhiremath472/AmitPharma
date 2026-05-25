const express = require('express');
const router = express.Router();
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { uploadToMemory } = require('../middleware/uploadMiddleware');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', protect, admin, uploadToMemory, createCategory);
router.put('/:id', protect, admin, uploadToMemory, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
