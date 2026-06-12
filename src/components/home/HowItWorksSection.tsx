import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    step: "1",
    title: "Pick your spot",
    text: "Browse independent restaurants near 19348. See ratings, cuisine, and delivery time upfront.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: "2",
    title: "Checkout with clarity",
    text: "$1.76 service + $4.76 delivery. No hidden fees, no inflated menu prices. Know your total before you pay.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    step: "3",
    title: "Local driver delivers",
    text: "A neighbor picks up your order and brings it to your door. 100% of your tip goes straight to them.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section className="eat-section bg-eat-soft" id="how-it-works">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          centered
          title="How ordering works"
          subtitle="Three simple steps. Built for hungry neighbors, not corporate dashboards."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <Card key={item.step} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-eat-blue/10 text-eat-blue">
                {item.icon}
              </div>
              <span className="mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-eat-blue text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-3 font-bold text-eat-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-eat-muted">{item.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
