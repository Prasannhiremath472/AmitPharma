import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilters } from '../../redux/slices/productSlice';
import ProductGrid from '../../components/products/ProductGrid';
import ProductFilter from '../../components/products/ProductFilter';
import { SORT_OPTIONS } from '../../constants';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination, filters } = useSelector(state => state.products);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      featured: searchParams.get('featured') || '',
    };
    dispatch(setFilters(urlFilters));
  }, [searchParams]);

  useEffect(() => {
    const params = { ...filters, page, limit: 12 };
    Object.keys(params).forEach(k => !params[k] && delete params[k]);
    dispatch(fetchProducts(params));
  }, [filters, page]);

  const handleFilter = (newFilters) => {
    setPage(1);
    dispatch(fetchProducts({ ...newFilters, page: 1, limit: 12 }));
  };

  return (
    <>
      <Helmet>
        <title>All Products - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold font-heading">
              {filters.search ? `Results for "${filters.search}"` : filters.category ? `${filters.category} Products` : 'All Products'}
            </h1>
            <p className="text-primary-200 mt-1 text-sm">{pagination.total} products found</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <ProductFilter onFilter={handleFilter} />
              <p className="text-sm text-slate-500">
                Showing {items.length} of {pagination.total} products
              </p>
            </div>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                dispatch(setFilters({ sortBy, sortOrder }));
                setPage(1);
              }}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-primary-400"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <ProductGrid products={items} loading={loading} emptyMessage="No products match your filters. Try adjusting your search." />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                â† Previous
              </button>
              <span className="px-4 py-2 text-sm text-slate-600 font-medium">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Next â†
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;

