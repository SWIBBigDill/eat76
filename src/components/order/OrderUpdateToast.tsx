"use client";

type OrderUpdateToastProps = {
  message: string | null;
  onDismiss: () => void;
  onEnableNotifications?: () => void;
  showNotifyPrompt?: boolean;
};

export function OrderUpdateToast({
  message,
  onDismiss,
  onEnableNotifications,
  showNotifyPrompt,
}: OrderUpdateToastProps) {
  if (!message && !showNotifyPrompt) return null;

  return (
    <div className="fixed inset-x-4 top-4 z-50 mx-auto max-w-lg space-y-2 safe-top">
      {message && (
        <div
          className="flex items-start gap-3 rounded-2xl border border-eat-blue/20 bg-white p-4 shadow-lg animate-fade-in-up"
          role="status"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-eat-blue text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-eat-ink">Order update</p>
            <p className="text-sm text-eat-muted">{message}</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-eat-muted hover:text-eat-ink"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {showNotifyPrompt && onEnableNotifications && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-eat-border bg-eat-soft p-3 text-sm animate-fade-in">
          <p className="text-eat-ink">Get alerts when your order moves forward?</p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onEnableNotifications}
              className="rounded-xl bg-eat-blue px-3 py-1.5 text-xs font-semibold text-white"
            >
              Enable
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-eat-muted"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
