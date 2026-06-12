"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { MockLoginBanner } from "@/components/ui/MockLoginBanner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { initialDeliveries } from "@/data/drivers";
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

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function DriverDashboardPage() {
  const [deliveries, setDeliveries] = useState<DriverDelivery[]>(initialDeliveries);

  const active = deliveries.filter((d) => d.status !== "delivered");
  const completed = deliveries.filter((d) => d.status === "delivered");

  const earningsToday = useMemo(() => {
    return deliveries
      .filter((d) => d.status === "delivered" || d.status === "picked_up" || d.status === "claimed")
      .reduce((sum, d) => sum + d.basePay + (d.status === "delivered" ? d.tip : 0), 0);
  }, [deliveries]);

  const completedEarnings = useMemo(() => {
    return completed.reduce((sum, d) => sum + d.basePay + d.tip, 0);
  }, [completed]);

  const advanceDelivery = (id: string) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const action = NEXT_ACTION[d.status];
        if (!action) return d;
        return { ...d, status: action.next };
      })
    );
  };

  return (
    <PageShell>
      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold text-eat-ink">Driver Dashboard</h1>
          <p className="mt-2 text-eat-muted">Chris P. · ZIP 19348</p>
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
              <p className="mt-1 text-2xl font-bold text-eat-red">{formatMoney(earningsToday)}</p>
              <p className="mt-1 text-xs text-eat-muted">
                {completed.length} completed · {active.length} active
              </p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-wide text-eat-muted">Completed payouts</p>
              <p className="mt-1 text-2xl font-bold text-eat-blue">{formatMoney(completedEarnings)}</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-wide text-eat-muted">Available runs</p>
              <p className="mt-1 text-2xl font-bold text-eat-ink">
                {deliveries.filter((d) => d.status === "available").length}
              </p>
            </Card>
          </div>

          <h2 className="mt-10 text-xl font-bold text-eat-ink">Available deliveries</h2>
          <div className="mt-4 space-y-4">
            {active.length === 0 ? (
              <Card>
                <p className="text-eat-muted">No active deliveries. Check back soon.</p>
              </Card>
            ) : (
              active.map((delivery) => {
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
                      {d.restaurantName} → {formatMoney(d.basePay + d.tip)} earned
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
