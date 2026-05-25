import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { setFilters, clearFilters } from '../../redux/slices/productSlice';
import { SORT_OPTIONS } from '../../constants';
import api from '../../api/axios';

const ProductFilter = ({ onFilter }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.products);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    if (onFilter) onFilter(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = { search: '', category: '', minPrice: '', maxPrice: '', sortBy: 'created_at', sortOrder: 'DESC', inStock: '' };
    setLocalFilters(cleared);
    dispatch(clearFilters());
    if (onFilter) onFilter(cleared);
  };

  const activeFilterCount = [
    localFilters.category,
    localFilters.minPrice,
    localFilters.maxPrice,
    localFilters.inStock,
  ].filter(Boolean).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
          activeFilterCount > 0
            ? 'border-primary-500 text-primary-700 bg-primary-50'
            : 'border-slate-200 text-slate-600 hover:border-primary-300 bg-white'
        }`}
      >
        <FiFilter />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {activeFilterCount}
          </span>
        )}
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute left-0 top-full mt-2 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 min-w-[280px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Filter Products</h3>
                <button onClick={handleClear} className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                  <FiX /> Clear All
                </button>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full input-field text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Price Range (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    className="input-field text-sm flex-1"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    className="input-field text-sm flex-1"
                    min="0"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Sort By</label>
                <select
                  value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleChange('sortBy', sortBy);
                    handleChange('sortOrder', sortOrder);
                  }}
                  className="w-full input-field text-sm"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* In Stock */}
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={localFilters.inStock === 'true'}
                  onChange={(e) => handleChange('inStock', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 text-primary-500 rounded accent-primary-500"
                />
                <span className="text-sm font-medium text-slate-700">In Stock Only</span>
              </label>

              <button
                onClick={applyFilters}
                className="w-full btn-primary py-2.5"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilter;
