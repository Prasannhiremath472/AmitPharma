import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', sort_order: 0 });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories', { params: { includeInactive: true } });
      setCategories(res.data.data || []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (cat = null) => {
    if (cat) {
      setEditing(cat);
      setForm({ name: cat.name, description: cat.description || '', sort_order: cat.sort_order || 0 });
    } else {
      setEditing(null);
      setForm({ name: '', description: '', sort_order: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, form);
        toast.success('Category updated!');
      } else {
        await api.post('/categories', form);
        toast.success('Category created!');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <>
      <Helmet><title>Categories - Admin | Amit R. Medical</title></Helmet>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-heading">Categories</h1>
            <p className="text-slate-500 text-sm">{categories.length} categories</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <FiPlus /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl overflow-hidden">
                  {cat.image ? <img src={cat.image} alt="" className="w-full h-full object-cover rounded-xl" /> : 'ðŸŠ'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{cat.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.product_count || 0} products</p>
                  {!cat.is_active && <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">Inactive</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(cat)} className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors text-slate-500">
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-slate-500">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'} size="md">
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Category Name *</label>
              <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="input-field" placeholder="e.g., Medicines" required autoFocus />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Category description" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))} className="input-field" min="0" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default AdminCategories;

