import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { FiMapPin } from 'react-icons/fi';
import api from '../../api/axios';
import useCart from '../../hooks/useCart';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import PaymentOptions from '../../components/checkout/PaymentOptions';
import { formatPrice } from '../../utils/helpers';
import { fetchCart } from '../../redux/slices/cartSlice';
import { openLocator } from '../../redux/slices/storeSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totals } = useCart();
  const { user } = useSelector(state => state.auth);
  const { selectedStore } = useSelector(state => state.store);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const finalTotal = totals.total - (couponData?.discount || 0);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, orderAmount: totals.subtotal });
      setCouponData(res.data.data);
      toast.success(`Coupon applied! You save ${formatPrice(res.data.data.discount)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setCouponData(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const loadRazorpay = () => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderPayload = {
        shipping_address: selectedAddress,
        payment_method: paymentMethod,
        coupon_code: couponData ? couponCode : undefined,
        store_id: selectedStore?.id || null,
        store_name: selectedStore?.name || null,
      };

      const res = await api.post('/orders', orderPayload);
      const orderData = res.data.data;

      if (paymentMethod === 'razorpay') {
        const loaded = await loadRazorpay();
        if (!loaded) {
          toast.error('Payment gateway failed to load. Please try COD.');
          setPlacingOrder(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.keyId,
          amount: orderData.amount * 100,
          currency: 'INR',
          name: 'Amit R. Medical',
          description: `Order ${orderData.orderId}`,
          order_id: orderData.razorpayOrderId,
          prefill: { name: user?.name, email: user?.email, contact: user?.phone },
          theme: { color: '#84cc16' },
          handler: async (response) => {
            try {
              await api.post('/orders/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              });
              dispatch(fetchCart());
              toast.success('Payment successful! Order confirmed.');
              navigate(`/orders/${orderData.orderId}`);
            } catch {
              toast.error('Payment verification failed. Contact support.');
            }
          },
          modal: { ondismiss: () => setPlacingOrder(false) }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        dispatch(fetchCart());
        toast.success('Order placed successfully!');
        navigate(`/orders/${orderData.orderId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-800 font-heading mb-6">Checkout</h1>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Store + Address + Payment */}
            <div className="lg:col-span-3 space-y-5">

              {/* Fulfilling Store */}
              <div className={`rounded-2xl border p-5 ${selectedStore ? 'bg-primary-50 border-primary-200' : 'bg-amber-50 border-amber-200'}`}>
                <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Fulfilling Store
                </h2>
                {selectedStore ? (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <FiMapPin className="text-primary-500 text-xl flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{selectedStore.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{selectedStore.address}, {selectedStore.city}  {selectedStore.pincode}</p>
                        <p className="text-xs text-gray-400 mt-0.5">=� {selectedStore.phone}</p>
                        <p className="text-xs text-gray-400 mt-0.5">🕐 {selectedStore.hours}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch(openLocator())}
                      className="flex-shrink-0 text-xs font-semibold text-primary-600 hover:underline whitespace-nowrap"
                    >
                      Change Store
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-amber-700">
                      <FiMapPin className="text-lg flex-shrink-0" />
                      <p className="text-sm font-medium">No store selected. Your order may be fulfilled from the nearest available store.</p>
                    </div>
                    <button
                      onClick={() => dispatch(openLocator())}
                      className="flex-shrink-0 text-xs font-semibold bg-primary-500 text-white px-3 py-1.5 rounded-xl hover:bg-primary-600 transition-colors whitespace-nowrap"
                    >
                      Select Store
                    </button>
                  </div>
                )}
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Delivery Address
                </h2>
                <CheckoutForm onAddressSelect={setSelectedAddress} />
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Payment Method
                </h2>
                <PaymentOptions selected={paymentMethod} onSelect={setPaymentMethod} />
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-20">
                <h2 className="font-bold text-slate-800 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.product_id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">ðŸŠ</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-slate-800 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponData(null); }}
                      placeholder="Enter coupon code"
                      className="input-field text-sm flex-1"
                      disabled={!!couponData}
                    />
                    {couponData ? (
                      <button onClick={() => { setCouponData(null); setCouponCode(''); }} className="px-3 py-2 text-red-500 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-50">Remove</button>
                    ) : (
                      <button onClick={handleValidateCoupon} disabled={validatingCoupon} className="px-3 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors disabled:opacity-60">
                        {validatingCoupon ? '...' : 'Apply'}
                      </button>
                    )}
                  </div>
                  {couponData && (
                    <p className="text-xs text-emerald-600 font-medium mt-1.5">âœ… Saved {formatPrice(couponData.discount)}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 text-sm border-t border-slate-100 pt-4 mb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(totals.subtotal)}</span>
                  </div>
                  {couponData && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Coupon Discount</span>
                      <span className="font-semibold">-{formatPrice(couponData.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery</span>
                    <span className={`font-semibold ${totals.shipping === 0 ? 'text-emerald-600' : ''}`}>
                      {totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-2.5 flex justify-between font-bold text-base">
                    <span>Total Payable</span>
                    <span className="text-primary-600 text-lg">{formatPrice(Math.max(0, finalTotal))}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="btn-primary w-full py-3.5 text-base"
                >
                  {placingOrder ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : `Place Order - ${formatPrice(Math.max(0, finalTotal))}`}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;

