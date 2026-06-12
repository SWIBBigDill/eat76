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
        <div className="relative mt-12">
          <div
            className="absolute left-[18%] right-[18%] top-9 hidden border-t-2 border-dashed border-eat-blue/25 md:block"
            aria-hidden
          />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-6">
            {steps.map((item) => (
              <li
                key={item.step}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-3xl border border-eat-blue/15 bg-white text-eat-blue shadow-md shadow-eat-blue/10">
                    {item.icon}
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-eat-red text-xs font-bold text-white shadow-sm">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-eat-ink">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-eat-muted">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
