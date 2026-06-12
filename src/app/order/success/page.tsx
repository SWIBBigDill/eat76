import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params.session_id;

  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-eat-red">
            Order placed
          </p>
          <h1 className="mt-2 text-2xl font-bold text-eat-ink">Thanks for supporting local!</h1>
          <p className="mt-3 text-eat-muted">
            Your payment was processed by Eat76. We&apos;ll notify the restaurant and a local driver
            when live dispatch is connected.
          </p>
          {sessionId && (
            <p className="mt-4 text-xs text-eat-muted break-all">
              Reference: {sessionId}
            </p>
          )}
          <Link
            href="/order"
            className="mt-6 inline-block rounded-xl bg-eat-blue px-6 py-3 font-semibold text-white"
          >
            Order again
          </Link>
        </Card>
      </div>
    </PageShell>
  );
}
