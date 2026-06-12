"use client";

import {
  progressPercent,
  statusIndex,
  TRACK_STEPS,
  type OrderTrackStatus,
} from "@/lib/order-tracking";

type OrderTrackerProps = {
  status: OrderTrackStatus;
  compact?: boolean;
};

export function OrderTracker({ status, compact }: OrderTrackerProps) {
  const currentIdx = statusIndex(status);
  const pct = progressPercent(status);

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold text-eat-muted">
          <span>Progress</span>
          <span className="text-eat-blue">{pct}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-eat-soft">
          <div
            className="h-full rounded-full bg-gradient-to-r from-eat-blue to-eat-red transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between">
          {TRACK_STEPS.filter((_, i) => i === 0 || i === 3 || i === TRACK_STEPS.length - 1).map(
            (step) => (
              <span
                key={step.status}
                className={`text-[10px] font-medium ${
                  statusIndex(step.status) <= currentIdx ? "text-eat-blue" : "text-eat-muted"
                }`}
              >
                {step.label}
              </span>
            )
          )}
        </div>
      </div>

      <ol className={compact ? "space-y-0" : "space-y-0"}>
        {TRACK_STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          const pending = idx > currentIdx;

          return (
            <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
              {idx < TRACK_STEPS.length - 1 && (
                <span
                  className={`absolute left-[15px] top-8 h-[calc(100%-0.75rem)] w-0.5 transition-colors duration-500 ${
                    done ? "bg-eat-blue" : active ? "bg-eat-red/40" : "bg-eat-border"
                  }`}
                  aria-hidden
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                  done
                    ? "bg-eat-blue text-white"
                    : active
                      ? "bg-eat-red text-white ring-4 ring-eat-red/20 animate-pulse-soft"
                      : "border-2 border-eat-border bg-white text-eat-muted"
                }`}
              >
                {done ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </span>
              <div className={`transition-opacity duration-300 ${pending ? "opacity-45" : ""}`}>
                <p className={`font-semibold ${active ? "text-eat-red" : "text-eat-ink"}`}>
                  {step.label}
                  {active && (
                    <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-eat-red" />
                  )}
                </p>
                {!compact && <p className="text-sm text-eat-muted">{step.description}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
