import { PageShell } from "@/components/layout/PageShell";
import { PageHeaderSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function AccountLoading() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <section className="eat-section">
        <div className="mx-auto max-w-lg px-4">
          <PageHeaderSkeleton />
          <Skeleton className="mt-8 h-40 w-full" />
          <Skeleton className="mt-6 h-28 w-full" />
          <Skeleton className="mt-6 h-48 w-full" />
        </div>
      </section>
    </PageShell>
  );
}
