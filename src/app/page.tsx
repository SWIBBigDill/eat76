import { LogoMark } from "@/components/brand/LogoMark";
import { EarlyAccessForm } from "@/components/forms/EarlyAccessForm";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function HomePage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="eat-section bg-gradient-to-b from-eat-soft to-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center text-center">
            <LogoMark size={80} className="mb-6" />
            <h1 className="text-4xl font-bold tracking-tight text-eat-blue md:text-5xl">
              Eat76
            </h1>
            <p className="mt-4 text-xl font-semibold text-eat-ink md:text-2xl">
              Freedom from big delivery.
            </p>
            <p className="mt-2 max-w-xl text-lg text-eat-muted">
              Local restaurants. Local drivers. Transparent fees.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button href="/restaurants" variant="primary">
                Join as a Restaurant
              </Button>
              <Button href="/drivers" variant="accent">
                Drive with Eat76
              </Button>
              <Button href="/order" variant="outline">
                Order Local
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Eat76 */}
      <section className="eat-section">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            centered
            title="Why Eat76 exists"
            subtitle="Eat76 is a local-first delivery platform built to give independent restaurants, local drivers, and customers a better option than the big food delivery apps."
          />
        </div>
      </section>

      {/* For Restaurants */}
      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <SectionHeading
              title="For Restaurants"
              subtitle="No monthly fee during launch. Pay only when orders come in. 17.76% on the first 150 monthly orders, then 12% after that."
            />
            <Card>
              <ul className="space-y-3 text-sm text-eat-ink">
                <li className="flex gap-2">
                  <span className="text-eat-red font-bold">✓</span>
                  Keep more of every order
                </li>
                <li className="flex gap-2">
                  <span className="text-eat-red font-bold">✓</span>
                  Own your customer relationships
                </li>
                <li className="flex gap-2">
                  <span className="text-eat-red font-bold">✓</span>
                  Work with a partner that knows 19348
                </li>
                <li className="flex gap-2">
                  <span className="text-eat-red font-bold">✓</span>
                  Simple tiered pricing — no surprises
                </li>
              </ul>
              <Button href="/restaurants" className="mt-6">
                Learn more
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* For Drivers */}
      <section className="eat-section">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <Card className="order-2 lg:order-1">
              <div className="space-y-4">
                <div className="rounded-2xl bg-eat-soft p-4">
                  <p className="text-xs uppercase tracking-wide text-eat-muted">Base pay</p>
                  <p className="text-2xl font-bold text-eat-blue">$6.76</p>
                  <p className="text-sm text-eat-muted">minimum per delivery</p>
                </div>
                <p className="text-sm text-eat-ink">
                  100% of tips. Optional bonuses for peak windows and catering runs.
                </p>
                <Button href="/drivers" variant="accent">
                  Apply to Drive
                </Button>
              </div>
            </Card>
            <SectionHeading
              className="order-1 lg:order-2"
              title="For Drivers"
              subtitle="Local routes. Clear pay. 100% of tips. Built around one market first."
            />
          </div>
        </div>
      </section>

      {/* For Customers */}
      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            centered
            title="For Customers"
            subtitle="No mystery checkout pile-on. Clear delivery fee. Clear service fee. Local restaurants. Local drivers."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            {[
              { label: "Service fee", value: "$1.76 flat" },
              { label: "Delivery fee", value: "$4.76 core zone" },
              { label: "Tips", value: "100% to driver" },
            ].map((item) => (
              <Card key={item.label} className="text-center">
                <p className="text-xs uppercase tracking-wide text-eat-muted">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-eat-blue">{item.value}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button href="/order">Order Local</Button>
          </div>
        </div>
      </section>

      {/* 19348 */}
      <section className="eat-section">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <span className="inline-block rounded-full bg-eat-red/10 px-4 py-1.5 text-sm font-semibold text-eat-red">
            Launching first in 19348
          </span>
          <h2 className="mt-4 text-2xl font-bold text-eat-ink md:text-3xl">
            Kennett Square and surrounding area
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-eat-muted">
            We&apos;re not building a national marketplace. We&apos;re building density in one ZIP first — better routes for drivers, better support for restaurants, better deals for neighbors.
          </p>
        </div>
      </section>

      {/* Transparent pricing */}
      <section className="eat-section bg-eat-soft">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            centered
            title="Transparent pricing"
            subtitle="Everyone sees the numbers. Restaurants, drivers, and customers all know what they're paying and why."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { who: "Restaurants", detail: "17.76% → 12% tiered. No monthly fee at launch." },
              { who: "Drivers", detail: "$6.76 base + 100% tips." },
              { who: "Customers", detail: "$1.76 service + $4.76 delivery. No hidden fees." },
              { who: "Future premium", detail: "$76/mo only with added services like marketing or analytics." },
            ].map((item) => (
              <Card key={item.who}>
                <p className="font-bold text-eat-blue">{item.who}</p>
                <p className="mt-2 text-sm text-eat-muted">{item.detail}</p>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button href="/pricing" variant="outline">
              Full pricing details
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="eat-section">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading centered title="How it works" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { step: "1", title: "Order local", text: "Browse independent restaurants in 19348. Clear fees at checkout." },
              { step: "2", title: "Restaurant prepares", text: "Your order goes straight to the restaurant — not lost in a national queue." },
              { step: "3", title: "Local driver delivers", text: "A driver who knows the area picks up, delivers, and keeps 100% of your tip." },
            ].map((item) => (
              <Card key={item.step} className="text-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-eat-blue text-white font-bold">
                  {item.step}
                </span>
                <h3 className="mt-4 font-bold text-eat-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-eat-muted">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Early access */}
      <section className="eat-section bg-eat-soft" id="early-access">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            centered
            title="Get early access"
            subtitle="Restaurants, drivers, and customers — tell us you're interested and we'll reach out when Eat76 launches in your area."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <EarlyAccessForm type="restaurant" />
            <EarlyAccessForm type="driver" />
            <EarlyAccessForm type="customer" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
