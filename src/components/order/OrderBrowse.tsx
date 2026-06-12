"use client";

import { useMemo, useState } from "react";
import { CheckoutSavings } from "@/components/order/CheckoutSavings";
import { FloatingCartFAB } from "@/components/order/FloatingCartFAB";
import { OrderHistoryPanel } from "@/components/order/OrderHistoryPanel";
import { PopularNearYou } from "@/components/order/PopularNearYou";
import { RestaurantCard } from "@/components/order/RestaurantCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyRestaurantsIllustration } from "@/components/ui/EmptyIllustrations";
import { WeatherChip } from "@/components/weather/LocalWeather";
import { getRestaurantsByZone, restaurants } from "@/data/restaurants";
import { deliveryZones, type DeliveryZoneId } from "@/data/zones";
import {
  getCuisineFilters,
  restaurantMatchesCuisine,
} from "@/lib/cuisine-filters";
import { loadFavoriteIds } from "@/lib/favorites";
import {
  isRestaurantOpenNow,
  parseDistanceMiles,
  parsePrepMinutes,
} from "@/lib/restaurant-hours";
import type { Restaurant } from "@/lib/types";

const cuisineFilters = getCuisineFilters();

type SortOption = "nearest" | "fastest" | "rating" | "favorites";

function sortRestaurants(list: Restaurant[], sort: SortOption): Restaurant[] {
  const favoriteIds = new Set(loadFavoriteIds());
  const sorted = [...list];

  switch (sort) {
    case "nearest":
      return sorted.sort(
        (a, b) => parseDistanceMiles(a.distance) - parseDistanceMiles(b.distance)
      );
    case "fastest":
      return sorted.sort(
        (a, b) => parsePrepMinutes(a.deliveryTime) - parsePrepMinutes(b.deliveryTime)
      );
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "favorites":
      return sorted.sort((a, b) => {
        const af = favoriteIds.has(a.id) ? 1 : 0;
        const bf = favoriteIds.has(b.id) ? 1 : 0;
        if (bf !== af) return bf - af;
        return b.rating - a.rating;
      });
    default:
      return sorted;
  }
}

export function OrderBrowse() {
  const [activeZone, setActiveZone] = useState<DeliveryZoneId | "all">("all");
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("nearest");
  const [openNowOnly, setOpenNowOnly] = useState(false);

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = restaurants.filter((r) => {
      const zoneMatch = activeZone === "all" || r.zone === activeZone;
      const cuisineMatch = restaurantMatchesCuisine(r.foodType, activeCuisine);
      const searchMatch =
        !query ||
        r.name.toLowerCase().includes(query) ||
        r.foodType.toLowerCase().includes(query);
      const openMatch = !openNowOnly || isRestaurantOpenNow(r);
      return zoneMatch && cuisineMatch && searchMatch && openMatch;
    });
    return sortRestaurants(list, sortBy);
  }, [activeZone, activeCuisine, search, sortBy, openNowOnly]);

  const zonesToShow =
    activeZone === "all"
      ? deliveryZones
      : deliveryZones.filter((z) => z.id === activeZone);

  const showGrouped =
    activeZone === "all" && !search && !activeCuisine && !openNowOnly && sortBy === "nearest";

  return (
    <>
      <section className="eat-section bg-gradient-to-b from-eat-soft to-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-eat-red/10 px-3 py-1 text-xs font-bold text-eat-red">
              Save vs big delivery apps
            </span>
            <WeatherChip />
          </div>
          <SectionHeading
            className="mt-3"
            title="Order local near 19348"
            subtitle="Browse Kennett Square favorites. $1.76 service + $4.76 delivery. Every fee shown before checkout."
          />
          <div className="mt-5 max-w-md">
            <CheckoutSavings foodSubtotal={28} tip={4} compact />
          </div>
          <p className="mt-4 text-sm text-eat-muted">
            {restaurants.length} local restaurants within ~10 miles. Real photos where available.
          </p>
        </div>
      </section>

      <section className="border-b border-eat-border bg-white py-6">
        <div className="mx-auto max-w-6xl px-4">
          <PopularNearYou limit={6} compact />
        </div>
      </section>

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

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="tap-target rounded-full border border-eat-border bg-white px-3 py-2 text-xs font-semibold text-eat-ink focus:border-eat-blue focus:outline-none"
              aria-label="Sort restaurants"
            >
              <option value="nearest">Nearest</option>
              <option value="fastest">Fastest</option>
              <option value="rating">Top rated</option>
              <option value="favorites">Favorites first</option>
            </select>
            <button
              type="button"
              onClick={() => setOpenNowOnly((v) => !v)}
              className={`tap-target rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                openNowOnly
                  ? "bg-green-600 text-white"
                  : "border border-eat-border bg-eat-soft text-eat-ink hover:border-green-600/40"
              }`}
            >
              Open now
            </button>
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
          <OrderHistoryPanel />
          {activeZone === "all" && !search && !activeCuisine && !openNowOnly && (
            <PopularNearYou compact />
          )}

          {filteredRestaurants.length === 0 ? (
            <div className="py-12 text-center">
              <EmptyRestaurantsIllustration />
              <p className="mt-4 text-lg font-semibold text-eat-ink">No restaurants found</p>
              <p className="mt-2 text-sm text-eat-muted">
                {openNowOnly
                  ? "Nothing open right now. Try turning off the Open now filter."
                  : "Try a different search or zone filter."}
              </p>
              {openNowOnly && (
                <button
                  type="button"
                  onClick={() => setOpenNowOnly(false)}
                  className="mt-4 text-sm font-semibold text-eat-blue tap-target"
                >
                  Show all restaurants
                </button>
              )}
            </div>
          ) : showGrouped ? (
            zonesToShow.map((zone) => {
              const zoneRestaurants = sortRestaurants(
                getRestaurantsByZone(zone.id),
                sortBy
              );
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
              subtitle={
                search
                  ? `Matching "${search}"`
                  : openNowOnly
                    ? "Open for delivery now"
                    : undefined
              }
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
  restaurants: Restaurant[];
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
