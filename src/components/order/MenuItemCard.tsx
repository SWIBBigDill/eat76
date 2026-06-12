"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/context/CartContext";
import type { MenuItem } from "@/lib/types";

type MenuItemCardProps = {
  item: MenuItem;
  restaurantImage?: string;
};

export function MenuItemCard({ item, restaurantImage }: MenuItemCardProps) {
  const { addItem } = useCart();
  const imageSrc = item.image ?? restaurantImage;

  return (
    <Card padding="sm" className="flex gap-4 overflow-hidden">
      {imageSrc && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-eat-soft">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-eat-ink">{item.name}</h4>
        <p className="mt-0.5 text-sm text-eat-muted line-clamp-2">{item.description}</p>
        <p className="mt-2 font-bold text-eat-blue">${item.price.toFixed(2)}</p>
      </div>
      <Button
        variant="outline"
        className="shrink-0 self-center px-4 py-2"
        onClick={() =>
          addItem({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
          })
        }
      >
        Add
      </Button>
    </Card>
  );
}
