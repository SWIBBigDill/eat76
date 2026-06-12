import { RestaurantCard } from "@/components/order/RestaurantCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { restaurants } from "@/data/restaurants";

function getFeaturedRestaurants() {
  return restaurants
    .filter((r) => r.zone === "kennett-square")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
}

export function FeaturedRestaurants() {
  const featured = getFeaturedRestaurants();

  return (
    <section className="eat-section bg-gradient-to-b from-white to-eat-soft/60">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-eat-red">
          Hungry now?
        </p>
        <SectionHeading
          centered
          className="mt-2"
          title="Browse local restaurants"
          subtitle="Top-rated spots in Kennett Square. Real menus, real photos, delivered by neighbors who know the area."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((restaurant, i) => (
            <div
              key={restaurant.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i * 60, 360)}ms` }}
            >
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button href="/order" variant="primary" className="tap-target px-8">
            See all {restaurants.length}+ restaurants
          </Button>
        </div>
      </div>
    </section>
  );
}
