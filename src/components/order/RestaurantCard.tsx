import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Restaurant } from "@/lib/types";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const imageSrc = restaurant.image ?? `/restaurants/${restaurant.id}/hero.svg`;

  return (
    <Card className="overflow-hidden p-0 transition hover:shadow-md">
      <div className="relative h-40 w-full bg-eat-soft">
        <Image
          src={imageSrc}
          alt={`${restaurant.name} — local restaurant in ${restaurant.zip}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-eat-ink truncate">{restaurant.name}</h3>
            <p className="text-sm text-eat-muted">{restaurant.foodType}</p>
          </div>
          <span className="shrink-0 rounded-full bg-eat-soft px-2.5 py-1 text-xs font-semibold text-eat-blue">
            ★ {restaurant.rating}
          </span>
        </div>
        <p className="text-xs text-eat-muted line-clamp-1">{restaurant.address}</p>
        <div className="flex flex-wrap gap-3 text-xs text-eat-muted">
          <span>{restaurant.distance}</span>
          <span>{restaurant.deliveryTime}</span>
        </div>
        <Button href={`/order/${restaurant.id}`} className="w-full">
          Order Now
        </Button>
      </div>
    </Card>
  );
}
