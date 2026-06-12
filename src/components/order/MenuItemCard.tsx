"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MenuItemModal } from "@/components/order/MenuItemModal";
import { useCart } from "@/context/CartContext";
import {
  buildLineId,
  formatItemDisplayName,
  itemHasOptions,
} from "@/lib/menu-options";
import type { MenuItem } from "@/lib/types";

type MenuItemCardProps = {
  item: MenuItem;
  restaurantImage?: string;
};

export function MenuItemCard({ item, restaurantImage }: MenuItemCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const hasOptions = itemHasOptions(item);
  const imageSrc = item.image ?? restaurantImage;

  function handleQuickAdd() {
    addItem({
      lineId: item.id,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      basePrice: item.price,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 800);
  }

  function handleCustomAdd(payload: {
    quantity: number;
    unitPrice: number;
    selectedOptions: NonNullable<
      Parameters<typeof addItem>[0]["selectedOptions"]
    >;
    optionSummary: string;
  }) {
    const lineId = buildLineId(item.id, payload.selectedOptions);
    const displayName = formatItemDisplayName(item.name, payload.optionSummary);
    addItem({
      lineId,
      menuItemId: item.id,
      name: displayName,
      price: payload.unitPrice,
      basePrice: item.price,
      selectedOptions: payload.selectedOptions,
      optionSummary: payload.optionSummary,
      quantity: payload.quantity,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 800);
  }

  return (
    <>
      <Card padding="sm" className="flex gap-4 overflow-hidden transition-shadow hover:shadow-md">
        {imageSrc && (
          <button
            type="button"
            onClick={() => hasOptions && setModalOpen(true)}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-eat-soft sm:h-24 sm:w-24 ${
              hasOptions ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <Image
              src={imageSrc}
              alt={item.name}
              fill
              className="object-cover"
              sizes="96px"
              loading="lazy"
            />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => hasOptions && setModalOpen(true)}
            className={`text-left ${hasOptions ? "cursor-pointer" : "cursor-default"}`}
          >
            <h4 className="font-semibold text-eat-ink">{item.name}</h4>
            <p className="mt-0.5 text-sm text-eat-muted line-clamp-2">
              {item.description}
            </p>
            <p className="mt-2 font-bold text-eat-blue">
              ${item.price.toFixed(2)}
              {hasOptions && (
                <span className="ml-1 text-xs font-normal text-eat-muted">
                  + options
                </span>
              )}
            </p>
          </button>
        </div>
        <Button
          variant={justAdded ? "primary" : "outline"}
          className={`tap-target shrink-0 self-center min-w-[88px] px-4 py-2 transition-all ${
            justAdded ? "animate-add-pop bg-eat-red border-eat-red hover:bg-eat-red-dark" : ""
          }`}
          onClick={() => (hasOptions ? setModalOpen(true) : handleQuickAdd())}
        >
          {justAdded ? "Added ✓" : hasOptions ? "Customize" : "Add"}
        </Button>
      </Card>

      {hasOptions && (
        <MenuItemModal
          item={item}
          restaurantImage={restaurantImage}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleCustomAdd}
        />
      )}
    </>
  );
}
