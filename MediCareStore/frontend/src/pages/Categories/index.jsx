import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { PRODUCT_CATEGORIES } from '../../constants';

// Fallback emoji per index when a category has no icon
const FALLBACK_EMOJIS = ['💊', '🌿', '🧴', '👶', '🌱', '🩺', '😷', '💪', '🍃', '🧬', '❤️', '🦷'];

const GRADIENT_COLORS = [
  'from-sky-400 to-sky-600',
  'from-emerald-400 to-emerald-600',
  'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600',
  'from-green-400 to-green-600',
  'from-purple-400 to-purple-600',
  'from-red-400 to-red-600',
  'from-yellow-400 to-amber-500',
  'from-teal-400 to-teal-600',
  'from-indigo-400 to-indigo-600',
  'from-rose-400 to-rose-600',
  'from-cyan-400 to-cyan-600',
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data.data.length > 0 ? res.data.data : PRODUCT_CATEGORIES))
      .catch(() => setCategories(PRODUCT_CATEGORIES))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Categories - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold font-heading">Product Categories</h1>
            <p className="text-primary-200 mt-2">Find exactly what you&apos;re looking for</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-2xl mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-2/3 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id || cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Link to={`/products?category=${cat.slug}`} className="block group">
                    <div
                      className={`bg-gradient-to-br ${GRADIENT_COLORS[index % GRADIENT_COLORS.length]} rounded-2xl aspect-square flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-all duration-200`}
                    >
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-2/3 h-2/3 object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-5xl select-none">
                          {cat.icon || FALLBACK_EMOJIS[index % FALLBACK_EMOJIS.length]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-primary-600 text-center transition-colors leading-tight">
                      {cat.name}
                    </p>
                    {cat.product_count !== undefined && (
                      <p className="text-xs text-slate-400 text-center mt-0.5">
                        {cat.product_count} products
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
