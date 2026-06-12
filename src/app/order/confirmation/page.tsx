"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { CheckoutSavings } from "@/components/order/CheckoutSavings";
import { OrderTracker } from "@/components/order/OrderTracker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loadPlacedOrder, type PlacedOrder } from "@/context/CartContext";

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function OrderConfirmationPage() {
  const [order] = useState<PlacedOrder | null>(() => loadPlacedOrder());

  if (!order) {
    return (
      <PageShell className="pb-20 md:pb-0">
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-eat-ink">No order found</h1>
          <p className="mt-2 text-eat-muted">
            Place an order from a restaurant menu to see your confirmation.
          </p>
          <Button href="/order" className="mt-6">
            Browse restaurants
          </Button>
        </div>
      </PageShell>
    );
  }

  const placedTime = new Date(order.placedAt).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <PageShell className="pb-20 md:pb-0">
      <section className="eat-section">
        <div className="mx-auto max-w-lg px-4">
          <div className="text-center animate-success-pop">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-eat-blue text-white">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-eat-ink">Order placed!</h1>
            <p className="mt-2 text-eat-muted">
              Your order is on its way. Track live status below.
            </p>
            <p className="mt-1 text-sm font-semibold text-eat-blue">
              Order {order.id}
            </p>
          </div>

          <Card className="mt-8">
            <p className="text-sm font-semibold text-eat-ink">Live tracking (demo)</p>
            <p className="mt-1 text-xs text-eat-muted">
              Status advances automatically — pattern from Grub order progress UI.
            </p>
            <div className="mt-4">
              <OrderTracker placedAt={order.placedAt} />
            </div>
            <Link
              href={`/order/track/${order.id}`}
              className="mt-4 inline-flex text-sm font-semibold text-eat-blue hover:underline"
            >
              Open full tracking view →
            </Link>
          </Card>

          <Card className="mt-6">
            <p className="text-sm font-semibold text-eat-ink">{order.restaurantName}</p>
            <p className="text-xs text-eat-muted">{placedTime}</p>

            <ul className="mt-4 space-y-2 border-b border-eat-border pb-4 text-sm">
              {order.items.map((item) => (
                <li key={item.menuItemId} className="flex justify-between gap-2">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span className="font-medium">
                    {formatMoney(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-eat-muted">
                <span>Food subtotal</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-eat-muted">
                <span>Service + delivery</span>
                <span>{formatMoney(order.serviceFee + order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-eat-muted">
                <span>Tip</span>
                <span>{formatMoney(order.tip)}</span>
              </div>
              <div className="flex justify-between border-t border-eat-border pt-3 font-bold text-eat-ink">
                <span>Total</span>
                <span className="text-eat-blue">{formatMoney(order.total)}</span>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <CheckoutSavings foodSubtotal={order.subtotal} tip={order.tip} />
          </div>

          {order.savings > 0 && (
            <p className="mt-4 text-center text-sm font-semibold text-eat-red">
              You saved {formatMoney(order.savings)} vs a typical big delivery app on this order.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Button href={`/order/track/${order.id}`}>Track order</Button>
            <Button href="/order" variant="outline">
              Order again
            </Button>
            <Button href="/" variant="ghost">
              Back to home
            </Button>
            <Link
              href={`/order/${order.restaurantId}`}
              className="text-center text-sm font-semibold text-eat-blue"
            >
              Return to {order.restaurantName}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
