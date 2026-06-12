"use client";

import { AdminProjectionsCalculator } from "@/components/calculators/AdminProjectionsCalculator";
import { PageShell } from "@/components/layout/PageShell";
import { MockLoginBanner } from "@/components/ui/MockLoginBanner";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { computeAdminStats } from "@/data/admin-stats";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function AdminPage() {
  const stats = computeAdminStats();

  const revenueItems = [
    { label: "Platform revenue", value: stats.platformRevenue },
    { label: "Driver payouts", value: stats.driverPayouts },
    { label: "Contribution", value: stats.estimatedContribution },
  ];

  return (
    <PageShell>
      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold text-eat-ink">Admin Dashboard</h1>
          <p className="mt-2 text-eat-muted">
            Win 19348 first. {stats.totalRestaurantsListed} restaurants listed · {stats.activeRestaurants} onboarded.
          </p>
          <div className="mt-4">
            <MockLoginBanner role="admin" />
          </div>
        </div>
      </section>

      <section className="eat-section pt-0">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Active restaurants", value: stats.activeRestaurants },
              { label: "Active drivers", value: stats.activeDrivers },
              { label: "Orders today", value: stats.ordersToday },
              { label: "Monthly GMV", value: formatMoney(stats.monthlyGmv) },
            ].map((stat) => (
              <Card key={stat.label}>
                <p className="text-xs uppercase tracking-wide text-eat-muted">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-eat-blue">{stat.value}</p>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card padding="lg">
              <h3 className="font-bold text-eat-ink">Financial overview (computed)</h3>
              <p className="mt-1 text-xs text-eat-muted">
                Based on {stats.ordersToday} demo orders today × 22 active days, $34 AOV
              </p>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-eat-muted">Platform revenue</span>
                  <span className="font-semibold">{formatMoney(stats.platformRevenue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-eat-muted">Driver payouts</span>
                  <span className="font-semibold">{formatMoney(stats.driverPayouts)}</span>
                </div>
                <div className="flex justify-between border-t border-eat-border pt-3 text-sm">
                  <span className="font-medium text-eat-ink">Est. contribution before overhead</span>
                  <span className="font-bold text-eat-red">{formatMoney(stats.estimatedContribution)}</span>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="font-bold text-eat-ink">Revenue vs payouts</h3>
              <div className="mt-4 space-y-4">
                {revenueItems.map((item) => (
                  <ProgressBar
                    key={item.label}
                    label={`${item.label} — ${formatMoney(item.value)}`}
                    value={item.value}
                    max={stats.platformRevenue}
                    color={item.label === "Contribution" ? "red" : "blue"}
                  />
                ))}
              </div>
              <p className="mt-4 text-xs text-eat-muted">
                Tips pass through to drivers and are not counted as Eat76 revenue.
              </p>
            </Card>
          </div>

          <div className="mt-10">
            <AdminProjectionsCalculator />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
