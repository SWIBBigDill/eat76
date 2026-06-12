import Link from "next/link";

const fees = [
  {
    label: "Service fee",
    value: "$1.76",
    detail: "Flat on every order. No percentage surprises.",
  },
  {
    label: "Delivery fee",
    value: "$4.76",
    detail: "Core zone (19348). Clear before checkout.",
  },
  {
    label: "Driver tips",
    value: "100%",
    detail: "Every dollar goes to your driver.",
  },
];

export function CustomerPricingStrip() {
  return (
    <section className="eat-section" id="pricing">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-eat-blue to-eat-blue-dark px-5 py-10 text-center shadow-xl shadow-eat-blue/20 sm:px-10 md:py-14">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-eat-red/20 blur-3xl"
            aria-hidden
          />

          <div className="relative">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Fees you can actually read
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/80">
              No stacked service charges. No inflated menu prices. Just honest
              numbers at checkout.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
              {fees.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/15 bg-white/10 px-5 py-6 backdrop-blur transition-colors hover:bg-white/15"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    {item.label}
                  </p>
                  <p className="mt-2 text-4xl font-bold text-white">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-white/75">{item.detail}</p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-7 max-w-xl text-sm text-white/70">
              Big delivery apps stack fees and markups worth roughly 25 to 30%
              of your order. Eat76 keeps it flat, every time.
            </p>

            <div className="mt-7">
              <Link
                href="/pricing"
                className="tap-target inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3 text-sm font-semibold text-eat-blue shadow-md transition hover:bg-eat-soft active:scale-[0.98]"
              >
                Full pricing details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
