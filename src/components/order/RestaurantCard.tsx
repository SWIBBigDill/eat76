import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Restaurant } from "@/lib/types";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="flex flex-col gap-3 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-eat-ink">{restaurant.name}</h3>
          <p className="text-sm text-eat-muted">{restaurant.foodType}</p>
        </div>
        <span className="rounded-full bg-eat-soft px-2.5 py-1 text-xs font-semibold text-eat-blue">
          ★ {restaurant.rating}
        </span>
      </div>
      <div className="flex gap-4 text-xs text-eat-muted">
        <span>{restaurant.distance}</span>
        <span>{restaurant.deliveryTime}</span>
        <span>ZIP {restaurant.zip}</span>
      </div>
      <Button href={`/order/${restaurant.id}`} className="w-full">
        Order Now
      </Button>
    </Card>
  );
}
