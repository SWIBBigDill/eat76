const pillars = [
  {
    title: "Local restaurants",
    text: "Independent spots you already love",
    accent: "text-eat-blue",
    iconBg: "bg-eat-blue/10 text-eat-blue",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m4-18v18m-4-9h.01M16 12h.01" />
      </svg>
    ),
  },
  {
    title: "Local drivers",
    text: "Neighbors who know the roads",
    accent: "text-eat-blue",
    iconBg: "bg-eat-blue/10 text-eat-blue",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h2m8 0h4m0 0h2v-5l-3-4h-3v9" />
      </svg>
    ),
  },
  {
    title: "Local savings",
    text: "Freedom from big delivery apps",
    accent: "text-eat-red",
    iconBg: "bg-eat-red/10 text-eat-red",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v1m9-6a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function LaunchLocalSection() {
  return (
    <section className="eat-section">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-eat-red/10 px-4 py-1.5 text-sm font-semibold text-eat-red">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Launching in 19348
        </span>
        <h2 className="mt-4 text-2xl font-bold text-eat-ink md:text-3xl">
          Kennett Square and surrounding area
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-eat-muted">
          We&apos;re not building a national marketplace. We&apos;re building density in one ZIP first. Better routes for drivers, better support for restaurants, better deals for neighbors.
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group rounded-3xl border border-eat-border bg-white px-5 py-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${pillar.iconBg}`}>
                {pillar.icon}
              </span>
              <p className={`mt-3 font-bold ${pillar.accent}`}>{pillar.title}</p>
              <p className="mt-1 text-sm text-eat-muted">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
