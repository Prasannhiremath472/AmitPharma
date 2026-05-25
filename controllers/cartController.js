const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    const items = await Cart.getByUserId(req.user.id);
    const totals = Cart.calculateTotals(items);
    res.json({ success: true, data: { items, totals, itemCount: items.length } });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(product_id);
    if (!product || !product.is_active) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items available in stock` });
    }

    await Cart.addItem(req.user.id, product_id, parseInt(quantity));
    const items = await Cart.getByUserId(req.user.id);
    const totals = Cart.calculateTotals(items);

    res.json({ success: true, message: 'Added to cart', data: { items, totals, itemCount: items.length } });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to add to cart' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items available` });
    }

    await Cart.updateQuantity(req.user.id, productId, parseInt(quantity));
    const items = await Cart.getByUserId(req.user.id);
    const totals = Cart.calculateTotals(items);

    res.json({ success: true, message: 'Cart updated', data: { items, totals, itemCount: items.length } });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await Cart.removeItem(req.user.id, req.params.productId);
    const items = await Cart.getByUserId(req.user.id);
    const totals = Cart.calculateTotals(items);

    res.json({ success: true, message: 'Item removed from cart', data: { items, totals, itemCount: items.length } });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove from cart' });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.clear(req.user.id);
    res.json({ success: true, message: 'Cart cleared', data: { items: [], totals: { subtotal: 0, total: 0, shipping: 0 }, itemCount: 0 } });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};

const getCartCount = async (req, res) => {
  try {
    const count = await Cart.getCount(req.user.id);
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get cart count' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartCount };
