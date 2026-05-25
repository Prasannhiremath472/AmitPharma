import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { DOSAGE_FORMS } from '../../constants';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', short_description: '', price: '', compare_price: '',
    cost_price: '', stock: '', sku: '', brand: '', category_id: '',
    dosage_form: '', strength: '', manufacturer: '', expiry_date: '',
    storage_instructions: '', is_featured: false, is_prescription_required: false,
  });

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category_id) {
      toast.error('Name, price, and category are required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, required, children }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );

  return (
    <>
      <Helmet><title>Add Product - Admin | Amit R. Medical</title></Helmet>
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/products" className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-600">
            <FiArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 font-heading">Add New Product</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <Field label="Product Name" required>
                    <input value={form.name} onChange={e => handleChange('name', e.target.value)} className="input-field" placeholder="e.g., Paracetamol 500mg Tablets" required />
                  </Field>
                  <Field label="Short Description">
                    <input value={form.short_description} onChange={e => handleChange('short_description', e.target.value)} className="input-field" placeholder="Brief product summary (max 200 chars)" />
                  </Field>
                  <Field label="Full Description" required>
                    <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={5} className="input-field resize-none" placeholder="Detailed product description..." required />
                  </Field>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-4">Pricing & Inventory</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field label="Selling Price (â‚¹)" required>
                    <input type="number" value={form.price} onChange={e => handleChange('price', e.target.value)} className="input-field" placeholder="0.00" step="0.01" min="0" required />
                  </Field>
                  <Field label="MRP / Compare Price (â‚¹)">
                    <input type="number" value={form.compare_price} onChange={e => handleChange('compare_price', e.target.value)} className="input-field" placeholder="0.00" step="0.01" min="0" />
                  </Field>
                  <Field label="Cost Price (â‚¹)">
                    <input type="number" value={form.cost_price} onChange={e => handleChange('cost_price', e.target.value)} className="input-field" placeholder="0.00" step="0.01" min="0" />
                  </Field>
                  <Field label="Stock Quantity" required>
                    <input type="number" value={form.stock} onChange={e => handleChange('stock', e.target.value)} className="input-field" placeholder="0" min="0" required />
                  </Field>
                  <Field label="SKU Code">
                    <input value={form.sku} onChange={e => handleChange('sku', e.target.value)} className="input-field" placeholder="e.g., MED-001" />
                  </Field>
                  <Field label="Brand">
                    <input value={form.brand} onChange={e => handleChange('brand', e.target.value)} className="input-field" placeholder="e.g., Cipla" />
                  </Field>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-4">Medical Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Dosage Form">
                    <select value={form.dosage_form} onChange={e => handleChange('dosage_form', e.target.value)} className="input-field">
                      <option value="">Select form</option>
                      {DOSAGE_FORMS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </Field>
                  <Field label="Strength / Composition">
                    <input value={form.strength} onChange={e => handleChange('strength', e.target.value)} className="input-field" placeholder="e.g., 500mg" />
                  </Field>
                  <Field label="Manufacturer">
                    <input value={form.manufacturer} onChange={e => handleChange('manufacturer', e.target.value)} className="input-field" placeholder="Manufacturer name" />
                  </Field>
                  <Field label="Expiry Date">
                    <input type="date" value={form.expiry_date} onChange={e => handleChange('expiry_date', e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} />
                  </Field>
                  <div className="col-span-2">
                    <Field label="Storage Instructions">
                      <input value={form.storage_instructions} onChange={e => handleChange('storage_instructions', e.target.value)} className="input-field" placeholder="e.g., Store below 25Â°C in a cool dry place" />
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Image Upload */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-4">Product Image</h2>
                <label className="block cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  {imagePreview ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-primary-400 flex flex-col items-center justify-center gap-3 transition-colors bg-slate-50">
                      <FiUpload className="text-3xl text-slate-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600">Click to upload</p>
                        <p className="text-xs text-slate-400">JPG, PNG, WebP up to 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Category & Settings */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-slate-800 mb-4">Category & Settings</h2>
                <div className="space-y-4">
                  <Field label="Category" required>
                    <select value={form.category_id} onChange={e => handleChange('category_id', e.target.value)} className="input-field" required>
                      <option value="">Select category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </Field>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured} onChange={e => handleChange('is_featured', e.target.checked)} className="w-4 h-4 accent-primary-500" />
                    <span className="text-sm font-medium text-slate-700">Featured Product</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.is_prescription_required} onChange={e => handleChange('is_prescription_required', e.target.checked)} className="w-4 h-4 accent-amber-500" />
                    <span className="text-sm font-medium text-slate-700">Requires Prescription (Rx)</span>
                  </label>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full py-3.5 text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : 'Create Product'}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminAddProduct;

