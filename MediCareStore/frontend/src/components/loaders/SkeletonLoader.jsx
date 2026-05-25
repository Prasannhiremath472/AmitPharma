export const SkeletonLine = ({ width = 'full', height = 4 }) => (
  <div className={`h-${height} bg-slate-200 rounded animate-pulse w-${width}`} />
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-slate-200 rounded animate-pulse"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 10 }) => (
  <div className={`w-${size} h-${size} bg-slate-200 rounded-full animate-pulse`} />
);

export const SkeletonButton = () => (
  <div className="h-10 bg-slate-200 rounded-xl animate-pulse w-32" />
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-300 rounded animate-pulse" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, row) => (
      <div key={row} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, col) => (
          <div key={col} className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: Math.random() > 0.5 ? '80%' : '100%' }} />
        ))}
      </div>
    ))}
  </div>
);

const SkeletonLoader = ({ type = 'card' }) => {
  switch (type) {
    case 'text': return <SkeletonText />;
    case 'avatar': return <SkeletonAvatar />;
    case 'button': return <SkeletonButton />;
    case 'table': return <SkeletonTable />;
    default: return <SkeletonText />;
  }
};

export default SkeletonLoader;
