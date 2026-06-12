"use client";

import type { Restaurant } from "@/lib/types";
import {
  formatHoursStatus,
  isRestaurantOpenNow,
  parsePrepMinutes,
} from "@/lib/restaurant-hours";

type RestaurantInfoBarProps = {
  restaurant: Restaurant;
};

export function RestaurantInfoBar({ restaurant }: RestaurantInfoBarProps) {
  const open = isRestaurantOpenNow(restaurant);
  const prepMin = parsePrepMinutes(restaurant.deliveryTime);
  const deliveryEst = restaurant.deliveryTime;

  return (
    <div className="border-b border-eat-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 text-sm">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            open ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
          }`}
        >
          {open ? "Open now" : formatHoursStatus(restaurant)}
        </span>
        <span className="text-eat-muted">
          Prep ~{Math.max(15, prepMin - 10)} min
        </span>
        <span className="text-eat-muted">·</span>
        <span className="text-eat-muted">Delivery {deliveryEst}</span>
        <span className="text-eat-muted">·</span>
        <span className="text-eat-muted">{restaurant.distance}</span>
      </div>
    </div>
  );
}

type RestaurantAboutProps = {
  restaurant: Restaurant;
};

export function RestaurantAbout({ restaurant }: RestaurantAboutProps) {
  return (
    <section className="mb-8 rounded-2xl border border-eat-border bg-eat-soft/40 p-5">
      <h2 className="text-lg font-bold text-eat-ink">About</h2>
      <p className="mt-2 text-sm text-eat-muted">{restaurant.foodType}</p>
      <address className="mt-3 not-italic text-sm text-eat-ink">
        {restaurant.address}, {restaurant.zip}
      </address>
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        {restaurant.phone && (
          <a
            href={`tel:${restaurant.phone.replace(/\D/g, "")}`}
            className="font-semibold text-eat-blue tap-target"
          >
            {restaurant.phone}
          </a>
        )}
        {restaurant.website && (
          <a
            href={restaurant.website}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-eat-blue tap-target"
          >
            Website ↗
          </a>
        )}
      </div>
    </section>
  );
}
