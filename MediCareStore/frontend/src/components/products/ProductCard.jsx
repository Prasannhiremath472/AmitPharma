import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { formatPrice, getDiscountPercent } from '../../utils/helpers';
import useCart from '../../hooks/useCart';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { addToCart, loading: cartLoading } = useCart();

  const discount = getDiscountPercent(product.compare_price, product.price);
  const image = product.primary_image || product.images?.[0]?.url;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    await addToCart(product.id);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    setWishlistLoading(true);
    try {
      await api.post('/users/wishlist', { product_id: product.id });
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-hover hover:border-primary-100 transition-all duration-300"
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square bg-slate-50 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
              <span className="text-6xl">=�</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
            {product.is_prescription_required && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Rx Required
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center text-sm transition-colors ${
                isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-slate-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <FiHeart className={isWishlisted ? 'fill-white' : ''} />
            </motion.button>
          </div>

          {/* Quick view overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <div className="flex items-center justify-center gap-1 bg-black/70 backdrop-blur-sm text-white text-xs py-2">
              <FiEye /> Quick View
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          {product.category_name && (
            <p className="text-[10px] text-primary-600 font-semibold uppercase tracking-wider mb-1">{product.category_name}</p>
          )}
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-1.5 group-hover:text-primary-700 transition-colors">
            {product.name}
          </h3>

          {product.brand && (
            <p className="text-xs text-slate-400 mb-2">{product.brand}</p>
          )}

          {/* Rating */}
          {parseFloat(product.avg_rating) > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-0.5">
                <FiStar className="text-yellow-400 fill-yellow-400 text-xs" />
                <span className="text-xs font-semibold text-slate-700">{parseFloat(product.avg_rating).toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-slate-400">({product.review_count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-bold text-primary-600">{formatPrice(product.price)}</span>
            {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
              <span className="text-xs text-slate-400 line-through">{formatPrice(product.compare_price)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-3 pb-3 md:px-4 md:pb-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          disabled={isOutOfStock || cartLoading}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-primary-50 hover:bg-primary-500 text-primary-700 hover:text-white border border-primary-200 hover:border-primary-500'
          }`}
        >
          <FiShoppingCart className="text-base" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
