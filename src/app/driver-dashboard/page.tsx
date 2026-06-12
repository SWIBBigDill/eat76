"use client";

import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { MockLoginBanner } from "@/components/ui/MockLoginBanner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { initialDeliveries } from "@/data/drivers";
import { googleMapsDirectionsUrl } from "@/lib/driver-location";
import { driverStatusToTrack } from "@/lib/order-tracking";
import type { DriverDelivery, DriverDeliveryStatus } from "@/lib/types";

const STATUS_LABELS: Record<DriverDeliveryStatus, string> = {
  available: "Available",
  claimed: "Claimed",
  picked_up: "Picked up",
  delivered: "Delivered",
};

const NEXT_ACTION: Partial<Record<DriverDeliveryStatus, { label: string; next: DriverDeliveryStatus }>> = {
  available: { label: "Claim delivery", next: "claimed" },
  claimed: { label: "Mark picked up", next: "picked_up" },
  picked_up: { label: "Mark delivered", next: "delivered" },
};

const MAP_BBOX = "-75.715,39.844,-75.702,39.851";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function patchOrderStatus(orderId: string, driverStatus: DriverDeliveryStatus) {
  const trackStatus = driverStatusToTrack(driverStatus);
  void fetch(`/api/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: trackStatus }),
  }).catch(() => undefined);
}

export default function DriverDashboardPage() {
  const [online, setOnline] = useState(true);
  const [deliveries, setDeliveries] = useState<DriverDelivery[]>(initialDeliveries);
  const [earningsTick, setEarningsTick] = useState(0);

  const active = deliveries.filter((d) => d.status !== "delivered");
  const completed = deliveries.filter((d) => d.status === "delivered");
  const activeDelivery = active.find((d) => d.status === "claimed" || d.status === "picked_up");

  const earningsToday = deliveries
    .filter((d) => d.status === "delivered" || d.status === "picked_up" || d.status === "claimed")
    .reduce((sum, d) => sum + d.basePay + (d.status === "delivered" ? d.tip : 0), 0);

  const completedEarnings = completed.reduce((sum, d) => sum + d.basePay + d.tip, 0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setEarningsTick((t) => t + 1);
    }, 8000);
    return () => window.clearInterval(interval);
  }, []);

  const displayEarnings = earningsToday + (online ? earningsTick * 0.12 : 0);

  const advanceDelivery = useCallback((id: string) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const action = NEXT_ACTION[d.status];
        if (!action) return d;
        patchOrderStatus(d.orderId, action.next);
        return { ...d, status: action.next };
      })
    );
  }, []);

  return (
    <PageShell>
      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-eat-ink">Driver Dashboard</h1>
              <p className="mt-2 text-eat-muted">Chris P. · ZIP 19348</p>
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
                {formatMoney(displayEarnings)}
              </p>
              <p className="mt-1 text-xs text-eat-muted">
                {completed.length} completed · {active.length} active
                {online && " · live ticker"}
              </p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-wide text-eat-muted">Completed payouts</p>
              <p className="mt-1 text-2xl font-bold text-eat-blue">{formatMoney(completedEarnings)}</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-wide text-eat-muted">Available runs</p>
              <p className="mt-1 text-2xl font-bold text-eat-ink">
                {online ? deliveries.filter((d) => d.status === "available").length : 0}
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
                {activeDelivery.restaurantName} → {activeDelivery.customerAddress}
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
                  href={googleMapsDirectionsUrl(activeDelivery.customerAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-eat-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-eat-blue-dark tap-target"
                >
                  Navigate in Google Maps
                </a>
                {NEXT_ACTION[activeDelivery.status] && (
                  <Button
                    variant="accent"
                    onClick={() => advanceDelivery(activeDelivery.id)}
                  >
                    {NEXT_ACTION[activeDelivery.status]!.label}
                  </Button>
                )}
              </div>
            </Card>
          )}

          <h2 className="mt-10 text-xl font-bold text-eat-ink">Available deliveries</h2>
          <div className="mt-4 space-y-4">
            {!online ? (
              <Card>
                <p className="text-eat-muted">You are offline. Tap Go online to accept deliveries.</p>
              </Card>
            ) : active.filter((d) => d.id !== activeDelivery?.id).length === 0 ? (
              <Card>
                <p className="text-eat-muted">No other active deliveries. Check back soon.</p>
              </Card>
            ) : (
              active
                .filter((d) => d.id !== activeDelivery?.id)
                .map((delivery) => {
                  const totalPayout = delivery.basePay + delivery.tip;
                  const action = NEXT_ACTION[delivery.status];

                  return (
                    <Card key={delivery.id}>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-eat-ink">{delivery.restaurantName}</p>
                          <p className="text-sm text-eat-muted">{delivery.customerAddress}</p>
                          <p className="mt-1 text-sm text-eat-muted">{delivery.distance}</p>
                          <span className="mt-2 inline-block rounded-full bg-eat-soft px-3 py-1 text-xs font-semibold text-eat-blue">
                            {STATUS_LABELS[delivery.status]}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-eat-muted">Payout estimate</p>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex justify-between gap-6">
                              <span className="text-eat-muted">Base pay</span>
                              <span>{formatMoney(delivery.basePay)}</span>
                            </div>
                            <div className="flex justify-between gap-6">
                              <span className="text-eat-muted">Tip</span>
                              <span>{formatMoney(delivery.tip)}</span>
                            </div>
                            <div className="flex justify-between gap-6 border-t border-eat-border pt-1 font-bold">
                              <span>Total</span>
                              <span className="text-eat-red">{formatMoney(totalPayout)}</span>
                            </div>
                          </div>
                          {action && (
                            <Button
                              variant={delivery.status === "available" ? "accent" : "primary"}
                              className="mt-4"
                              onClick={() => advanceDelivery(delivery.id)}
                            >
                              {action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
            )}
          </div>

          {completed.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-bold text-eat-ink">Completed today</h2>
              <div className="mt-4 space-y-2">
                {completed.map((d) => (
                  <Card key={d.id} padding="sm" className="opacity-70">
                    <p className="text-sm">
                      {d.restaurantName} · {formatMoney(d.basePay + d.tip)} earned
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
