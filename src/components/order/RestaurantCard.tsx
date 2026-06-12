"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import type { Restaurant } from "@/lib/types";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const imageSrc = restaurant.image ?? `/restaurants/${restaurant.id}/hero.svg`;
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(restaurant.id));
  }, [restaurant.id]);

  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(toggleFavorite(restaurant.id));
  }

  return (
    <Card className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link href={`/order/${restaurant.id}`} className="block">
        <div className="relative h-44 w-full overflow-hidden bg-eat-soft sm:h-48">
          <Image
            src={imageSrc}
            alt={`${restaurant.name}, local restaurant in ${restaurant.zip}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="tap-target absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition active:scale-95"
            aria-label={favorited ? `Remove ${restaurant.name} from favorites` : `Save ${restaurant.name} to favorites`}
          >
            <svg
              className={`h-5 w-5 ${favorited ? "fill-eat-red text-eat-red" : "fill-none text-eat-muted"}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-eat-blue shadow-sm backdrop-blur">
            ★ {restaurant.rating}
          </span>
        </div>
        <div className="flex flex-col gap-2.5 p-4">
          <div className="min-w-0">
            <h3 className="font-bold text-eat-ink truncate group-hover:text-eat-blue transition-colors">
              {restaurant.name}
            </h3>
            <p className="text-sm text-eat-muted truncate">{restaurant.foodType}</p>
          </div>
          <p className="text-xs text-eat-muted line-clamp-1">{restaurant.address}</p>
          <div className="flex flex-wrap gap-3 text-xs font-medium text-eat-muted">
            <span>{restaurant.distance}</span>
            <span>·</span>
            <span>{restaurant.deliveryTime}</span>
          </div>
          <span className="tap-target mt-1 inline-flex w-full items-center justify-center rounded-2xl bg-eat-blue px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-eat-blue-dark">
            Order
          </span>
        </div>
      </Link>
    </Card>
  );
}
