import { PageShell } from "@/components/layout/PageShell";
import { PageHeaderSkeleton, RestaurantCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function OrderLoading() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <section className="eat-section">
        <div className="mx-auto max-w-6xl px-4">
          <PageHeaderSkeleton />
          <Skeleton className="mt-6 h-11 w-full max-w-md" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
