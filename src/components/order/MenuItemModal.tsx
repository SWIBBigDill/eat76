"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MenuItemBadges } from "@/components/order/MenuItemBadges";
import type { MenuItem, MenuOptionGroup } from "@/lib/types";
import {
  areRequiredOptionsMet,
  buildSelectedOptions,
  calculateItemPrice,
  getDefaultSelections,
  toggleChoice,
  type OptionSelections,
} from "@/lib/menu-options";

type MenuItemModalProps = {
  item: MenuItem;
  restaurantImage?: string;
  open: boolean;
  onClose: () => void;
  onAdd: (payload: {
    quantity: number;
    unitPrice: number;
    selectedOptions: ReturnType<typeof buildSelectedOptions>;
    optionSummary: string;
  }) => void;
};

function OptionGroupSection({
  group,
  selections,
  onToggle,
}: {
  group: MenuOptionGroup;
  selections: string[];
  onToggle: (choiceId: string) => void;
}) {
  const isRadio = (group.maxSelections ?? 1) === 1;
  const selectionHint = group.required
    ? isRadio
      ? "Choose one"
      : group.maxSelections
        ? `Choose up to ${group.maxSelections}`
        : "Choose at least one"
    : isRadio
      ? "Optional"
      : group.maxSelections
        ? `Optional · up to ${group.maxSelections}`
        : "Optional";

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-semibold text-eat-ink">{group.name}</h4>
          <p className="text-xs text-eat-muted">{selectionHint}</p>
        </div>
        {group.required && (
          <span className="shrink-0 rounded-full bg-eat-red/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-eat-red">
            Required
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {group.choices.map((choice) => {
          const selected = selections.includes(choice.id);
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onToggle(choice.id)}
              className={`tap-target flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                selected
                  ? "border-eat-blue bg-eat-blue/5"
                  : "border-eat-border hover:border-eat-blue/40"
              }`}
            >
              <span className="flex min-w-0 flex-1 items-center gap-2.5">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-eat-blue bg-eat-blue" : "border-eat-border"
                  }`}
                >
                  {selected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span className="min-w-0 text-eat-ink line-clamp-2">{choice.name}</span>
              </span>
              {choice.priceDelta > 0 && (
                <span className="shrink-0 text-eat-muted">
                  +${choice.priceDelta.toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MenuItemModal({
  item,
  restaurantImage,
  open,
  onClose,
  onAdd,
}: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<OptionSelections>(() =>
    getDefaultSelections(item.optionGroups)
  );

  const unitPrice = useMemo(
    () => calculateItemPrice(item.price, item.optionGroups, selections),
    [item.price, item.optionGroups, selections]
  );

  const canAdd = areRequiredOptionsMet(item.optionGroups, selections);
  const imageSrc = item.image ?? restaurantImage;

  function handleToggle(group: MenuOptionGroup, choiceId: string) {
    setSelections((prev) => ({
      ...prev,
      [group.id]: toggleChoice(group, prev[group.id] ?? [], choiceId),
    }));
  }

  function handleAdd() {
    if (!canAdd) return;
    const selectedOptions = buildSelectedOptions(item.optionGroups, selections);
    const optionSummary = selectedOptions.flatMap((o) => o.choiceNames).join(" · ");
    onAdd({ quantity, unitPrice, selectedOptions, optionSummary });
    setQuantity(1);
    setSelections(getDefaultSelections(item.optionGroups));
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[55] lg:z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 animate-fade-in"
        aria-label="Close item details"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col animate-slide-up rounded-t-3xl bg-white shadow-2xl safe-bottom lg:inset-x-auto lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:max-h-[85vh] lg:w-full lg:max-w-lg lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-3xl">
        <div className="flex shrink-0 justify-center pt-3 pb-1 lg:hidden">
          <div className="h-1 w-10 rounded-full bg-eat-border" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 lg:max-h-[calc(85vh-5rem)]">
          {imageSrc && (
            <div className="relative -mx-4 mb-4 h-40 overflow-hidden bg-eat-soft lg:mx-0 lg:mt-0 lg:rounded-t-3xl lg:h-48">
              <Image
                src={imageSrc}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 512px) 100vw, 512px"
              />
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <MenuItemBadges badges={item.badges} />
              <h3 className="text-xl font-bold text-eat-ink">{item.name}</h3>
              <p className="mt-1 text-sm text-eat-muted">{item.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="tap-target hidden shrink-0 rounded-full p-2 text-eat-muted hover:bg-eat-soft lg:block"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {item.optionGroups && item.optionGroups.length > 0 && (
            <div className="mt-5 space-y-5">
              {item.optionGroups.map((group) => (
                <OptionGroupSection
                  key={group.id}
                  group={group}
                  selections={selections[group.id] ?? []}
                  onToggle={(choiceId) => handleToggle(group, choiceId)}
                />
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-medium text-eat-ink">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="tap-target h-9 w-9 rounded-xl border border-eat-border text-eat-blue"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                className="tap-target h-9 w-9 rounded-xl border border-eat-border text-eat-blue"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-eat-border bg-white px-4 py-4 safe-bottom">
          {!canAdd && (
            <p className="mb-2 text-center text-xs text-eat-red">
              Please choose all required options
            </p>
          )}
          <Button
            className="w-full tap-target"
            disabled={!canAdd}
            onClick={handleAdd}
          >
            Add to cart · ${(unitPrice * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
}
