export function LaunchLocalSection() {
  return (
    <section className="eat-section">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <span className="inline-block rounded-full bg-eat-red/10 px-4 py-1.5 text-sm font-semibold text-eat-red">
          Launching in 19348
        </span>
        <h2 className="mt-4 text-2xl font-bold text-eat-ink md:text-3xl">
          Kennett Square and surrounding area
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-eat-muted">
          We&apos;re not building a national marketplace. We&apos;re building density in one ZIP first — better routes for drivers, better support for restaurants, better deals for neighbors.
        </p>
        <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-4 text-sm">
          <div className="rounded-2xl border border-eat-border bg-white px-5 py-3 shadow-sm">
            <p className="font-bold text-eat-blue">Local restaurants</p>
            <p className="text-eat-muted">Independent spots you already love</p>
          </div>
          <div className="rounded-2xl border border-eat-border bg-white px-5 py-3 shadow-sm">
            <p className="font-bold text-eat-blue">Local drivers</p>
            <p className="text-eat-muted">Neighbors who know the roads</p>
          </div>
          <div className="rounded-2xl border border-eat-border bg-white px-5 py-3 shadow-sm">
            <p className="font-bold text-eat-red">Local savings</p>
            <p className="text-eat-muted">Freedom from big delivery apps</p>
          </div>
        </div>
      </div>
    </section>
  );
}
