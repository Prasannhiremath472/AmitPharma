import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { DOSAGE_FORMS } from '../../constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    Promise.all([
      api.get(`/products/${id}`),
      api.get('/categories')
    ]).then(([productRes, catRes]) => {
      const p = productRes.data.data;
      setForm({
        name: p.name || '', description: p.description || '',
        short_description: p.short_description || '', price: p.price || '',
        compare_price: p.compare_price || '', cost_price: p.cost_price || '',
        stock: p.stock || '', sku: p.sku || '', brand: p.brand || '',
        category_id: p.category_id || '', dosage_form: p.dosage_form || '',
        strength: p.strength || '', manufacturer: p.manufacturer || '',
        expiry_date: p.expiry_date ? p.expiry_date.split('T')[0] : '',
        storage_instructions: p.storage_instructions || '',
        is_featured: p.is_featured || false,
        is_prescription_required: p.is_prescription_required || false,
        is_active: p.is_active !== undefined ? p.is_active : true,
      });
      setImagePreview(p.images?.[0]?.url || p.primary_image || null);
      setCategories(catRes.data.data || []);
    }).catch(() => toast.error('Failed to load product')).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);
      await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product updated!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner center />;

  return (
    <>
      <Helmet><title>Edit Product - Admin | Amit R. Medical</title></Helmet>
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/products" className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-600"><FiArrowLeft /></Link>
          <h1 className="text-2xl font-bold text-slate-800 font-heading">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <h2 className="font-bold text-slate-800">Basic Information</h2>
                {[
                  { label: 'Name', key: 'name', required: true },
                  { label: 'Short Description', key: 'short_description' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">{f.label} {f.required && <span className="text-red-400">*</span>}</label>
                    <input value={form[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} className="input-field" required={f.required} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Description *</label>
                  <textarea value={form.description || ''} onChange={e => handleChange('description', e.target.value)} rows={4} className="input-field resize-none" required />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-4">Pricing & Stock</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Price (â‚¹)', key: 'price', required: true },
                    { label: 'Compare Price (â‚¹)', key: 'compare_price' },
                    { label: 'Cost Price (â‚¹)', key: 'cost_price' },
                    { label: 'Stock', key: 'stock', required: true },
                    { label: 'SKU', key: 'sku', type: 'text' },
                    { label: 'Brand', key: 'brand', type: 'text' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">{f.label}</label>
                      <input type={f.type || 'number'} value={form[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} className="input-field" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-4">Product Image</h2>
                <label className="block cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  {imagePreview ? (
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-primary-200 hover:opacity-90 transition-opacity">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
                      <FiUpload className="text-3xl text-slate-400" />
                    </div>
                  )}
                </label>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                <h2 className="font-bold text-slate-800">Settings</h2>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Category</label>
                  <select value={form.category_id || ''} onChange={e => handleChange('category_id', e.target.value)} className="input-field">
                    <option value="">Select</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                {[
                  { key: 'is_featured', label: 'Featured Product' },
                  { key: 'is_prescription_required', label: 'Requires Prescription' },
                  { key: 'is_active', label: 'Active / Visible' },
                ].map(cb => (
                  <label key={cb.key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={!!form[cb.key]} onChange={e => handleChange(cb.key, e.target.checked)} className="w-4 h-4 accent-primary-500" />
                    <span className="text-sm font-medium text-slate-700">{cb.label}</span>
                  </label>
                ))}
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full py-3.5 text-base">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminEditProduct;

