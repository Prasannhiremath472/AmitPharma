const sizes = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
};

const LoadingSpinner = ({ size = 'md', className = '', center = false }) => {
  const spinner = (
    <div
      className={`${sizes[size]} border-slate-200 border-t-primary-500 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );

  if (center) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <LoadingSpinner size="xl" className="mx-auto mb-4" />
      <p className="text-slate-500 text-sm animate-pulse">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;
