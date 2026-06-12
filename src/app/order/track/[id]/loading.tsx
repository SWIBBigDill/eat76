import { PageShell } from "@/components/layout/PageShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrackOrderLoading() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <section className="eat-section">
        <div className="mx-auto max-w-lg px-4">
          <Skeleton className="mx-auto h-16 w-16 rounded-full" />
          <Skeleton className="mx-auto mt-4 h-8 w-48" />
          <Skeleton className="mt-8 h-64 w-full" />
          <Skeleton className="mt-6 h-40 w-full" />
        </div>
      </section>
    </PageShell>
  );
}
