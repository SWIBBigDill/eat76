"use client";

import { useState } from "react";
import { CheckoutSavings } from "@/components/order/CheckoutSavings";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

type PricingTab = "customer" | "restaurant" | "driver";

const tabs: { id: PricingTab; label: string }[] = [
  { id: "customer", label: "Customers" },
  { id: "restaurant", label: "Restaurants" },
  { id: "driver", label: "Drivers" },
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<PricingTab>("customer");

  return (
    <PageShell className="pb-20 md:pb-0">
      <section className="eat-section bg-gradient-to-b from-eat-soft to-white">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            centered
            title="Transparent pricing"
            subtitle="No mystery fees. Customers see every charge upfront — partners get honest rates too."
          />
        </div>
      </section>

      <section className="eat-section pt-0">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`tap-target rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-eat-blue text-white shadow-sm"
                    : "border border-eat-border bg-white text-eat-muted hover:border-eat-blue/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8 animate-fade-in">
            {activeTab === "customer" && (
              <div className="mx-auto max-w-2xl space-y-6">
                <Card padding="lg">
                  <h3 className="text-lg font-bold text-eat-ink">What you pay at checkout</h3>
                  <ul className="mt-4 space-y-3 text-sm text-eat-ink">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 font-bold text-eat-blue">$1.76</span>
                      <div>
                        <p className="font-semibold">Flat service fee</p>
                        <p className="text-eat-muted">Same on every order — no percentage surprises.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 font-bold text-eat-blue">$4.76</span>
                      <div>
                        <p className="font-semibold">Delivery fee (core zone)</p>
                        <p className="text-eat-muted">19348 launch zone. Shown before you pay.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 font-bold text-eat-red">100%</span>
                      <div>
                        <p className="font-semibold">Tips go to your driver</p>
                        <p className="text-eat-muted">Every dollar you tip stays with the person who delivered.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 font-bold text-eat-ink">$0</span>
                      <div>
                        <p className="font-semibold">Hidden fees</p>
                        <p className="text-eat-muted">No inflated menu prices. No stacked service charges.</p>
                      </div>
                    </li>
                  </ul>
                  <Button href="/order" className="mt-6 w-full">
                    Order Now
                  </Button>
                </Card>
                <CheckoutSavings foodSubtotal={28} tip={4} />
              </div>
            )}

            {activeTab === "restaurant" && (
              <div className="mx-auto max-w-lg">
                <Card padding="lg">
                  <h3 className="text-lg font-bold text-eat-blue">Restaurant partners</h3>
                  <ul className="mt-4 space-y-2 text-sm text-eat-ink">
                    <li>No monthly fee during launch</li>
                    <li>17.76% platform fee — orders 1–150 / month</li>
                    <li>12% platform fee — orders 151+ / month</li>
                    <li>Optional $76/mo premium only with added services</li>
                  </ul>
                  <Button href="/restaurants" className="mt-6 w-full" variant="outline">
                    Restaurant partner details
                  </Button>
                </Card>
              </div>
            )}

            {activeTab === "driver" && (
              <div className="mx-auto max-w-lg">
                <Card padding="lg">
                  <h3 className="text-lg font-bold text-eat-red">Drivers</h3>
                  <ul className="mt-4 space-y-2 text-sm text-eat-ink">
                    <li>$6.76 minimum base delivery pay</li>
                    <li>100% of customer tips</li>
                    <li>Bonuses for peak, catering, distance</li>
                    <li>Local routes in 19348 core zone</li>
                  </ul>
                  <Button href="/drivers" className="mt-6 w-full" variant="outline">
                    Drive with Eat76
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
