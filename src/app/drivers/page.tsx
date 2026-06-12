import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";
import { OrderBanner } from "@/components/home/OrderBanner";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function DriversPage() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <OrderBanner />
      <section className="eat-section bg-gradient-to-b from-eat-soft to-white !py-8 md:!py-12">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-eat-muted">
            Drive with Eat76
          </p>
          <SectionHeading
            title="Drive local. Earn better. Stay known."
            subtitle="Local routes. Clear pay. 100% of tips. Built around 19348 first."
          />
        </div>
      </section>

      <section className="eat-section">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Local-only zone", text: "19348 first. Better route density, less dead mileage." },
              { title: "100% of tips", text: "Every dollar the customer tips goes to you." },
              { title: "Clear base pay", text: "$6.76 minimum shown before you claim a run." },
              { title: "Local priority", text: "Reliable drivers who know the market get first pick." },
            ].map((item) => (
              <Card key={item.title}>
                <h3 className="font-bold text-eat-blue">{item.title}</h3>
                <p className="mt-2 text-sm text-eat-muted">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading centered title="Sample driver pay" />
          <div className="mt-8 grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            <Card className="text-center">
              <p className="text-xs uppercase tracking-wide text-eat-muted">Base delivery pay</p>
              <p className="mt-2 text-3xl font-bold text-eat-blue">$6.76</p>
              <p className="mt-1 text-sm text-eat-muted">minimum per delivery</p>
            </Card>
            <Card className="text-center">
              <p className="text-xs uppercase tracking-wide text-eat-muted">Customer tip</p>
              <p className="mt-2 text-3xl font-bold text-eat-red">100%</p>
              <p className="mt-1 text-sm text-eat-muted">yours to keep</p>
            </Card>
            <Card className="text-center">
              <p className="text-xs uppercase tracking-wide text-eat-muted">Bonuses</p>
              <p className="mt-2 text-3xl font-bold text-eat-ink">+</p>
              <p className="mt-1 text-sm text-eat-muted">Peak windows, catering, longer zones</p>
            </Card>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-eat-muted">
            Example payout: $6.76 base + $4.00 tip = $10.76 for one delivery. No mystery adjustments.
          </p>
        </div>
      </section>

      <section className="eat-section">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                title="One market at a time"
                subtitle="We're launching in ZIP 19348 — Kennett Square and surrounding area. Local drivers who build density here will have the advantage when we expand."
              />
              <Button href="/driver-dashboard" variant="accent" className="mt-6">
                Driver Dashboard Demo
              </Button>
            </div>
            <EarlyAccessForm type="driver" title="Apply to Drive" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
