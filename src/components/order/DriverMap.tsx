"use client";

import { useEffect, useState } from "react";
import type { OrderTrackStatus } from "@/lib/order-tracking";

type DriverMapProps = {
  status: OrderTrackStatus;
  driverName: string;
  driverInitials: string;
  vehicle: string;
  minutesAway: number;
  collapsible?: boolean;
};

const MAP_BBOX = "-75.715,39.844,-75.702,39.851";

export function DriverMap({
  status,
  driverName,
  driverInitials,
  vehicle,
  minutesAway,
  collapsible = true,
}: DriverMapProps) {
  const [expanded, setExpanded] = useState(!collapsible);
  const [dotProgress, setDotProgress] = useState(0);
  const showDriver =
    status === "driver_picked_up" || status === "on_the_way" || status === "delivered";

  useEffect(() => {
    const base =
      status === "delivered" ? 100 : status === "on_the_way" ? 65 : status === "driver_picked_up" ? 25 : 10;
    setDotProgress(base);

    if (!showDriver || status === "delivered") return;

    const interval = window.setInterval(() => {
      setDotProgress((p) => Math.min(95, p + 2));
    }, 4000);
    return () => window.clearInterval(interval);
  }, [status, showDriver]);

  const mapContent = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-eat-soft sm:aspect-[16/9]">
      <iframe
        title="Delivery map"
        className="absolute inset-0 h-full w-full border-0 opacity-90"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik&marker=39.8468%2C-75.7116`}
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />

      {showDriver && (
        <div
          className="driver-dot absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-all duration-[4s] ease-linear"
          style={{ left: `${12 + dotProgress * 0.76}%`, top: `${55 - dotProgress * 0.25}%` }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-eat-blue text-xs font-bold text-white shadow-lg ring-4 ring-white">
            {driverInitials}
          </div>
          <span className="mt-1 rounded-full bg-eat-ink px-2 py-0.5 text-[10px] font-semibold text-white shadow">
            {driverName}
          </span>
        </div>
      )}

      <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-eat-ink shadow">
        <span className="text-eat-red">●</span> Restaurant
      </div>
      <div className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-eat-ink shadow">
        <span className="text-eat-blue">●</span> Your address
      </div>
    </div>
  );

  if (collapsible) {
    return (
      <div className="overflow-hidden rounded-2xl border border-eat-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left tap-target"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <div>
            <p className="font-semibold text-eat-ink">
              {showDriver ? "Your driver is on the way" : "Delivery map"}
            </p>
            <p className="text-sm text-eat-muted">
              {showDriver && minutesAway > 0
                ? `${driverName} · ${minutesAway} min away`
                : `${driverName} · ${vehicle}`}
            </p>
          </div>
          <svg
            className={`h-5 w-5 shrink-0 text-eat-muted transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expanded && <div className="border-t border-eat-border p-3">{mapContent}</div>}
      </div>
    );
  }

  return mapContent;
}
