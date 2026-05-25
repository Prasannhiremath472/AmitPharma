const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAddresses, addAddress, deleteAddress, getWishlist, toggleWishlist } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadToMemory } = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', uploadToMemory, updateProfile);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);
router.get('/wishlist', getWishlist);
router.post('/wishlist', toggleWishlist);

module.exports = router;
