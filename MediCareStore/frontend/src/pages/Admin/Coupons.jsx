import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import api from '../../api/axios';
import { formatPrice, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '',
    max_discount_amount: '', max_uses: '', max_uses_per_user: '', expires_at: '', is_active: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data.data || []);
    } catch { toast.error('Failed to load coupons'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditing(coupon);
      setForm({ ...coupon, expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '' });
    } else {
      setEditing(null);
      setForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_amount: '', max_discount_amount: '', max_uses: '', max_uses_per_user: '', expires_at: '', is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach(k => payload[k] === '' && (payload[k] = null));
      if (editing) {
        await api.put(`/coupons/${editing.id}`, payload);
        toast.success('Coupon updated!');
      } else {
        await api.post('/coupons', payload);
        toast.success('Coupon created!');
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { key: 'code', header: 'Code', render: v => <span className="font-mono font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg text-sm">{v}</span> },
    { key: 'discount_type', header: 'Type', render: (v, row) => (
      <span className="text-sm text-slate-700">
        {row.discount_type === 'percentage' ? `${row.discount_value}%` : formatPrice(row.discount_value)} OFF
      </span>
    )},
    { key: 'min_order_amount', header: 'Min Order', render: v => v ? formatPrice(v) : 'â€' },
    { key: 'used_count', header: 'Used', render: (v, row) => `${v}${row.max_uses ? `/${row.max_uses}` : ''}` },
    { key: 'expires_at', header: 'Expires', render: v => v ? formatDate(v) : 'Never' },
    { key: 'is_active', header: 'Status', render: v => <Badge variant={v ? 'success' : 'default'} size="sm">{v ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'id', header: 'Actions',
      render: (id, row) => (
        <div className="flex gap-1">
          <button onClick={() => openModal(row)} className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><FiEdit2 className="text-sm" /></button>
          <button onClick={() => handleDelete(id, row.code)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 className="text-sm" /></button>
        </div>
      )
    },
  ];

  return (
    <>
      <Helmet><title>Coupons - Admin | Amit R. Medical</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 font-heading">Coupons</h1>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <FiPlus /> Add Coupon
          </button>
        </div>

        <DataTable columns={columns} data={coupons} loading={loading} emptyMessage="No coupons created" />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Coupon' : 'Create Coupon'} size="md">
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Coupon Code *</label>
                <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} className="input-field font-mono uppercase" placeholder="e.g., SAVE20" required disabled={!!editing} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Discount Type *</label>
                <select value={form.discount_type} onChange={e => setForm(p => ({ ...p, discount_type: e.target.value }))} className="input-field">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (â‚¹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Discount Value *</label>
                <input type="number" value={form.discount_value} onChange={e => setForm(p => ({ ...p, discount_value: e.target.value }))} className="input-field" placeholder={form.discount_type === 'percentage' ? '20' : '100'} required min="0.01" step="0.01" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Min Order Amount (â‚¹)</label>
                <input type="number" value={form.min_order_amount} onChange={e => setForm(p => ({ ...p, min_order_amount: e.target.value }))} className="input-field" placeholder="0" min="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Max Discount (â‚¹)</label>
                <input type="number" value={form.max_discount_amount} onChange={e => setForm(p => ({ ...p, max_discount_amount: e.target.value }))} className="input-field" placeholder="Optional" min="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Max Total Uses</label>
                <input type="number" value={form.max_uses} onChange={e => setForm(p => ({ ...p, max_uses: e.target.value }))} className="input-field" placeholder="Unlimited" min="1" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Max Per User</label>
                <input type="number" value={form.max_uses_per_user} onChange={e => setForm(p => ({ ...p, max_uses_per_user: e.target.value }))} className="input-field" placeholder="Unlimited" min="1" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Expiry Date</label>
                <input type="date" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))} className="input-field" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-primary-500" />
                  <span className="text-sm font-medium text-slate-700">Active (usable by customers)</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default AdminCoupons;

