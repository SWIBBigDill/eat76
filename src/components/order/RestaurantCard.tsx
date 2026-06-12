import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { Restaurant } from "@/lib/types";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const imageSrc = restaurant.image ?? `/restaurants/${restaurant.id}/hero.svg`;

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
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-eat-blue shadow-sm backdrop-blur">
            ★ {restaurant.rating}
          </span>
        </div>
        <div className="flex flex-col gap-2.5 p-4">
          <div className="min-w-0">
            <h3 className="font-bold text-eat-ink truncate group-hover:text-eat-blue transition-colors">
              {restaurant.name}
            </h3>
            <p className="text-sm text-eat-muted">{restaurant.foodType}</p>
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
