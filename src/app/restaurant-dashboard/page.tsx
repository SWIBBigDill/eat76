"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { MockLoginBanner } from "@/components/ui/MockLoginBanner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { restaurants } from "@/data/restaurants";
import type { OrderTrackStatus } from "@/lib/order-tracking";
import {
  calculateRestaurantPlatformFee,
  DEFAULT_COMPETITOR_RATE,
  getRestaurantPricingTier,
  RESTAURANT_TIER1_LIMIT,
} from "@/lib/pricing";
import type { StoredOrder } from "@/lib/store/orders";

const DEMO_RESTAURANT_ID = "portabellos";

const STATUS_LABELS: Record<string, string> = {
  placed: "Incoming",
  restaurant_confirmed: "Accepted",
  preparing: "Preparing",
  ready: "Ready for pickup",
  driver_picked_up: "With driver",
  on_the_way: "With driver",
  delivered: "Completed",
  cancelled: "Cancelled",
};

const NEXT_ACTION: Partial<
  Record<string, { label: string; next: OrderTrackStatus }>
> = {
  placed: { label: "Accept order", next: "restaurant_confirmed" },
  restaurant_confirmed: { label: "Mark preparing", next: "preparing" },
  preparing: { label: "Mark ready", next: "ready" },
};

type StatusFilter = "active" | "incoming" | "preparing" | "ready" | "completed" | "all";

const ACTIVE_STATUSES = ["placed", "restaurant_confirmed", "preparing", "ready"];

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function RestaurantDashboardPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [creatingTest, setCreatingTest] = useState(false);

  const restaurant = restaurants.find((r) => r.id === DEMO_RESTAURANT_ID);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders?restaurantId=${DEMO_RESTAURANT_ID}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = (await res.json()) as { orders?: StoredOrder[] };
        if (Array.isArray(data.orders)) setOrders(data.orders);
      }
    } catch {
      /* keep last known orders */
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const interval = window.setInterval(() => void refresh(), 8000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const setStatus = useCallback(
    async (orderId: string, status: OrderTrackStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      } catch {
        /* next poll will resync */
      }
    },
    []
  );

  const createTestOrder = useCallback(async () => {
    setCreatingTest(true);
    const id = `E76-TEST-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      id,
      restaurantId: DEMO_RESTAURANT_ID,
      restaurantName: restaurant?.name ?? "Portabellos",
      customerName: "Test Customer",
      items: [
        {
          lineId: "test-1",
          menuItemId: "test-item",
          name: "Chicken Parmigiana",
          price: 21.0,
          quantity: 1,
        },
        {
          lineId: "test-2",
          menuItemId: "test-item-2",
          name: "Caesar Salad",
          price: 11.5,
          quantity: 1,
        },
      ],
      subtotal: 32.5,
      serviceFee: 1.76,
      deliveryFee: 4.76,
      tip: 5,
      total: 44.02,
      status: "placed",
      placedAt: new Date().toISOString(),
      source: "demo",
    };
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      await refresh();
    } finally {
      setCreatingTest(false);
    }
  }, [refresh, restaurant]);

  const monthlyOrderCount = Math.max(orders.length, 1);
  const avgOrderValue =
    orders.reduce((sum, o) => sum + o.subtotal, 0) / Math.max(orders.length, 1) || 32;
  const monthlySales = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const tier = getRestaurantPricingTier(monthlyOrderCount);
  const eat76Fees = calculateRestaurantPlatformFee(monthlyOrderCount, avgOrderValue);
  const competitorFees = monthlySales * DEFAULT_COMPETITOR_RATE;
  const activeCount = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;

  const filteredOrders = useMemo(() => {
    switch (statusFilter) {
      case "all":
        return orders;
      case "active":
        return orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
      case "incoming":
        return orders.filter((o) => o.status === "placed");
      case "preparing":
        return orders.filter(
          (o) => o.status === "restaurant_confirmed" || o.status === "preparing"
        );
      case "ready":
        return orders.filter((o) => o.status === "ready");
      case "completed":
        return orders.filter(
          (o) =>
            o.status === "delivered" ||
            o.status === "driver_picked_up" ||
            o.status === "on_the_way"
        );
    }
  }, [orders, statusFilter]);

  const filterChips: { id: StatusFilter; label: string }[] = [
    { id: "active", label: "Active" },
    { id: "incoming", label: "Incoming" },
    { id: "preparing", label: "Preparing" },
    { id: "ready", label: "Ready" },
    { id: "completed", label: "Completed" },
    { id: "all", label: "All" },
  ];

  return (
    <PageShell>
      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold text-eat-ink">Restaurant Dashboard</h1>
          <p className="mt-2 text-eat-muted">{restaurant?.name ?? "Portabellos"} · 19348</p>
          <div className="mt-4">
            <MockLoginBanner role="restaurant" />
          </div>
        </div>
      </section>

      <section className="eat-section pt-0">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Active orders", value: activeCount },
              { label: "Total orders", value: orders.length },
              { label: "Sales", value: formatMoney(monthlySales) },
              { label: "Eat76 fees", value: formatMoney(eat76Fees) },
              {
                label: "Est. savings vs 25%",
                value: formatMoney(Math.max(0, competitorFees - eat76Fees)),
                accent: true,
              },
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
              {tier.label}: {monthlyOrderCount} of {RESTAURANT_TIER1_LIMIT} orders in tier 1
            </p>
            <div className="mt-4">
              <ProgressBar
                value={Math.min(monthlyOrderCount, RESTAURANT_TIER1_LIMIT)}
                max={RESTAURANT_TIER1_LIMIT}
                label={`Tier 1 progress (${RESTAURANT_TIER1_LIMIT} orders @ 17.76%)`}
                color="blue"
              />
            </div>
            {tier.ordersUntilTier2 > 0 ? (
              <p className="mt-2 text-sm text-eat-muted">
                {tier.ordersUntilTier2} more orders until 12% rate kicks in.
              </p>
            ) : (
              <p className="mt-2 text-sm font-semibold text-eat-blue">
                Volume tier active. 12% rate for remaining orders this month.
              </p>
            )}
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <p>Orders 1-150: <strong>17.76%</strong></p>
              <p>Orders 151+: <strong>12%</strong></p>
            </div>
          </Card>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-eat-ink">Orders</h2>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-eat-muted">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setStatusFilter(chip.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    statusFilter === chip.id
                      ? "bg-eat-blue text-white"
                      : "border border-eat-border text-eat-muted hover:border-eat-blue/40"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {!loaded ? (
              <Card>
                <p className="text-eat-muted">Loading orders...</p>
              </Card>
            ) : filteredOrders.length === 0 ? (
              <Card>
                <p className="text-eat-muted">
                  {orders.length === 0
                    ? "No orders yet. Orders placed in the app show up here in real time."
                    : "No orders match this filter."}
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => void createTestOrder()}
                  disabled={creatingTest}
                >
                  {creatingTest ? "Creating..." : "Create a test order"}
                </Button>
              </Card>
            ) : (
              filteredOrders.map((order) => {
                const action = NEXT_ACTION[order.status];
                return (
                  <Card key={order.id}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-eat-ink">
                          {order.customerName ?? "Customer"}
                        </p>
                        <p className="text-sm text-eat-muted">Order {order.id}</p>
                        <ul className="mt-2 text-sm text-eat-ink">
                          {order.items.map((item, i) => (
                            <li key={i}>
                              {item.quantity}× {item.name} ·{" "}
                              {formatMoney(item.price * item.quantity)}
                            </li>
                          ))}
                        </ul>
                        {order.notes && (
                          <p className="mt-2 text-sm italic text-eat-muted">
                            Note: {order.notes}
                          </p>
                        )}
                        <p className="mt-2 font-semibold">
                          Subtotal: {formatMoney(order.subtotal)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block rounded-full bg-eat-soft px-3 py-1 text-xs font-semibold text-eat-blue">
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                        <div className="mt-3 flex flex-col gap-2">
                          {action && (
                            <Button
                              variant={order.status === "placed" ? "primary" : "outline"}
                              onClick={() => void setStatus(order.id, action.next)}
                            >
                              {action.label}
                            </Button>
                          )}
                          {order.status === "ready" && (
                            <p className="text-xs text-eat-muted">Waiting for driver pickup</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
