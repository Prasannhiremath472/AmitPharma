import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-white hover:bg-slate-50 text-primary-600 border-2 border-primary-200 hover:border-primary-400',
  outline: 'border-2 border-slate-200 hover:border-primary-400 text-slate-700 hover:text-primary-600',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  ghost: 'text-slate-700 hover:bg-slate-100',
  link: 'text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline p-0',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
  xl: 'px-10 py-4 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  rounded = 'xl',
  icon,
  iconRight,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold
    transition-all duration-200 active:scale-95 cursor-pointer
    disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
    focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
  `;

  const roundedClass = rounded === 'full' ? 'rounded-full' : `rounded-${rounded}`;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${roundedClass} ${widthClass} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;
