import { Suspense } from "react";

export default function OrderSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="py-16 text-center text-sm text-eat-muted">Loading…</div>}>{children}</Suspense>;
}
