import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchFeaturedProducts } from '../../redux/slices/productSlice';
import ProductCard from '../products/ProductCard';
import { SkeletonGrid } from '../loaders/SkeletonCard';

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { featured, featuredLoading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-heading">Featured Products</h2>
            <p className="text-slate-500 mt-1">Handpicked products for you</p>
          </div>
          <Link to="/products?featured=true" className="text-primary-600 font-semibold text-sm hover:text-primary-700">
            View All →
          </Link>
        </div>

        {featuredLoading ? (
          <SkeletonGrid count={8} />
        ) : featured.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No featured products available</p>
            <Link to="/products" className="text-primary-600 font-medium mt-2 inline-block">Browse all products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
