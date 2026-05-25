import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, icon: Icon, color = 'primary', change, loading = false }) => {
  const colorMap = {
    primary: { bg: 'bg-primary-50', icon: 'bg-primary-500', text: 'text-primary-600', border: 'border-primary-100' },
    success: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-100' },
    warning: { bg: 'bg-amber-50', icon: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-100' },
    danger: { bg: 'bg-red-50', icon: 'bg-red-500', text: 'text-red-600', border: 'border-red-100' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-100' },
  };

  const c = colorMap[color] || colorMap.primary;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="w-12 h-12 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-8 bg-slate-200 rounded w-32 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-20" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white rounded-2xl p-5 border ${c.border} hover:shadow-card transition-all duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center shadow-sm`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className={`text-2xl font-bold ${c.text} font-heading`}>{value}</p>
          {change !== undefined && (
            <p className={`text-xs font-medium mt-1 ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
