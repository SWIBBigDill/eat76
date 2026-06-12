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
