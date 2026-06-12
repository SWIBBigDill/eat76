import { isStripeEnabled } from "./config";

/** Publishable key for Stripe.js / client-side detection (never use secret key here). */
export function getStripePublishableKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
    process.env.STRIPE_PUBLISHABLE_KEY ??
    null
  );
}

export function isStripeClientConfigured(): boolean {
  if (!isStripeEnabled()) return false;
  const key = getStripePublishableKey();
  return Boolean(key && key.startsWith("pk_"));
}
