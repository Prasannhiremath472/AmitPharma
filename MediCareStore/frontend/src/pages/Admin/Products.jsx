import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';
import { formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Badge from '../../components/common/Badge';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async (page = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (searchQuery) params.search = searchQuery;
      const res = await api.get('/products', { params });
      setProducts(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts(pagination.page);
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/products/${id}`, { is_active: currentStatus ? 0 : 1 });
      toast.success('Status updated');
      fetchProducts(pagination.page);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const columns = [
    {
      key: 'name', header: 'Product',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
            {row.primary_image ? <img src={row.primary_image} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xl">ðŸŠ</div>}
          </div>
          <div>
            <p className="font-medium text-slate-800 text-sm line-clamp-1">{v}</p>
            <p className="text-xs text-slate-400">{row.brand}</p>
          </div>
        </div>
      )
    },
    { key: 'category_name', header: 'Category', render: v => <span className="text-xs text-slate-500">{v || 'â€'}</span> },
    { key: 'price', header: 'Price', render: v => <span className="font-semibold text-primary-600">{formatPrice(v)}</span> },
    { key: 'stock', header: 'Stock', render: v => <Badge variant={v === 0 ? 'danger' : v < 10 ? 'warning' : 'success'}>{v === 0 ? 'Out of Stock' : v}</Badge> },
    { key: 'is_active', header: 'Status', render: (v, row) => (
      <button onClick={() => handleToggleActive(row.id, v)} className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors ${v ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}>
        {v ? <FiToggleRight /> : <FiToggleLeft />} {v ? 'Active' : 'Inactive'}
      </button>
    )},
    {
      key: 'id', header: 'Actions',
      render: (id, row) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/products/edit/${id}`} className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <FiEdit2 className="text-sm" />
          </Link>
          <button onClick={() => handleDelete(id, row.name)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      )
    },
  ];

  return (
    <>
      <Helmet><title>Products - Admin | Amit R. Medical</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-heading">Products</h1>
            <p className="text-slate-500 text-sm">{pagination.total} total products</p>
          </div>
          <Link to="/admin/products/add" className="btn-primary flex items-center gap-2">
            <FiPlus /> Add Product
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          pagination={pagination}
          onPageChange={(p) => fetchProducts(p)}
          searchable
          onSearch={(q) => { setSearch(q); fetchProducts(1, q); }}
          emptyMessage="No products found"
        />
      </div>
    </>
  );
};

export default AdminProducts;

