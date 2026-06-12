"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { calculateAdminProjections } from "@/lib/pricing";
import { defaultProjectionInputs } from "@/data/projections";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function AdminProjectionsCalculator() {
  const [activeRestaurants, setActiveRestaurants] = useState(
    defaultProjectionInputs.activeRestaurants
  );
  const [ordersPerRestaurantPerDay, setOrdersPerRestaurantPerDay] = useState(
    defaultProjectionInputs.ordersPerRestaurantPerDay
  );
  const [averageOrderValue, setAverageOrderValue] = useState(
    defaultProjectionInputs.averageOrderValue
  );
  const [monthNumber, setMonthNumber] = useState(
    defaultProjectionInputs.monthNumber
  );

  const results = useMemo(
    () =>
      calculateAdminProjections({
        activeRestaurants,
        ordersPerRestaurantPerDay,
        averageOrderValue,
        monthNumber,
      }),
    [activeRestaurants, ordersPerRestaurantPerDay, averageOrderValue, monthNumber]
  );

  const revenueBreakdown = [
    { label: "Restaurant platform", value: results.restaurantPlatformRevenue },
    { label: "Customer service fees", value: results.customerFeeRevenue },
    { label: "Delivery fees", value: results.deliveryFeeRevenue },
  ];

  return (
    <Card padding="lg">
      <h3 className="text-xl font-bold text-eat-ink">Projections calculator</h3>
      <p className="mt-2 text-sm text-eat-muted">
        Model monthly volume, GMV, and contribution before overhead. Tips pass through to drivers.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Active restaurants"
          type="number"
          min={1}
          value={activeRestaurants}
          onChange={(e) => setActiveRestaurants(Number(e.target.value))}
        />
        <Input
          label="Orders per restaurant / day"
          type="number"
          min={0}
          step={0.5}
          value={ordersPerRestaurantPerDay}
          onChange={(e) => setOrdersPerRestaurantPerDay(Number(e.target.value))}
        />
        <Input
          label="Average order value ($)"
          type="number"
          min={1}
          value={averageOrderValue}
          onChange={(e) => setAverageOrderValue(Number(e.target.value))}
        />
        <Input
          label="Month number (1-12)"
          type="number"
          min={1}
          max={12}
          value={monthNumber}
          onChange={(e) => setMonthNumber(Number(e.target.value))}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Monthly orders", value: formatNumber(results.monthlyOrders) },
          { label: "Monthly food GMV", value: formatMoney(results.monthlyFoodGmv) },
          { label: "Gross platform revenue", value: formatMoney(results.grossPlatformRevenue) },
          { label: "Est. contribution", value: formatMoney(results.estimatedContribution), accent: true },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl p-4 ${item.accent ? "border-2 border-eat-blue/20 bg-white" : "bg-eat-soft"}`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-eat-muted">
              {item.label}
            </p>
            <p className={`mt-1 text-xl font-bold ${item.accent ? "text-eat-blue" : "text-eat-ink"}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h4 className="font-semibold text-eat-ink">Revenue breakdown</h4>
          {revenueBreakdown.map((item) => (
            <ProgressBar
              key={item.label}
              label={`${item.label}: ${formatMoney(item.value)}`}
              value={item.value}
              max={results.grossPlatformRevenue}
              color="blue"
            />
          ))}
        </div>
        <div className="space-y-3 rounded-2xl bg-eat-soft p-5">
          <div className="flex justify-between text-sm">
            <span className="text-eat-muted">Days in month</span>
            <span className="font-semibold">{results.daysInMonth}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-eat-muted">Orders per restaurant / month</span>
            <span className="font-semibold">{formatNumber(results.ordersPerRestaurantMonth)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-eat-muted">Restaurant platform revenue</span>
            <span className="font-semibold">{formatMoney(results.restaurantPlatformRevenue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-eat-muted">Driver payouts (base)</span>
            <span className="font-semibold">{formatMoney(results.driverPayouts)}</span>
          </div>
          <div className="border-t border-eat-border pt-3 flex justify-between text-sm">
            <span className="font-medium text-eat-ink">Contribution before overhead</span>
            <span className="font-bold text-eat-red">{formatMoney(results.estimatedContribution)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
