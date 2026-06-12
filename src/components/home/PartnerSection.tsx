"use client";

import { useState } from "react";
import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

type PartnerTab = "customer" | "restaurant" | "driver";

const tabs: { id: PartnerTab; label: string }[] = [
  { id: "customer", label: "Customer waitlist" },
  { id: "restaurant", label: "Own a restaurant?" },
  { id: "driver", label: "Drive with us" },
];

export function PartnerSection() {
  const [activeTab, setActiveTab] = useState<PartnerTab>("customer");

  return (
    <section className="eat-section bg-eat-soft" id="early-access">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          centered
          title="Get early access"
          subtitle="Join the customer waitlist first. We'll reach out when Eat76 goes live in your ZIP."
        />

        <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`tap-target rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-eat-blue text-white shadow-sm"
                  : "border border-eat-border bg-white text-eat-muted hover:border-eat-blue/40 hover:text-eat-blue"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-lg animate-fade-in">
          {activeTab === "customer" && (
            <EarlyAccessForm
              type="customer"
              title="Join the customer waitlist"
              description="Be first to order local when Eat76 launches in 19348."
            />
          )}
          {activeTab === "restaurant" && (
            <EarlyAccessForm
              type="restaurant"
              title="Partner with Eat76"
              description="Tell us about your restaurant. Lower fees, local support, no monthly charge at launch."
            />
          )}
          {activeTab === "driver" && (
            <EarlyAccessForm
              type="driver"
              title="Apply to drive"
              description="Local routes, $6.76 base pay, 100% of tips. Built for 19348 first."
            />
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
          <Button href="/restaurants" variant="ghost" className="text-eat-muted">
            Restaurant partner details →
          </Button>
          <Button href="/drivers" variant="ghost" className="text-eat-muted">
            Driver partner details →
          </Button>
        </div>
      </div>
    </section>
  );
}
