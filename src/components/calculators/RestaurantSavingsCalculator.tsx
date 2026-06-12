"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { calculateRestaurantSavings } from "@/lib/pricing";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function RestaurantSavingsCalculator() {
  const [averageOrderValue, setAverageOrderValue] = useState(36);
  const [monthlyOrders, setMonthlyOrders] = useState(150);
  const [competitorRate, setCompetitorRate] = useState(25);

  const results = useMemo(
    () =>
      calculateRestaurantSavings({
        averageOrderValue,
        monthlyOrders,
        competitorRate,
      }),
    [averageOrderValue, monthlyOrders, competitorRate]
  );

  return (
    <Card padding="lg">
      <h3 className="text-xl font-bold text-eat-ink">Restaurant savings calculator</h3>
      <p className="mt-2 text-sm text-eat-muted">
        See how Eat76&apos;s tiered pricing compares to typical marketplace fees.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Input
          label="Average order value ($)"
          type="number"
          min={1}
          value={averageOrderValue}
          onChange={(e) => setAverageOrderValue(Number(e.target.value))}
        />
        <Input
          label="Monthly delivery orders"
          type="number"
          min={0}
          value={monthlyOrders}
          onChange={(e) => setMonthlyOrders(Number(e.target.value))}
        />
        <Input
          label="Current app commission (%)"
          type="number"
          min={0}
          max={100}
          value={competitorRate}
          onChange={(e) => setCompetitorRate(Number(e.target.value))}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-eat-soft p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-eat-muted">
            Current app fees
          </p>
          <p className="mt-1 text-2xl font-bold text-eat-ink">
            {formatMoney(results.competitorFees)}
          </p>
        </div>
        <div className="rounded-2xl bg-eat-soft p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-eat-muted">
            Eat76 fees
          </p>
          <p className="mt-1 text-2xl font-bold text-eat-blue">
            {formatMoney(results.eat76Fees)}
          </p>
          <p className="mt-1 text-xs text-eat-muted">
            {results.currentTier === "tier1"
              ? "17.76% on all orders"
              : "17.76% on first 150, 12% after"}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-eat-red/20 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-eat-muted">
            Estimated monthly savings
          </p>
          <p className="mt-1 text-2xl font-bold text-eat-red">
            {formatMoney(Math.max(0, results.monthlySavings))}
          </p>
        </div>
      </div>
    </Card>
  );
}
