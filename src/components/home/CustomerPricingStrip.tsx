import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

const fees = [
  {
    label: "Service fee",
    value: "$1.76",
    detail: "Flat on every order. No percentage surprises.",
    accent: "text-eat-blue",
  },
  {
    label: "Delivery fee",
    value: "$4.76",
    detail: "Core zone (19348). Clear before checkout.",
    accent: "text-eat-blue",
  },
  {
    label: "Driver tips",
    value: "100%",
    detail: "Every dollar goes to your driver",
    accent: "text-eat-red",
  },
];

export function CustomerPricingStrip() {
  return (
    <section className="eat-section" id="pricing">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          centered
          title="Fees you can actually read"
          subtitle="No stacked service charges. No inflated menu prices. Just honest numbers at checkout."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
          {fees.map((item) => (
            <Card key={item.label} className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-eat-muted">
                {item.label}
              </p>
              <p className={`mt-2 text-3xl font-bold ${item.accent}`}>{item.value}</p>
              <p className="mt-2 text-sm text-eat-muted">{item.detail}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href="/pricing" variant="outline">
            Full pricing details
          </Button>
        </div>
      </div>
    </section>
  );
}
