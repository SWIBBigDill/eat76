import { PageShell } from "@/components/layout/PageShell";
import { RestaurantCard } from "@/components/order/RestaurantCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { restaurants } from "@/data/restaurants";

export default function OrderPage() {
  return (
    <PageShell className="pb-24 lg:pb-0">
      <section className="eat-section bg-gradient-to-b from-eat-soft to-white">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            title="Order local in 19348"
            subtitle="No mystery checkout pile-on. Clear delivery fee. Clear service fee. Local restaurants. Local drivers."
          />
          <p className="mt-4 text-sm text-eat-muted">
            Demo ordering experience — payments not connected yet.
          </p>
        </div>
      </section>

      <section className="eat-section pt-0">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
