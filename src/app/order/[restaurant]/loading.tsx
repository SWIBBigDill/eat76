import { PageShell } from "@/components/layout/PageShell";
import { MenuItemSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function RestaurantMenuLoading() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <Skeleton className="h-48 w-full sm:h-56 md:h-64" />
      <section className="eat-section pt-6">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="mb-4 h-10 w-full max-w-xl" />
          <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <MenuItemSkeleton key={i} />
              ))}
            </div>
            <Skeleton className="hidden h-96 lg:block" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
