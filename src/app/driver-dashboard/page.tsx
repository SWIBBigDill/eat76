"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { MockLoginBanner } from "@/components/ui/MockLoginBanner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { googleMapsDirectionsUrl } from "@/lib/driver-location";
import type { OrderTrackStatus } from "@/lib/order-tracking";
import type { StoredOrder } from "@/lib/store/orders";

const DRIVER_NAME = "Chris P.";
const DRIVER_VEHICLE = "Blue Honda Civic";
const BASE_PAY = 4.76;

const STATUS_LABELS: Record<string, string> = {
  restaurant_confirmed: "Being prepared",
  preparing: "Being prepared",
  ready: "Ready for pickup",
  driver_picked_up: "Picked up",
  on_the_way: "On the way",
  delivered: "Delivered",
};

const NEXT_ACTION: Partial<
  Record<string, { label: string; next: OrderTrackStatus }>
> = {
  ready: { label: "Pick up order", next: "driver_picked_up" },
  driver_picked_up: { label: "Start delivery", next: "on_the_way" },
  on_the_way: { label: "Mark delivered", next: "delivered" },
};

const MAP_BBOX = "-75.715,39.844,-75.702,39.851";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function DriverDashboardPage() {
  const [online, setOnline] = useState(true);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [delivered, setDelivered] = useState<StoredOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/orders?active=1", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { orders?: StoredOrder[] };
        if (Array.isArray(data.orders)) setOrders(data.orders);
      }
    } catch {
      /* keep last known state */
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

  const advance = useCallback(
    async (order: StoredOrder, next: OrderTrackStatus) => {
      if (next === "delivered") {
        setDelivered((prev) =>
          prev.some((d) => d.id === order.id) ? prev : [...prev, order]
        );
        setOrders((prev) => prev.filter((o) => o.id !== order.id));
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))
        );
      }
      try {
        await fetch(`/api/orders/${order.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: next,
            driver: {
              id: "driver-chris",
              name: DRIVER_NAME,
              vehicle: DRIVER_VEHICLE,
              initials: "CP",
            },
          }),
        });
      } catch {
        /* next poll will resync */
      }
    },
    []
  );

  const pickupQueue = orders.filter((o) => o.status === "ready");
  const inProgress = orders.filter(
    (o) => o.status === "driver_picked_up" || o.status === "on_the_way"
  );
  const upcoming = orders.filter(
    (o) => o.status === "restaurant_confirmed" || o.status === "preparing"
  );
  const activeDelivery = inProgress[0];

  const earningsToday = delivered.reduce(
    (sum, o) => sum + BASE_PAY + o.tip,
    0
  );

  return (
    <PageShell>
      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-eat-ink">Driver Dashboard</h1>
              <p className="mt-2 text-eat-muted">{DRIVER_NAME} · ZIP 19348</p>
            </div>
            <button
              type="button"
              onClick={() => setOnline((o) => !o)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition tap-target ${
                online
                  ? "bg-eat-blue text-white"
                  : "border border-eat-border bg-white text-eat-muted"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${online ? "bg-green-400 animate-pulse" : "bg-eat-border"}`}
              />
              {online ? "Online" : "Go online"}
            </button>
          </div>
          <div className="mt-4">
            <MockLoginBanner role="driver" />
          </div>
        </div>
      </section>

      <section className="eat-section pt-0">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-xs uppercase tracking-wide text-eat-muted">Earnings today</p>
              <p className="mt-1 text-2xl font-bold text-eat-red tabular-nums">
                {formatMoney(earningsToday)}
              </p>
              <p className="mt-1 text-xs text-eat-muted">
                {delivered.length} delivered · {inProgress.length} in progress
              </p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-wide text-eat-muted">Base pay per run</p>
              <p className="mt-1 text-2xl font-bold text-eat-blue">{formatMoney(BASE_PAY)}</p>
              <p className="mt-1 text-xs text-eat-muted">Plus 100% of tips</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-wide text-eat-muted">Ready for pickup</p>
              <p className="mt-1 text-2xl font-bold text-eat-ink">
                {online ? pickupQueue.length : 0}
              </p>
              {!online && (
                <p className="mt-1 text-xs text-eat-muted">Go online to see deliveries</p>
              )}
            </Card>
          </div>

          {activeDelivery && online && (
            <Card className="mt-6 overflow-hidden">
              <p className="font-bold text-eat-ink">Active delivery</p>
              <p className="text-sm text-eat-muted">
                {activeDelivery.restaurantName} → {activeDelivery.deliveryAddress}
              </p>
              <div className="relative mt-4 aspect-[21/9] overflow-hidden rounded-xl bg-eat-soft">
                <iframe
                  title="Active delivery map"
                  className="absolute inset-0 h-full w-full border-0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik`}
                  loading="lazy"
                />
                <div className="absolute left-1/2 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-eat-blue text-xs font-bold text-white shadow-lg ring-4 ring-white">
                  CP
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={googleMapsDirectionsUrl(activeDelivery.deliveryAddress ?? "Kennett Square, PA")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-eat-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-eat-blue-dark tap-target"
                >
                  Navigate in Google Maps
                </a>
                {NEXT_ACTION[activeDelivery.status] && (
                  <Button
                    variant="accent"
                    onClick={() =>
                      void advance(activeDelivery, NEXT_ACTION[activeDelivery.status]!.next)
                    }
                  >
                    {NEXT_ACTION[activeDelivery.status]!.label}
                  </Button>
                )}
              </div>
            </Card>
          )}

          <div className="mt-10 flex items-center gap-3">
            <h2 className="text-xl font-bold text-eat-ink">Available deliveries</h2>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-eat-muted">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="mt-4 space-y-4">
            {!online ? (
              <Card>
                <p className="text-eat-muted">You are offline. Tap Go online to accept deliveries.</p>
              </Card>
            ) : !loaded ? (
              <Card>
                <p className="text-eat-muted">Loading deliveries...</p>
              </Card>
            ) : pickupQueue.length === 0 &&
              upcoming.length === 0 &&
              inProgress.filter((o) => o.id !== activeDelivery?.id).length === 0 ? (
              <Card>
                <p className="text-eat-muted">
                  No deliveries right now. When a restaurant marks an order ready, it shows up
                  here.
                </p>
              </Card>
            ) : (
              [...pickupQueue, ...inProgress.filter((o) => o.id !== activeDelivery?.id), ...upcoming].map(
                (order) => {
                  const totalPayout = BASE_PAY + order.tip;
                  const action = NEXT_ACTION[order.status];

                  return (
                    <Card key={order.id}>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-eat-ink">{order.restaurantName}</p>
                          <p className="text-sm text-eat-muted">{order.deliveryAddress}</p>
                          <p className="mt-1 text-sm text-eat-muted">
                            {order.items.length > 0
                              ? `${order.items.reduce((n, i) => n + i.quantity, 0)} items`
                              : `Order ${order.id}`}
                          </p>
                          <span className="mt-2 inline-block rounded-full bg-eat-soft px-3 py-1 text-xs font-semibold text-eat-blue">
                            {STATUS_LABELS[order.status] ?? order.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-eat-muted">Payout estimate</p>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex justify-between gap-6">
                              <span className="text-eat-muted">Base pay</span>
                              <span>{formatMoney(BASE_PAY)}</span>
                            </div>
                            <div className="flex justify-between gap-6">
                              <span className="text-eat-muted">Tip</span>
                              <span>{formatMoney(order.tip)}</span>
                            </div>
                            <div className="flex justify-between gap-6 border-t border-eat-border pt-1 font-bold">
                              <span>Total</span>
                              <span className="text-eat-red">{formatMoney(totalPayout)}</span>
                            </div>
                          </div>
                          {action && (
                            <Button
                              variant={order.status === "ready" ? "accent" : "primary"}
                              className="mt-4"
                              onClick={() => void advance(order, action.next)}
                            >
                              {action.label}
                            </Button>
                          )}
                          {!action && (
                            <p className="mt-4 text-xs text-eat-muted">
                              Restaurant is still preparing
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                }
              )
            )}
          </div>

          {delivered.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-bold text-eat-ink">Completed today</h2>
              <div className="mt-4 space-y-2">
                {delivered.map((d) => (
                  <Card key={d.id} padding="sm" className="opacity-70">
                    <p className="text-sm">
                      {d.restaurantName} · {formatMoney(BASE_PAY + d.tip)} earned
                    </p>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
