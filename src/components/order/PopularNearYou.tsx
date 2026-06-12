import { RestaurantCard } from "@/components/order/RestaurantCard";
import { restaurants } from "@/data/restaurants";
import type { Restaurant } from "@/lib/types";

function getPopularRestaurants(limit = 8): Restaurant[] {
  return [...restaurants]
    .filter((r) => r.zone === "kennett-square")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

type PopularNearYouProps = {
  limit?: number;
  compact?: boolean;
};

export function PopularNearYou({ limit = 8, compact }: PopularNearYouProps) {
  const popular = getPopularRestaurants(limit);

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <div>
        <h2 className="text-lg font-bold text-eat-ink sm:text-xl">Popular near you</h2>
        <p className="text-sm text-eat-muted">Top-rated in Kennett Square. Order in a tap.</p>
      </div>
      <div
        className={
          compact
            ? "flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1"
            : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        }
      >
        {popular.map((restaurant, i) => (
          <div
            key={restaurant.id}
            className={compact ? "w-64 shrink-0 animate-fade-in-up" : "animate-fade-in-up"}
            style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
          >
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </div>
    </div>
  );
}
