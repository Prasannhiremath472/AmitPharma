import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { SkeletonGrid } from '../loaders/SkeletonCard';

const ProductGrid = ({ products, loading, emptyMessage = 'No products found' }) => {
  if (loading) return <SkeletonGrid count={12} />;

  if (!products?.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No Products Found</h3>
        <p className="text-slate-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.05, 0.4) }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
