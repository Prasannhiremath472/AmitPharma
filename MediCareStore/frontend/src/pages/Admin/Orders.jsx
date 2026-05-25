import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiEye, FiChevronDown } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import api from '../../api/axios';
import { formatPrice, formatDate, getOrderStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async (page = 1, status = statusFilter) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (status) params.status = status;
      const res = await api.get('/orders', { params });
      setOrders(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    setUpdatingStatus(true);
    try {
      await api.put(`/orders/${selectedOrder.order_id}/status`, { status: newStatus, note: statusNote });
      toast.success('Order status updated');
      setSelectedOrder(null);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const columns = [
    { key: 'order_id', header: 'Order ID', render: v => <span className="font-mono text-xs text-primary-600 font-semibold">{v}</span> },
    { key: 'customer_name', header: 'Customer', render: (v, row) => (
      <div>
        <p className="text-sm font-medium text-slate-700">{v}</p>
        <p className="text-xs text-slate-400">{row.customer_email}</p>
      </div>
    )},
    { key: 'item_count', header: 'Items', render: v => <span className="text-sm">{v} item{v !== 1 ? 's' : ''}</span> },
    { key: 'final_amount', header: 'Amount', render: v => <span className="font-bold text-slate-800">{formatPrice(v)}</span> },
    { key: 'payment_method', header: 'Payment', render: v => <span className="text-xs text-slate-500 capitalize">{v}</span> },
    { key: 'status', header: 'Status', render: v => <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(v)}`}>{v}</span> },
    { key: 'created_at', header: 'Date', render: v => <span className="text-xs text-slate-500">{formatDate(v)}</span> },
    {
      key: 'id', header: 'Actions',
      render: (id, row) => (
        <button
          onClick={() => { setSelectedOrder(row); setNewStatus(row.status); setStatusNote(''); }}
          className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <FiEye className="text-sm" />
        </button>
      )
    },
  ];

  return (
    <>
      <Helmet><title>Orders - Admin | Amit R. Medical</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-heading">Orders</h1>
            <p className="text-slate-500 text-sm">{pagination.total} total orders</p>
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); }}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none"
          >
            <option value="">All Status</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          pagination={pagination}
          onPageChange={p => fetchOrders(p)}
          searchable
          onSearch={(q) => fetchOrders(1)}
          emptyMessage="No orders found"
        />

        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder?.order_id}`} size="md">
          {selectedOrder && (
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-slate-400 text-xs">Customer</p><p className="font-semibold text-slate-800">{selectedOrder.customer_name}</p></div>
                <div><p className="text-slate-400 text-xs">Amount</p><p className="font-bold text-primary-600 text-base">{formatPrice(selectedOrder.final_amount)}</p></div>
                <div><p className="text-slate-400 text-xs">Payment</p><p className="font-medium capitalize">{selectedOrder.payment_method}</p></div>
                <div><p className="text-slate-400 text-xs">Items</p><p className="font-medium">{selectedOrder.item_count} items</p></div>
                <div className="col-span-2"><p className="text-slate-400 text-xs">Current Status</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Update Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field text-sm">
                  {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Status Note (optional)</label>
                <input value={statusNote} onChange={e => setStatusNote(e.target.value)} className="input-field text-sm" placeholder="e.g., Shipped via Blue Dart, Tracking: BD123456" />
              </div>

              <div className="flex gap-3">
                <button onClick={handleUpdateStatus} disabled={updatingStatus || newStatus === selectedOrder.status} className="btn-primary flex-1 py-2.5">
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
                <button onClick={() => setSelectedOrder(null)} className="btn-outline flex-1 py-2.5">Cancel</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default AdminOrders;

