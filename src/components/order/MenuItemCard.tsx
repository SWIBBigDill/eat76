"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/context/CartContext";
import type { MenuItem } from "@/lib/types";

type MenuItemCardProps = {
  item: MenuItem;
};

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCart();

  return (
    <Card padding="sm" className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-eat-ink">{item.name}</h4>
        <p className="mt-0.5 text-sm text-eat-muted line-clamp-2">{item.description}</p>
        <p className="mt-2 font-bold text-eat-blue">${item.price.toFixed(2)}</p>
      </div>
      <Button
        variant="outline"
        className="shrink-0 px-4 py-2"
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
