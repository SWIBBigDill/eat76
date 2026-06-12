"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/context/CartContext";
import type { PlacedOrder } from "@/context/CartContext";
import { loadOrderHistory } from "@/lib/order-tracking";

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function OrderHistoryPanel({ compact }: { compact?: boolean }) {
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const { reorderFromOrder } = useCart();
  const router = useRouter();

  useEffect(() => {
    setOrders(loadOrderHistory().slice(0, 5));
  }, []);

  const handleReorder = useCallback(
    (order: PlacedOrder) => {
      reorderFromOrder(order);
      router.push(`/order/${order.restaurantId}`);
    },
    [reorderFromOrder, router]
  );

  if (orders.length === 0) return null;

  return (
    <Card className={compact ? "p-4" : undefined}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-bold text-eat-ink">Order again</h3>
        <span className="text-xs text-eat-muted">Last {orders.length}</span>
      </div>
      <ul className="mt-3 space-y-2">
        {orders.map((order) => (
          <li
            key={order.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-eat-border px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-eat-ink">
                {order.restaurantName}
              </p>
              <p className="text-xs text-eat-muted">
                {formatDate(order.placedAt)} · {order.items.length} item
                {order.items.length !== 1 ? "s" : ""} · {formatMoney(order.total)}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <Button
                variant="outline"
                className="tap-target px-3 py-1.5 text-xs"
                onClick={() => handleReorder(order)}
              >
                Reorder
              </Button>
              <Link
                href={`/order/track/${order.id}`}
                className="text-center text-[11px] font-semibold text-eat-blue hover:underline"
              >
                Track
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
