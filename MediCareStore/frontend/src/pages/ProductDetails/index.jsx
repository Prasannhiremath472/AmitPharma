import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiShare2, FiStar, FiTruck, FiShield, FiRotateCcw, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../redux/slices/productSlice';
import ProductReviews from '../../components/products/ProductReviews';
import ProductCard from '../../components/products/ProductCard';
import { formatPrice, getDiscountPercent } from '../../utils/helpers';
import useCart from '../../hooks/useCart';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: product, currentLoading: loading } = useSelector(state => state.products);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    dispatch(fetchProduct(id));
    setQuantity(1);
    setSelectedImage(0);
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">ðŸ˜"</div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Product Not Found</h2>
        <Link to="/products" className="btn-primary mt-4">Browse Products</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : (product.primary_image ? [{ url: product.primary_image }] : []);
  const discount = getDiscountPercent(product.compare_price, product.price);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => addToCart(product.id, quantity);

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Product Details' },
    { id: 'reviews', label: `Reviews (${product.review_count || 0})` },
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} - Amit R. Medical</title>
        <meta name="description" content={product.short_description || product.description?.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <FiChevronRight className="text-xs" />
            <Link to="/products" className="hover:text-primary-600">Products</Link>
            <FiChevronRight className="text-xs" />
            {product.category_name && (
              <>
                <Link to={`/products?category=${product.category_slug}`} className="hover:text-primary-600">{product.category_name}</Link>
                <FiChevronRight className="text-xs" />
              </>
            )}
            <span className="text-slate-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* Main Product Area */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Images */}
            <div>
              <motion.div className="bg-white rounded-2xl overflow-hidden border border-slate-100 mb-3">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]?.url}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                    <span className="text-8xl">ðŸŠ</span>
                  </div>
                )}
              </motion.div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-primary-500' : 'border-slate-200 hover:border-primary-300'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {product.brand && (
                <p className="text-primary-600 font-semibold text-sm mb-2">{product.brand}</p>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 font-heading mb-3">{product.name}</h1>

              {/* Rating */}
              {parseFloat(product.avg_rating) > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className={`text-sm ${i < Math.round(product.avg_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">{parseFloat(product.avg_rating).toFixed(1)}</span>
                  <span className="text-slate-400 text-sm">({product.review_count} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                {product.compare_price && parseFloat(product.compare_price) > parseFloat(product.price) && (
                  <>
                    <span className="text-lg text-slate-400 line-through">{formatPrice(product.compare_price)}</span>
                    <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">{discount}% OFF</span>
                  </>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.is_prescription_required && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                    ðŸ‹ Prescription Required
                  </span>
                )}
                {product.dosage_form && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">{product.dosage_form}</span>
                )}
                {product.strength && (
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">{product.strength}</span>
                )}
              </div>

              {/* Short description */}
              {product.short_description && (
                <p className="text-slate-600 text-sm leading-relaxed mb-4 border-l-4 border-primary-300 pl-4 bg-primary-50 py-2 rounded-r-xl">
                  {product.short_description}
                </p>
              )}

              {/* Stock */}
              <div className="mb-4">
                {isOutOfStock ? (
                  <span className="text-red-500 font-semibold text-sm">âŒ Out of Stock</span>
                ) : product.stock < 10 ? (
                  <span className="text-amber-600 font-semibold text-sm">âš ï¸ Only {product.stock} left in stock!</span>
                ) : (
                  <span className="text-emerald-600 font-semibold text-sm">âœ… In Stock ({product.stock} available)</span>
                )}
              </div>

              {/* Quantity + Actions */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <FiMinus />
                    </button>
                    <span className="px-4 py-2.5 font-bold text-slate-800 min-w-[50px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </motion.button>
                <button className="p-3 border-2 border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-500 transition-all">
                  <FiHeart />
                </button>
                <button className="p-3 border-2 border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-all">
                  <FiShare2 />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { icon: FiTruck, text: 'Free Delivery', sub: 'Above â‚¹499' },
                  { icon: FiShield, text: '100% Genuine', sub: 'Certified Products' },
                  { icon: FiRotateCcw, text: 'Easy Returns', sub: '7 Days Policy' },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-xl">
                    <Icon className="text-primary-500 text-xl mb-1" />
                    <span className="text-xs font-semibold text-slate-700">{text}</span>
                    <span className="text-[10px] text-slate-400">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-slate-100 mb-8">
            <div className="flex border-b border-slate-100 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose prose-slate max-w-none text-sm leading-relaxed">
                  <p>{product.description || 'No description available.'}</p>
                </div>
              )}
              {activeTab === 'details' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Brand', value: product.brand },
                    { label: 'Manufacturer', value: product.manufacturer },
                    { label: 'Dosage Form', value: product.dosage_form },
                    { label: 'Strength', value: product.strength },
                    { label: 'Expiry Date', value: product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : null },
                    { label: 'Storage', value: product.storage_instructions },
                    { label: 'Category', value: product.category_name },
                    { label: 'SKU', value: product.sku },
                  ].filter(item => item.value).map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase w-28 flex-shrink-0 pt-0.5">{item.label}</span>
                      <span className="text-sm text-slate-700 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'reviews' && <ProductReviews productId={product.id} />}
            </div>
          </div>

          {/* Related Products */}
          {product.related?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 font-heading mb-4">Related Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.related.map(related => (
                  <ProductCard key={related.id} product={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;

