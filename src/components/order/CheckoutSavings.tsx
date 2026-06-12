"use client";

import { calculateCustomerCheckoutComparison } from "@/lib/pricing";

type CheckoutSavingsProps = {
  foodSubtotal: number;
  tip: number;
  compact?: boolean;
};

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export function CheckoutSavings({ foodSubtotal, tip, compact }: CheckoutSavingsProps) {
  if (foodSubtotal <= 0) return null;

  const comparison = calculateCustomerCheckoutComparison({ foodSubtotal, tip });

  return (
    <div
      className={`rounded-2xl border border-eat-blue/20 bg-gradient-to-br from-eat-blue/5 to-eat-red/5 ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-eat-ink">
            You save ~{formatMoney(comparison.savings)} vs typical apps
          </p>
          <p className="mt-0.5 text-xs text-eat-muted">
            Transparent fees. No surprise pile-on.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-eat-red px-2.5 py-1 text-xs font-bold text-white animate-pulse-once">
          −{formatMoney(comparison.savings)}
        </span>
      </div>

      {!compact && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/80 p-3 text-sm">
            <p className="font-semibold text-eat-blue">Eat76</p>
            <ul className="mt-2 space-y-1 text-xs text-eat-muted">
              <li className="flex justify-between">
                <span>Food</span>
                <span>{formatMoney(comparison.eat76.food)}</span>
              </li>
              <li className="flex justify-between">
                <span>Service + delivery</span>
                <span>
                  {formatMoney(
                    comparison.eat76.serviceFee + comparison.eat76.deliveryFee
                  )}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Tip (100% to driver)</span>
                <span>{formatMoney(comparison.eat76.tip)}</span>
              </li>
            </ul>
            <p className="mt-2 flex justify-between border-t border-eat-border pt-2 font-bold text-eat-ink">
              <span>Total</span>
              <span>{formatMoney(comparison.eat76.total)}</span>
            </p>
          </div>

          <div className="rounded-xl bg-white/60 p-3 text-sm">
            <p className="font-semibold text-eat-muted">
              {comparison.competitor.label}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-eat-muted">
              <li className="flex justify-between">
                <span>Food + ~15% markup</span>
                <span>{formatMoney(comparison.competitor.food)}</span>
              </li>
              <li className="flex justify-between">
                <span>Delivery + service</span>
                <span>
                  {formatMoney(
                    comparison.competitor.deliveryFee +
                      comparison.competitor.serviceFee
                  )}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Tip</span>
                <span>{formatMoney(comparison.competitor.tip)}</span>
              </li>
            </ul>
            <p className="mt-2 flex justify-between border-t border-eat-border pt-2 font-bold text-eat-muted">
              <span>Est. total</span>
              <span>{formatMoney(comparison.competitor.total)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function getCheckoutSavingsAmount(foodSubtotal: number, tip: number) {
  return calculateCustomerCheckoutComparison({ foodSubtotal, tip }).savings;
}
