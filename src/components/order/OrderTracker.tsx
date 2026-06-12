"use client";

import { useEffect, useState } from "react";
import {
  getDemoTrackStatus,
  statusIndex,
  TRACK_STEPS,
  type TrackStatus,
} from "@/lib/order-tracking";

type OrderTrackerProps = {
  placedAt: string;
  initialStatus?: TrackStatus;
};

export function OrderTracker({ placedAt, initialStatus }: OrderTrackerProps) {
  const [status, setStatus] = useState<TrackStatus>(
    initialStatus ?? getDemoTrackStatus(placedAt)
  );

  useEffect(() => {
    const tick = () => setStatus(getDemoTrackStatus(placedAt));
    tick();
    const interval = window.setInterval(tick, 15000);
    return () => window.clearInterval(interval);
  }, [placedAt]);

  const currentIdx = statusIndex(status);

  return (
    <ol className="space-y-0">
      {TRACK_STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const pending = idx > currentIdx;

        return (
          <li key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
            {idx < TRACK_STEPS.length - 1 && (
              <span
                className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-0.5 ${
                  done ? "bg-eat-blue" : "bg-eat-border"
                }`}
                aria-hidden
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                done
                  ? "bg-eat-blue text-white"
                  : active
                    ? "bg-eat-red text-white ring-4 ring-eat-red/20"
                    : "border-2 border-eat-border bg-white text-eat-muted"
              }`}
            >
              {done ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                idx + 1
              )}
            </span>
            <div className={pending ? "opacity-50" : ""}>
              <p className={`font-semibold ${active ? "text-eat-red" : "text-eat-ink"}`}>
                {step.label}
                {active && (
                  <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-eat-red" />
                )}
              </p>
              <p className="text-sm text-eat-muted">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
