import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiPackage, FiShoppingCart, FiUsers, FiTag,
  FiStar, FiLogOut, FiChevronLeft, FiChevronRight,
  FiPlusCircle, FiList, FiPercent
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import Logo from '../common/Logo';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  {
    label: 'Products', icon: FiPackage,
    children: [
      { to: '/admin/products', label: 'All Products', icon: FiList },
      { to: '/admin/products/add', label: 'Add Product', icon: FiPlusCircle },
    ]
  },
  { to: '/admin/categories', label: 'Categories', icon: FiTag },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/coupons', label: 'Coupons', icon: FiPercent },
  { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState('Products');
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (to, exact = false) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="admin-sidebar relative flex flex-col shadow-xl min-h-screen z-10"
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700 overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
        {collapsed ? (
          /* When collapsed: just the logo image */
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="w-9 h-9 object-contain rounded-xl flex-shrink-0"
            style={{ mixBlendMode: 'screen' }}
          />
        ) : (
          <Logo size="sm" dark showTagline={false} />
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-slate-700 hover:bg-primary-600 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 z-20 transition-colors"
      >
        {collapsed ? <FiChevronRight className="text-xs" /> : <FiChevronLeft className="text-xs" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => !collapsed && setExpandedGroup(expandedGroup === item.label ? '' : item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : ''}
                >
                  <item.icon className="text-base flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <FiChevronRight className={`text-xs transition-transform ${expandedGroup === item.label ? 'rotate-90' : ''}`} />
                    </>
                  )}
                </button>

                {!collapsed && expandedGroup === item.label && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-700 pl-3">
                    {item.children.map(child => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive(child.to, child.to.endsWith('/products') && !child.to.endsWith('/add'))
                            ? 'text-primary-400 bg-primary-500/10'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <child.icon className="text-sm" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${collapsed ? 'justify-center' : ''} ${
                isActive(item.to, item.exact)
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <item.icon className="text-base flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className={`border-t border-slate-700 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 mb-2 px-1">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-slate-400 text-[10px] truncate">Administrator</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <FiLogOut className="text-base flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
