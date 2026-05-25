import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiPlus, FiMapPin } from 'react-icons/fi';
import { STATES_IN } from '../../constants';
import api from '../../api/axios';

const CheckoutForm = ({ onAddressSelect }) => {
  const { user } = useSelector(state => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    api.get('/users/addresses')
      .then(res => {
        setAddresses(res.data.data || []);
        if (res.data.data?.length > 0) {
          const defaultAddr = res.data.data.find(a => a.is_default) || res.data.data[0];
          setSelectedAddress(defaultAddr);
          onAddressSelect(defaultAddr);
        } else {
          setShowNewForm(true);
        }
      })
      .catch(() => setShowNewForm(true))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    onAddressSelect(address);
    setShowNewForm(false);
  };

  const handleFormChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (showNewForm) onAddressSelect(updated);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/addresses', form);
      const newAddr = { ...form, id: res.data.data.id };
      setAddresses(prev => [...prev, newAddr]);
      setSelectedAddress(newAddr);
      onAddressSelect(newAddr);
      setShowNewForm(false);
    } catch (err) {
      console.error('Failed to save address');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-slate-200 rounded-2xl" />;
  }

  return (
    <div>
      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-3 mb-4">
          {addresses.map(addr => (
            <label
              key={addr.id}
              className={`flex gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedAddress?.id === addr.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 hover:border-primary-200'
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={selectedAddress?.id === addr.id}
                onChange={() => handleSelectAddress(addr)}
                className="mt-1 accent-primary-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800 text-sm">{addr.name}</p>
                  {addr.is_default ? <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">Default</span> : null}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{addr.phone}</p>
                <p className="text-sm text-slate-600 mt-1">
                  {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Add New Address */}
      {!showNewForm ? (
        <button
          onClick={() => { setShowNewForm(true); setSelectedAddress(null); }}
          className="flex items-center gap-2 text-sm text-primary-600 font-medium hover:text-primary-700 border-2 border-dashed border-primary-200 hover:border-primary-400 rounded-xl px-4 py-3 w-full justify-center transition-colors"
        >
          <FiPlus /> Add New Delivery Address
        </button>
      ) : (
        <form onSubmit={handleSaveAddress} className="space-y-3 border-2 border-primary-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiMapPin className="text-primary-500" />
            <h3 className="font-semibold text-slate-700 text-sm">New Delivery Address</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name *</label>
              <input value={form.name} onChange={e => handleFormChange('name', e.target.value)} className="input-field text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Phone *</label>
              <input value={form.phone} onChange={e => handleFormChange('phone', e.target.value)} className="input-field text-sm" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Address Line 1 *</label>
            <input value={form.address_line1} onChange={e => handleFormChange('address_line1', e.target.value)} placeholder="House/Flat No, Building, Street" className="input-field text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Address Line 2</label>
            <input value={form.address_line2} onChange={e => handleFormChange('address_line2', e.target.value)} placeholder="Area, Landmark (optional)" className="input-field text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">City *</label>
              <input value={form.city} onChange={e => handleFormChange('city', e.target.value)} className="input-field text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">State *</label>
              <select value={form.state} onChange={e => handleFormChange('state', e.target.value)} className="input-field text-sm" required>
                <option value="">Select</option>
                {STATES_IN.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Pincode *</label>
              <input value={form.pincode} onChange={e => handleFormChange('pincode', e.target.value)} maxLength={6} className="input-field text-sm" required />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn-primary text-sm px-4 py-2">Save Address</button>
            {addresses.length > 0 && (
              <button type="button" onClick={() => { setShowNewForm(false); setSelectedAddress(addresses[0]); onAddressSelect(addresses[0]); }} className="btn-outline text-sm px-4 py-2">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutForm;
