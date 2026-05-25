const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
      <div className="aspect-square bg-slate-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6" />
        <div className="flex items-center gap-2 mt-2">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-20" />
          <div className="h-4 bg-slate-200 rounded animate-pulse w-14" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl animate-pulse mt-1" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonCard;
