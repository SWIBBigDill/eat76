/** Eat76 platform identifier on all Stripe objects. */
export const EAT76_PLATFORM = "eat76" as const;

export const EAT76_BUSINESS_NAME = "Eat76";

export const eat76Metadata = (extra?: Record<string, string>) => ({
  platform: EAT76_PLATFORM,
  ...extra,
});

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}
