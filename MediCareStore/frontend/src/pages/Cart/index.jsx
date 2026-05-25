import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiArrowRight, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import useCart from '../../hooks/useCart';
import CartItem from '../../components/cart/CartItem';
import { formatPrice } from '../../utils/helpers';

const CartPage = () => {
  const { items, totals, itemCount, clearAllCart } = useCart();
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800 font-heading">Shopping Cart {itemCount > 0 && `(${itemCount})`}</h1>
            <Link to="/products" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
              <FiArrowLeft /> Continue Shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="text-4xl text-primary-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-700 mb-3">Your cart is empty</h2>
              <p className="text-slate-400 mb-6">Add medicines and health products to start shopping</p>
              <Link to="/products" className="btn-primary px-8 py-3">Shop Now</Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-700">{items.length} Item{items.length !== 1 ? 's' : ''}</h2>
                    <button
                      onClick={clearAllCart}
                      className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      <FiTrash2 /> Clear All
                    </button>
                  </div>
                  <AnimatePresence>
                    {items.map(item => (
                      <CartItem key={item.product_id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-20">
                  <h2 className="font-bold text-slate-800 mb-4">Order Summary</h2>

                  {/* Free delivery bar */}
                  {totals.subtotal < 499 && (
                    <div className="bg-blue-50 rounded-xl p-3 mb-4">
                      <p className="text-xs text-blue-700 font-medium mb-2">
                        ðŸšš Add {formatPrice(499 - totals.subtotal)} more for FREE delivery!
                      </p>
                      <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(totals.subtotal / 499) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
                    </div>
                    {totals.savings > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>You Save</span>
                        <span className="font-semibold">-{formatPrice(totals.savings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Charges</span>
                      <span className={`font-semibold ${totals.shipping === 0 ? 'text-emerald-600' : ''}`}>
                        {totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
                      </span>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base text-slate-800">
                      <span>Total Amount</span>
                      <span className="text-primary-600 text-lg">{formatPrice(totals.total)}</span>
                    </div>
                  </div>

                  {totals.savings > 0 && (
                    <div className="bg-green-50 rounded-xl p-3 mb-4 text-center">
                      <p className="text-green-700 text-sm font-semibold">ðŸŽ‰ You're saving {formatPrice(totals.savings)} on this order!</p>
                    </div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCheckout}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base"
                  >
                    Proceed to Checkout
                    <FiArrowRight />
                  </motion.button>

                  <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
                    <span>ðŸ Secure Checkout</span>
                    <span>â€¢</span>
                    <span>âœ… 100% Genuine</span>
                    <span>â€¢</span>
                    <span>ðŸšš Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;

