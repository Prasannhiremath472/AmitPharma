const variants = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
};

const sizes = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1',
};

const Badge = ({ children, variant = 'default', size = 'md', rounded = true, className = '', dot = false }) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold
        ${rounded ? 'rounded-full' : 'rounded-md'}
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${variants[variant].split(' ')[1].replace('text-', 'bg-')}`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
