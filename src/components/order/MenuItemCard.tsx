"use client";

import Image from "next/image";
import { useState } from "react";
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
  const [justAdded, setJustAdded] = useState(false);
  const imageSrc = item.image ?? restaurantImage;

  function handleAdd() {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 800);
  }

  return (
    <Card padding="sm" className="flex gap-4 overflow-hidden transition-shadow hover:shadow-md">
      {imageSrc && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-eat-soft sm:h-24 sm:w-24">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
            loading="lazy"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-eat-ink">{item.name}</h4>
        <p className="mt-0.5 text-sm text-eat-muted line-clamp-2">{item.description}</p>
        <p className="mt-2 font-bold text-eat-blue">${item.price.toFixed(2)}</p>
      </div>
      <Button
        variant={justAdded ? "primary" : "outline"}
        className={`tap-target shrink-0 self-center min-w-[72px] px-4 py-2 transition-all ${
          justAdded ? "animate-add-pop bg-eat-red border-eat-red hover:bg-eat-red-dark" : ""
        }`}
        onClick={handleAdd}
      >
        {justAdded ? "Added ✓" : "Add"}
      </Button>
    </Card>
  );
}
