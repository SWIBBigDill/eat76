"use client";

import { useEffect } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[eat76] page error", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <LogoMark size={72} />
      <p className="mt-6 text-sm font-bold uppercase tracking-wide text-eat-red">Error</p>
      <h1 className="mt-2 text-2xl font-bold text-eat-ink">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-eat-muted">
        We hit a snag loading this page. Try again or head back to order local.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/order" variant="outline">
          Browse restaurants
        </Button>
      </div>
    </div>
  );
}
