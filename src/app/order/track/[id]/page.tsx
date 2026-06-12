"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { OrderTracker } from "@/components/order/OrderTracker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { PlacedOrder } from "@/context/CartContext";
import { loadOrderById } from "@/lib/order-tracking";

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrder(loadOrderById(orderId));
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <PageShell className="pb-20 md:pb-0">
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-eat-blue border-t-transparent" />
          <p className="mt-4 text-sm text-eat-muted">Loading order…</p>
        </div>
      </PageShell>
    );
  }

  if (!order) {
    return (
      <PageShell className="pb-20 md:pb-0">
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-eat-ink">Order not found</h1>
          <p className="mt-2 text-eat-muted">
            We couldn&apos;t find order <strong>{orderId}</strong> on this device. Place a new order to track it here.
          </p>
          <Button href="/order" className="mt-6">
            Browse restaurants
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="pb-20 md:pb-0">
      <section className="eat-section">
        <div className="mx-auto max-w-lg px-4">
          <Link href="/order/confirmation" className="text-sm font-semibold text-eat-blue">
            ← Back to confirmation
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-eat-ink">Track your order</h1>
          <p className="mt-1 text-sm text-eat-muted">
            {order.restaurantName} · <span className="font-semibold text-eat-blue">{order.id}</span>
          </p>

          <Card className="mt-6">
            <OrderTracker placedAt={order.placedAt} />
          </Card>

          <Card className="mt-6">
            <p className="text-sm font-semibold text-eat-ink">Order summary</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {order.items.map((item) => (
                <li key={item.menuItemId} className="flex justify-between gap-2">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>{formatMoney(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-eat-border pt-3 font-bold">
              <span>Total</span>
              <span className="text-eat-blue">{formatMoney(order.total)}</span>
            </div>
            {order.savings > 0 && (
              <p className="mt-2 text-sm font-semibold text-eat-red">
                Saved {formatMoney(order.savings)} vs typical big-app fees
              </p>
            )}
          </Card>

          <div className="mt-8 flex flex-col gap-3">
            <Button href={`/order/${order.restaurantId}`}>Order again from {order.restaurantName}</Button>
            <Button href="/order" variant="outline">
              Browse more restaurants
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
