import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 py-4 border-b border-slate-100 last:border-0"
    >
      {/* Image */}
      <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
        <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">=Š</div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.product_id}`}>
          <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-primary-600 transition-colors">
            {item.name}
          </h4>
        </Link>
        <p className="text-primary-600 font-bold text-sm mt-0.5">{formatPrice(item.price)}</p>
        {item.stock < item.quantity && (
          <p className="text-red-500 text-xs mt-0.5">Only {item.stock} left in stock</p>
        )}

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <FiMinus className="text-xs" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiPlus className="text-xs" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
            <button
              onClick={() => removeItem(item.product_id)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
