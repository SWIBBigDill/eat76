/** Explicit opt-out for Stripe (e.g. production demo before keys are ready). */
export function isStripeExplicitlyDisabled(): boolean {
  return process.env.NEXT_PUBLIC_STRIPE_ENABLED === "false";
}

export function isStripeEnabled(): boolean {
  return !isStripeExplicitlyDisabled();
}
