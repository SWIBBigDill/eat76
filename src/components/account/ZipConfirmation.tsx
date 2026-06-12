"use client";

import { useEffect, useState } from "react";
import {
  extractZip,
  validateZipWithApi,
  type ZipLookupResult,
} from "@/lib/delivery-address";

/**
 * Friendly "Delivering to City, ST" line under the address field.
 * Looks up the ZIP via the free Zippopotam API; shows nothing if the
 * ZIP is missing, unknown, or the API is unavailable.
 */
export function ZipConfirmation({ address }: { address: string }) {
  const [result, setResult] = useState<ZipLookupResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    const zip = extractZip(address);

    const timer = window.setTimeout(() => {
      if (!zip) {
        setResult(null);
        return;
      }
      void validateZipWithApi(zip).then((lookup) => {
        if (!cancelled) setResult(lookup);
      });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [address]);

  if (!result) return null;

  return (
    <p className="mt-2 text-xs font-semibold text-eat-blue" role="status">
      Delivering to {result.city}, {result.state}
    </p>
  );
}
