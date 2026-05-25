import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiShoppingBag, FiArrowRight, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import CartItem from './CartItem';
import { formatPrice } from '../../utils/helpers';
import { useSelector } from 'react-redux';

const CartSidebar = () => {
  const { items, totals, isOpen, closeCartSidebar, clearAllCart } = useCart();
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCartSidebar();
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={closeCartSidebar}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="text-primary-600 text-xl" />
                <h2 className="text-lg font-bold text-slate-800">Shopping Cart</h2>
                {items.length > 0 && (
                  <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearAllCart}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    title="Clear Cart"
                  >
                    <FiTrash2 />
                  </button>
                )}
                <button
                  onClick={closeCartSidebar}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingBag className="text-3xl text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-700 mb-2">Your cart is empty</h3>
                  <p className="text-slate-400 text-sm mb-6">Add items to start shopping</p>
                  <Link
                    to="/products"
                    onClick={closeCartSidebar}
                    className="btn-primary text-sm px-6 py-2.5"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <CartItem key={item.product_id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-slate-100 px-5 py-4 space-y-3">
                {/* Free delivery indicator */}
                {totals.subtotal < 499 && (
                  <div className="bg-primary-50 rounded-xl p-3">
                    <p className="text-xs text-primary-700 font-medium text-center">
                      Add {formatPrice(499 - totals.subtotal)} more for FREE delivery! =š
                    </p>
                    <div className="mt-2 h-1.5 bg-primary-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${Math.min((totals.subtotal / 499) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
                  </div>
                  {totals.savings > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Savings</span>
                      <span className="font-semibold">-{formatPrice(totals.savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery</span>
                    <span className={`font-semibold ${totals.shipping === 0 ? 'text-emerald-600' : ''}`}>
                      {totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-slate-800 border-t border-slate-100 pt-2">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(totals.total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <FiArrowRight />
                </button>

                <Link
                  to="/cart"
                  onClick={closeCartSidebar}
                  className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
