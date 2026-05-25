import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiCheck, FiTrash2, FiStar } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/common/Badge';
import api from '../../api/axios';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchReviews = async (approved = filter) => {
    setLoading(true);
    try {
      const params = {};
      if (approved !== '') params.approved = approved;
      const res = await api.get('/reviews', { params });
      setReviews(res.data.data || []);
    } catch { toast.error('Failed to load reviews'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await api.put(`/reviews/${id}/approve`);
      toast.success('Review approved!');
      fetchReviews();
    } catch { toast.error('Failed to approve'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch { toast.error('Failed to delete'); }
  };

  const columns = [
    {
      key: 'product_name', header: 'Product',
      render: v => <span className="text-sm font-medium text-slate-700 line-clamp-1">{v}</span>
    },
    { key: 'user_name', header: 'Customer', render: v => <span className="text-sm text-slate-600">{v}</span> },
    { key: 'rating', header: 'Rating', render: v => (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar key={i} className={`text-xs ${i < v ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
        ))}
        <span className="text-xs text-slate-500 ml-0.5">{v}/5</span>
      </div>
    )},
    { key: 'comment', header: 'Comment', render: v => <span className="text-xs text-slate-500 line-clamp-2 max-w-xs">{v || 'â€'}</span> },
    { key: 'is_approved', header: 'Status', render: v => <Badge variant={v ? 'success' : 'warning'} size="sm">{v ? 'Approved' : 'Pending'}</Badge> },
    { key: 'created_at', header: 'Date', render: v => <span className="text-xs text-slate-400">{formatDate(v)}</span> },
    {
      key: 'id', header: 'Actions',
      render: (id, row) => (
        <div className="flex items-center gap-1.5">
          {!row.is_approved && (
            <button onClick={() => handleApprove(id)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
              <FiCheck className="text-sm" />
            </button>
          )}
          <button onClick={() => handleDelete(id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      )
    },
  ];

  return (
    <>
      <Helmet><title>Reviews - Admin | Amit R. Medical</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 font-heading">Reviews</h1>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white">
            <option value="">All Reviews</option>
            <option value="false">Pending Approval</option>
            <option value="true">Approved</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={reviews}
          loading={loading}
          emptyMessage="No reviews found"
        />
      </div>
    </>
  );
};

export default AdminReviews;

