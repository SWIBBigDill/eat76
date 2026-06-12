"use client";

import { CheckoutSavings } from "@/components/order/CheckoutSavings";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SAMPLE_FOOD = 28;
const SAMPLE_TIP = 4;

export function SavingsTeaser() {
  return (
    <section className="eat-section bg-gradient-to-br from-eat-blue/5 via-white to-eat-red/5" id="savings">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-eat-red">
          Real math, no fine print
        </p>
        <SectionHeading
          centered
          className="mt-2"
          title="See what you save"
          subtitle="On a typical $28 order, Eat76 beats the big apps. Same food, fewer fees, no menu markup."
        />
        <div className="mx-auto mt-8 max-w-2xl">
          <CheckoutSavings foodSubtotal={SAMPLE_FOOD} tip={SAMPLE_TIP} />
        </div>
        <p className="mx-auto mt-4 max-w-lg text-center text-xs text-eat-muted">
          Estimate based on typical big-app delivery + service fees and ~15% menu markup. Your savings vary by order size.
        </p>
        <div className="mt-8 text-center">
          <Button href="/order" className="tap-target px-8 shadow-lg shadow-eat-blue/20">
            Start your order
          </Button>
        </div>
      </div>
    </section>
  );
}
