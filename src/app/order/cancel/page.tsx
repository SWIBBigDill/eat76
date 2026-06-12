import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getRestaurantById } from "@/data/restaurants";

type Props = {
  searchParams: Promise<{ restaurant?: string }>;
};

export default async function OrderCancelPage({ searchParams }: Props) {
  const params = await searchParams;
  const restaurantId = params.restaurant;
  const restaurant = restaurantId ? getRestaurantById(restaurantId) : null;

  return (
    <PageShell className="pb-20 md:pb-0">
      <div className="mx-auto max-w-lg px-4 py-16">
        <Card className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-eat-soft text-eat-muted">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-eat-ink">Checkout cancelled</h1>
          <p className="mt-3 text-eat-muted">
            No charge was made. Your cart items are still saved — pick up where you left off.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {restaurant ? (
              <Button href={`/order/${restaurant.id}`}>
                Return to {restaurant.name}
              </Button>
            ) : (
              <Button href="/order">Back to restaurants</Button>
            )}
            <Link
              href="/order"
              className="text-sm font-semibold text-eat-blue hover:underline"
            >
              Browse all restaurants
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
