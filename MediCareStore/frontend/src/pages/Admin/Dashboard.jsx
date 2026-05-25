import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiDollarSign, FiUsers, FiPackage, FiAlertTriangle } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardCard from '../../components/admin/DashboardCard';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';
import { formatPrice, formatDate, getOrderStatusColor } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', shipped: '#6366f1', delivered: '#22c55e', cancelled: '#ef4444' };

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const orderCols = [
    { key: 'order_id', header: 'Order ID', render: (v) => <span className="font-mono text-sm font-medium text-primary-600">{v}</span> },
    { key: 'customer_name', header: 'Customer' },
    { key: 'final_amount', header: 'Amount', render: (v) => formatPrice(v) },
    { key: 'status', header: 'Status', render: (v) => <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getOrderStatusColor(v)}`}>{v}</span> },
    { key: 'created_at', header: 'Date', render: (v) => formatDate(v) },
  ];

  const pieData = data?.ordersByStatus ? Object.entries(data.ordersByStatus).map(([name, value]) => ({ name, value: parseInt(value) })) : [];

  return (
    <>
      <Helmet><title>Dashboard - Admin | Amit R. Medical</title></Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-heading">Dashboard</h1>
            <p className="text-slate-500 text-sm">Welcome to Amit R. Medical Admin Panel</p>
          </div>
          <div className="text-sm text-slate-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <DashboardCard title="Total Orders" value={data?.stats.totalOrders || 0} icon={FiShoppingCart} color="primary" loading={loading} />
          <DashboardCard title="Total Revenue" value={loading ? '...' : formatPrice(data?.stats.totalRevenue)} icon={FiDollarSign} color="success" loading={loading} />
          <DashboardCard title="Total Users" value={data?.stats.totalUsers || 0} icon={FiUsers} color="purple" loading={loading} />
          <DashboardCard title="Active Products" value={data?.stats.totalProducts || 0} icon={FiPackage} color="warning" loading={loading} />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-5 mb-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
            <h2 className="font-bold text-slate-800 mb-4">Revenue Overview (Last 12 Months)</h2>
            {loading ? (
              <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
            ) : data?.revenueByMonth?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `â‚¹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [formatPrice(v), 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5} dot={{ fill: '#0ea5e9', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No revenue data</div>
            )}
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h2 className="font-bold text-slate-800 mb-4">Orders by Status</h2>
            {loading ? (
              <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
            ) : pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-3">
                  {pieData.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[item.name] }} />
                        <span className="capitalize text-slate-600">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No orders</div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs text-primary-600 font-medium hover:text-primary-700">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <DataTable
                columns={orderCols}
                data={data?.recentOrders || []}
                loading={loading}
                emptyMessage="No orders yet"
              />
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="text-amber-500" />
                <h2 className="font-bold text-slate-800">Low Stock Alert</h2>
              </div>
              <Link to="/admin/products" className="text-xs text-primary-600 font-medium">Manage</Link>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}
                </div>
              ) : data?.lowStockProducts?.length > 0 ? (
                <div className="space-y-3">
                  {data.lowStockProducts.map(product => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">ðŸŠ</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{product.name}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">All products are well stocked âœ…</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

