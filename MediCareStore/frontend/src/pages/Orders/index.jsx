import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiPackage, FiArrowRight } from 'react-icons/fi';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import { formatPrice, formatDate, getOrderStatusColor } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { items: orders, loading, pagination } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>My Orders - Amit R. Medical</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-800 font-heading mb-6">My Orders</h1>

          {loading ? (
            <LoadingSpinner center />
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <FiPackage className="text-6xl text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-700 mb-2">No Orders Yet</h2>
              <p className="text-slate-400 mb-6">You haven't placed any orders. Start shopping!</p>
              <Link to="/products" className="btn-primary px-8">Browse Products</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-100 p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-800 text-sm">{order.order_id}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{formatDate(order.created_at)} â€¢ {order.item_count} item{order.item_count !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-primary-600 text-lg">{formatPrice(order.final_amount)}</p>
                        <p className="text-xs text-slate-400 capitalize">{order.payment_method}</p>
                      </div>
                      <Link
                        to={`/orders/${order.order_id}`}
                        className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        View <FiArrowRight className="text-sm" />
                      </Link>
                    </div>
                  </div>

                  {/* Status progress */}
                  <div className="flex items-center gap-1.5 mt-3">
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, i) => {
                      const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
                      const currentIdx = statuses.indexOf(order.status);
                      const isCompleted = i <= currentIdx;
                      const isCancelled = order.status === 'cancelled';
                      return (
                        <div key={status} className="flex items-center flex-1">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            isCancelled ? 'bg-red-400' : isCompleted ? 'bg-primary-500' : 'bg-slate-200'
                          }`} />
                          {i < 4 && (
                            <div className={`flex-1 h-0.5 ${
                              isCancelled ? 'bg-red-200' : i < currentIdx ? 'bg-primary-400' : 'bg-slate-200'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map(s => (
                      <span key={s} className="text-[9px] text-slate-400 font-medium">{s}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;

