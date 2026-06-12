"use client";

import { Button } from "@/components/ui/Button";

type MockLoginBannerProps = {
  role: "restaurant" | "driver" | "admin";
};

export function MockLoginBanner({ role }: MockLoginBannerProps) {
  return (
    <div className="rounded-2xl border border-dashed border-eat-blue/30 bg-eat-soft px-4 py-3 text-sm text-eat-muted">
      <span className="font-medium text-eat-ink">Demo mode.</span>{" "}
      No authentication yet — this is a mock {role} dashboard.
      {/* TODO: Supabase Auth — replace mock login */}
      <Button variant="ghost" className="ml-2 inline px-2 py-1 text-xs" onClick={() => {}}>
        Mock login
      </Button>
    </div>
  );
}
