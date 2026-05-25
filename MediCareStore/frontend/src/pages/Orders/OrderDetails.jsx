import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import { fetchOrder, cancelOrder } from '../../redux/slices/orderSlice';
import { formatPrice, formatDate, formatDateTime, getOrderStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { current: order, loading } = useSelector(state => state.orders);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchOrder(orderId));
  }, [orderId]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    const result = await dispatch(cancelOrder({ orderId, reason: 'Cancelled by customer' }));
    if (cancelOrder.fulfilled.match(result)) {
      toast.success('Order cancelled successfully');
    } else {
      toast.error(result.payload || 'Failed to cancel order');
    }
    setCancelling(false);
  };

  if (loading) return <LoadingSpinner center />;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FiPackage className="text-6xl text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Order Not Found</h2>
        <Link to="/orders" className="btn-primary mt-4">Back to Orders</Link>
      </div>
    );
  }

  const shippingAddr = typeof order.shipping_address === 'string'
    ? JSON.parse(order.shipping_address)
    : order.shipping_address;

  return (
    <>
      <Helmet>
        <title>Order {order.order_id} - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/orders" className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-600">
              <FiArrowLeft />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800 font-heading">{order.order_id}</h1>
              <p className="text-sm text-slate-400">Placed on {formatDateTime(order.created_at)}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${getOrderStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              {['pending', 'confirmed'].includes(order.status) && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="text-sm text-red-500 hover:text-red-600 font-medium border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Order Items */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h2 className="font-bold text-slate-800 mb-4">Order Items ({order.items?.length})</h2>
                <div className="space-y-4">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                        {item.product_image ? (
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : <div className="w-full h-full flex items-center justify-center text-2xl">ðŸŠ</div>}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{item.product_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity} Ã {formatPrice(item.price)}</p>
                      </div>
                      <p className="font-bold text-slate-800 text-sm">{formatPrice(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History */}
              {order.statusHistory?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h2 className="font-bold text-slate-800 mb-4">Order Tracking</h2>
                  <div className="space-y-3">
                    {order.statusHistory.map((hist, i) => (
                      <div key={hist.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${i === 0 ? 'bg-primary-500' : 'bg-slate-300'}`} />
                          {i < order.statusHistory.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-semibold text-slate-700 capitalize">{hist.status}</p>
                          {hist.note && <p className="text-xs text-slate-500">{hist.note}</p>}
                          <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(hist.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary & Address */}
            <div className="space-y-4">
              {/* Payment Summary */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h2 className="font-bold text-slate-800 mb-3">Payment Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.total_amount)}</span>
                  </div>
                  {order.coupon_discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatPrice(order.coupon_discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery</span>
                    <span>{order.shipping_amount === 0 ? 'FREE' : formatPrice(order.shipping_amount)}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-bold">
                    <span>Total Paid</span>
                    <span className="text-primary-600 text-base">{formatPrice(order.final_amount)}</span>
                  </div>
                  <div className="text-xs text-slate-400 pt-1">
                    Payment: <span className="font-medium text-slate-600 capitalize">{order.payment_method}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {shippingAddr && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h2 className="font-bold text-slate-800 mb-3">Delivery Address</h2>
                  <div className="text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">{shippingAddr.name}</p>
                    <p>{shippingAddr.phone}</p>
                    <p className="mt-1">{shippingAddr.address_line1}</p>
                    {shippingAddr.address_line2 && <p>{shippingAddr.address_line2}</p>}
                    <p>{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.pincode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsPage;

