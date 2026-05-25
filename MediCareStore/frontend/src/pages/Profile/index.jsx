import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiEdit2, FiCamera, FiSave } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../../redux/slices/authSlice';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatPrice, formatDate, getInitials } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'wishlist') {
      api.get('/users/wishlist').then(res => setWishlist(res.data.data || [])).catch(() => {});
    }
  }, [activeTab]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      dispatch(loadUser());
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
  ];

  return (
    <>
      <Helmet>
        <title>My Profile - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-4 border-white/30" />
                ) : (
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
                    <span className="text-3xl font-bold">{getInitials(user?.name)}</span>
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-white text-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <FiCamera className="text-sm" />
                </button>
              </div>
              <div>
                <h1 className="text-xl font-bold">{user?.name}</h1>
                <p className="text-primary-200 text-sm">{user?.email}</p>
                {user?.phone && <p className="text-primary-200 text-sm">{user.phone}</p>}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-100 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="text-base" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-800">Personal Information</h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                        <FiEdit2 /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(false)} className="text-sm text-slate-500 hover:text-slate-700">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold">
                          <FiSave /> {saving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', key: 'name', type: 'text' },
                      { label: 'Phone Number', key: 'phone', type: 'tel' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                        {editing ? (
                          <input
                            type={field.type}
                            value={form[field.key]}
                            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                            className="input-field text-sm"
                          />
                        ) : (
                          <p className="text-slate-800 font-medium text-sm py-2.5">{form[field.key] || 'â€'}</p>
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                      <p className="text-slate-800 font-medium text-sm py-2.5">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Account Type</label>
                      <p className="text-slate-800 font-medium text-sm py-2.5 capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="text-center py-8">
                  <Link to="/orders" className="btn-primary">View All Orders</Link>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <FiHeart className="text-5xl text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400">Your wishlist is empty</p>
                      <Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {wishlist.map(item => (
                        <Link key={item.id} to={`/products/${item.product_id}`} className="bg-slate-50 rounded-xl p-3 hover:bg-primary-50 transition-colors">
                          <div className="aspect-square bg-white rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" /> : <span className="text-4xl">ðŸŠ</span>}
                          </div>
                          <p className="text-xs font-medium text-slate-700 line-clamp-2">{item.name}</p>
                          <p className="text-primary-600 font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <Link to="/checkout" className="btn-primary text-sm">Manage in Checkout</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

