type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-eat-border/70 ${className}`}
      aria-hidden
    />
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className="eat-card overflow-hidden">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="eat-card flex gap-4 p-4">
      <Skeleton className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-2 h-9 w-24" />
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  );
}
