import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function PricingPage() {
  return (
    <PageShell>
      <section className="eat-section bg-gradient-to-b from-eat-soft to-white">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            centered
            title="Transparent pricing"
            subtitle="No mystery fees. Everyone sees the numbers — restaurants, drivers, and customers."
          />
        </div>
      </section>

      <section className="eat-section">
        <div className="mx-auto max-w-6xl px-4 grid gap-6 lg:grid-cols-3">
          <Card padding="lg">
            <h3 className="text-lg font-bold text-eat-blue">Restaurants</h3>
            <ul className="mt-4 space-y-2 text-sm text-eat-ink">
              <li>No monthly fee during launch</li>
              <li>17.76% platform fee — orders 1–150 / month</li>
              <li>12% platform fee — orders 151+ / month</li>
              <li>Optional $76/mo premium only with added services</li>
            </ul>
            <Button href="/restaurants" className="mt-6 w-full" variant="outline">
              Restaurant details
            </Button>
          </Card>

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

          <Card padding="lg">
            <h3 className="text-lg font-bold text-eat-ink">Customers</h3>
            <ul className="mt-4 space-y-2 text-sm text-eat-ink">
              <li>$1.76 flat service fee</li>
              <li>$4.76 delivery fee (core zone)</li>
              <li>Tips: 100% to your driver</li>
              <li>No hidden fees at checkout</li>
            </ul>
            <Button href="/order" className="mt-6 w-full">
              Order Local
            </Button>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
