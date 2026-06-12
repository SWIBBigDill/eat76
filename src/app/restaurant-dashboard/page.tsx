"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { MockLoginBanner } from "@/components/ui/MockLoginBanner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { initialOrders } from "@/data/orders";
import {
  calculateRestaurantPlatformFee,
  DEFAULT_COMPETITOR_RATE,
  getRestaurantPricingTier,
  RESTAURANT_TIER1_LIMIT,
} from "@/lib/pricing";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_FLOW: OrderStatus[] = [
  "incoming",
  "accepted",
  "preparing",
  "ready",
  "completed",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  incoming: "Incoming",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready for pickup",
  completed: "Completed",
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function RestaurantDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const monthlyOrderCount = 142;
  const monthlySales = orders.reduce((sum, o) => sum + o.subtotal, 0) + 4820;
  const tier = getRestaurantPricingTier(monthlyOrderCount);
  const eat76Fees = calculateRestaurantPlatformFee(monthlyOrderCount, monthlySales / monthlyOrderCount);
  const competitorFees = monthlySales * DEFAULT_COMPETITOR_RATE;
  const todaysOrders = orders.filter((o) => o.status !== "completed").length + 3;

  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const idx = STATUS_FLOW.indexOf(order.status);
        if (idx < STATUS_FLOW.length - 1) {
          return { ...order, status: STATUS_FLOW[idx + 1] };
        }
        return order;
      })
    );
    // TODO: Supabase — update order status in database
  };

  const acceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "accepted" } : o))
    );
  };

  return (
    <PageShell>
      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold text-eat-ink">Restaurant Dashboard</h1>
          <p className="mt-2 text-eat-muted">Portabellos · 19348</p>
          <div className="mt-4">
            <MockLoginBanner role="restaurant" />
          </div>
        </div>
      </section>

      <section className="eat-section pt-0">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Today's orders", value: todaysOrders },
              { label: "Monthly orders", value: monthlyOrderCount },
              { label: "Monthly sales", value: formatMoney(monthlySales) },
              { label: "Eat76 fees", value: formatMoney(eat76Fees) },
              { label: "Est. savings vs 25%", value: formatMoney(competitorFees - eat76Fees), accent: true },
            ].map((stat) => (
              <Card key={stat.label} className={stat.accent ? "border-eat-red/20" : ""}>
                <p className="text-xs uppercase tracking-wide text-eat-muted">{stat.label}</p>
                <p className={`mt-1 text-xl font-bold ${stat.accent ? "text-eat-red" : "text-eat-ink"}`}>
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <h3 className="font-bold text-eat-ink">Current pricing tier</h3>
            <p className="mt-1 text-sm text-eat-muted">
              {tier.label} — {monthlyOrderCount} orders this month
            </p>
            <div className="mt-4">
              <ProgressBar
                value={monthlyOrderCount}
                max={RESTAURANT_TIER1_LIMIT}
                label={`Progress to volume tier (${RESTAURANT_TIER1_LIMIT} orders)`}
                color="blue"
              />
            </div>
            {tier.ordersUntilTier2 > 0 && (
              <p className="mt-2 text-sm text-eat-muted">
                {tier.ordersUntilTier2} more orders until 12% rate kicks in.
              </p>
            )}
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <p>Orders 1–150: <strong>17.76%</strong></p>
              <p>Orders 151+: <strong>12%</strong></p>
            </div>
          </Card>

          <h2 className="mt-10 text-xl font-bold text-eat-ink">Incoming orders</h2>
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-eat-ink">{order.customerName}</p>
                    <p className="text-sm text-eat-muted">Order {order.id}</p>
                    <ul className="mt-2 text-sm text-eat-ink">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.quantity}× {item.name} — {formatMoney(item.price * item.quantity)}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 font-semibold">Subtotal: {formatMoney(order.subtotal)}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-eat-soft px-3 py-1 text-xs font-semibold text-eat-blue">
                      {STATUS_LABELS[order.status]}
                    </span>
                    <div className="mt-3 flex flex-col gap-2">
                      {order.status === "incoming" && (
                        <Button onClick={() => acceptOrder(order.id)}>Accept order</Button>
                      )}
                      {order.status !== "incoming" && order.status !== "completed" && (
                        <Button variant="outline" onClick={() => advanceStatus(order.id)}>
                          Mark {STATUS_LABELS[STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]]}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
