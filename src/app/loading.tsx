import { PageShell } from "@/components/layout/PageShell";
import { PageHeaderSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <PageHeaderSkeleton />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
