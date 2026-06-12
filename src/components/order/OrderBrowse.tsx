"use client";

import { useMemo, useState } from "react";
import { CheckoutSavings } from "@/components/order/CheckoutSavings";
import { FloatingCartFAB } from "@/components/order/FloatingCartFAB";
import { PopularNearYou } from "@/components/order/PopularNearYou";
import { RestaurantCard } from "@/components/order/RestaurantCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getRestaurantsByZone, restaurants } from "@/data/restaurants";
import { deliveryZones, type DeliveryZoneId } from "@/data/zones";
import {
  getCuisineFilters,
  restaurantMatchesCuisine,
} from "@/lib/cuisine-filters";

const cuisineFilters = getCuisineFilters();

export function OrderBrowse() {
  const [activeZone, setActiveZone] = useState<DeliveryZoneId | "all">("all");
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return restaurants.filter((r) => {
      const zoneMatch = activeZone === "all" || r.zone === activeZone;
      const cuisineMatch = restaurantMatchesCuisine(r.foodType, activeCuisine);
      const searchMatch =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.foodType.toLowerCase().includes(query);
      return zoneMatch && cuisineMatch && searchMatch;
    });
  }, [activeZone, activeCuisine, search]);

  const zonesToShow =
    activeZone === "all"
      ? deliveryZones
      : deliveryZones.filter((z) => z.id === activeZone);

  return (
    <>
      <section className="eat-section bg-gradient-to-b from-eat-soft to-white">
        <div className="mx-auto max-w-6xl px-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-eat-red/10 px-3 py-1 text-xs font-bold text-eat-red">
            Save vs big delivery apps
          </span>
          <SectionHeading
            className="mt-3"
            title="Order local near 19348"
            subtitle="Browse Kennett Square favorites. $1.76 service + $4.76 delivery — every fee shown before checkout."
          />
          <div className="mt-5 max-w-md">
            <CheckoutSavings foodSubtotal={28} tip={4} compact />
          </div>
          <p className="mt-4 text-sm text-eat-muted">
            {restaurants.length} local restaurants within ~10 miles — real photos where available.
          </p>
        </div>
      </section>

      <section className="border-b border-eat-border bg-white py-6">
        <div className="mx-auto max-w-6xl px-4">
          <PopularNearYou limit={6} compact />
        </div>
      </section>

      {/* Sticky filters */}
      <div className="sticky top-[57px] z-30 border-b border-eat-border bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-3">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-eat-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search by name or cuisine…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="tap-target w-full rounded-2xl border border-eat-border bg-eat-soft py-3 pl-10 pr-4 text-sm text-eat-ink placeholder:text-eat-muted focus:border-eat-blue focus:outline-none focus:ring-2 focus:ring-eat-blue/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            <ZoneChip
              label="All zones"
              count={restaurants.length}
              active={activeZone === "all"}
              onClick={() => setActiveZone("all")}
            />
            {deliveryZones.map((zone) => {
              const count = getRestaurantsByZone(zone.id).length;
              if (count === 0) return null;
              return (
                <ZoneChip
                  key={zone.id}
                  label={zone.label.split(" / ")[0]}
                  count={count}
                  active={activeZone === zone.id}
                  onClick={() => setActiveZone(zone.id)}
                />
              );
            })}
          </div>
          {/* Cuisine chips — Grub FilterView pattern */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            <FilterChip
              label="All cuisines"
              active={activeCuisine === null}
              onClick={() => setActiveCuisine(null)}
            />
            {cuisineFilters.map(({ label, match }) => (
              <FilterChip
                key={match}
                label={label}
                active={activeCuisine === match}
                onClick={() =>
                  setActiveCuisine((prev) => (prev === match ? null : match))
                }
              />
            ))}
          </div>
        </div>
      </div>

      <section className="eat-section pt-6 space-y-12">
        <div className="mx-auto max-w-6xl px-4 space-y-12">
          {activeZone === "all" && !search && !activeCuisine && (
            <PopularNearYou compact />
          )}

          {filteredRestaurants.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg font-semibold text-eat-ink">No restaurants found</p>
              <p className="mt-2 text-sm text-eat-muted">
                Try a different search or zone filter.
              </p>
            </div>
          ) : activeZone === "all" && !search && !activeCuisine ? (
            zonesToShow.map((zone) => {
              const zoneRestaurants = getRestaurantsByZone(zone.id);
              if (zoneRestaurants.length === 0) return null;

              return (
                <RestaurantGrid
                  key={zone.id}
                  title={zone.label}
                  subtitle={zone.subtitle}
                  restaurants={zoneRestaurants}
                />
              );
            })
          ) : (
            <RestaurantGrid
              title={
                activeZone === "all"
                  ? `${filteredRestaurants.length} results`
                  : deliveryZones.find((z) => z.id === activeZone)?.label ?? ""
              }
              subtitle={search ? `Matching "${search}"` : undefined}
              restaurants={filteredRestaurants}
            />
          )}
        </div>
      </section>

      <FloatingCartFAB />
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap-target shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
        active
          ? "bg-eat-red text-white shadow-sm"
          : "border border-eat-border bg-eat-soft text-eat-ink hover:border-eat-red/40"
      }`}
    >
      {label}
    </button>
  );
}

function ZoneChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap-target shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-eat-blue text-white shadow-sm"
          : "border border-eat-border bg-white text-eat-ink hover:border-eat-blue/40"
      }`}
    >
      {label}
      <span className={`ml-1.5 text-xs ${active ? "text-white/80" : "text-eat-muted"}`}>
        {count}
      </span>
    </button>
  );
}

function RestaurantGrid({
  title,
  subtitle,
  restaurants: zoneRestaurants,
}: {
  title: string;
  subtitle?: string;
  restaurants: ReturnType<typeof getRestaurantsByZone>;
}) {
  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-eat-ink">{title}</h2>
        {subtitle && <p className="text-sm text-eat-muted">{subtitle}</p>}
        <p className="mt-1 text-xs text-eat-muted">
          {zoneRestaurants.length} restaurants
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {zoneRestaurants.map((restaurant, i) => (
          <div
            key={restaurant.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
          >
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </div>
    </div>
  );
}
