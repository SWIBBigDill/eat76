import { deliveryZones } from "@/data/zones";

export const DEFAULT_DELIVERY_ADDRESS =
  "123 E State St, Kennett Square, PA 19348";

const VALID_ZIPS = new Set(deliveryZones.map((z) => z.zip));

export function extractZip(address: string): string | null {
  const match = address.match(/\b(\d{5})(?:-\d{4})?\b/);
  return match?.[1] ?? null;
}

export function isValidDeliveryZip(zip: string | null): boolean {
  if (!zip || !/^\d{5}$/.test(zip)) return false;
  return VALID_ZIPS.has(zip);
}

export function validateDeliveryAddress(address: string): {
  valid: boolean;
  zip: string | null;
  message: string | null;
} {
  const trimmed = address.trim();
  if (!trimmed) {
    return { valid: false, zip: null, message: "Enter a delivery address" };
  }
  const zip = extractZip(trimmed);
  if (!zip) {
    return { valid: false, zip: null, message: "Include a 5-digit ZIP code" };
  }
  if (!isValidDeliveryZip(zip)) {
    return {
      valid: false,
      zip,
      message: "We deliver in 19348 and nearby zones only",
    };
  }
  return { valid: true, zip, message: null };
}

export type ZipLookupResult = {
  zip: string;
  city: string;
  state: string;
};

const ZIP_LOOKUP_CACHE_KEY = "eat76:zip-lookup";

function readZipCache(): Record<string, ZipLookupResult> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ZIP_LOOKUP_CACHE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ZipLookupResult>) : {};
  } catch {
    return {};
  }
}

function writeZipCache(cache: Record<string, ZipLookupResult>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ZIP_LOOKUP_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage full or blocked, skip caching */
  }
}

/**
 * Optional async enhancement: confirm a ZIP exists via the free Zippopotam
 * API and return its city/state for a friendly confirmation line.
 * Never blocks checkout. Returns null if the ZIP is unknown or the API
 * is unreachable, in which case callers should show nothing.
 */
export async function validateZipWithApi(
  zip: string
): Promise<ZipLookupResult | null> {
  if (!/^\d{5}$/.test(zip)) return null;

  const cache = readZipCache();
  if (cache[zip]) return cache[zip];

  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      places?: Array<{ "place name"?: string; "state abbreviation"?: string }>;
    };
    const place = data.places?.[0];
    if (!place?.["place name"] || !place?.["state abbreviation"]) return null;

    const result: ZipLookupResult = {
      zip,
      city: place["place name"],
      state: place["state abbreviation"],
    };
    writeZipCache({ ...readZipCache(), [zip]: result });
    return result;
  } catch {
    return null;
  }
}
