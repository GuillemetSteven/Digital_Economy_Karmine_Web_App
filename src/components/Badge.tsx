interface BadgeProps {
  pageNumber?: number;
  className?: string;
}

export function Badge({ pageNumber, className = '' }: BadgeProps) {
  if (!pageNumber) return null;

  return (
    <div className={`px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-white/20 ${className}`}>
      <span className="text-xs font-medium text-white">
        p.{pageNumber}
      </span>
    </div>
  );
}
