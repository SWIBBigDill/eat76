import { RestaurantSavingsCalculator } from "@/components/calculators/RestaurantSavingsCalculator";
import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";
import { OrderBanner } from "@/components/home/OrderBanner";
import { PageShell } from "@/components/layout/PageShell";
import { StripeConnectOnboardButton } from "@/components/stripe/StripeConnectOnboardButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { restaurantFaqs } from "@/data/faqs";

export default function RestaurantsPage() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <OrderBanner />
      <section className="eat-section bg-gradient-to-b from-eat-soft to-white !py-8 md:!py-12">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-eat-muted">
            Partner with Eat76
          </p>
          <SectionHeading
            title="Keep more of every order"
            subtitle="Own your customers. Work with a local delivery partner that actually knows 19348."
          />
          <p className="mt-4 max-w-3xl text-sm text-eat-muted">
            During launch, restaurants pay only when orders come in — 17.76% for the first 150 monthly orders, then 12% after that.
          </p>
        </div>
      </section>

      <section className="eat-section">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card padding="lg">
              <h3 className="text-xl font-bold text-eat-ink">Launch pricing</h3>
              <ul className="mt-6 space-y-4">
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-eat-blue text-sm font-bold text-white">$0</span>
                  <div>
                    <p className="font-semibold text-eat-ink">No monthly fee during launch</p>
                    <p className="text-sm text-eat-muted">Pay only when orders come in.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-eat-red text-sm font-bold text-white">%</span>
                  <div>
                    <p className="font-semibold text-eat-ink">17.76% on orders 1–150 / month</p>
                    <p className="text-sm text-eat-muted">Platform fee on food sales for your first 150 delivery orders each month.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-eat-blue text-sm font-bold text-white">↓</span>
                  <div>
                    <p className="font-semibold text-eat-ink">12% on orders 151+ / month</p>
                    <p className="text-sm text-eat-muted">Volume reward — your rate drops for the rest of the month.</p>
                  </div>
                </li>
              </ul>
            </Card>

            <Card padding="lg" className="border-eat-blue/20">
              <h3 className="text-xl font-bold text-eat-ink">Optional future premium</h3>
              <p className="mt-4 text-sm text-eat-muted leading-relaxed">
                A $76/month premium plan may be offered later — only if it includes real added services like marketing support, menu management, featured placement, catering tools, or analytics. It will never be required just to receive orders.
              </p>
              <p className="mt-4 text-sm font-medium text-eat-blue">
                No monthly fee during launch. Pay only when orders come in.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <RestaurantSavingsCalculator />
        </div>
      </section>

      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading centered title="Restaurant FAQ" />
          <FaqAccordion items={restaurantFaqs} className="mt-8" />
        </div>
      </section>

      <section className="eat-section">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                title="Built with restaurants"
                subtitle="Freedom from the big food delivery apps. Independent restaurant owned. Better transparency. Local drivers loyal to the market."
              />
              <div className="mt-6 flex flex-wrap items-start gap-3">
                <Button href="/restaurant-dashboard">Restaurant Dashboard Demo</Button>
                <Button href="/pricing" variant="outline">View all pricing</Button>
                <StripeConnectOnboardButton />
              </div>
            </div>
            <EarlyAccessForm type="restaurant" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
