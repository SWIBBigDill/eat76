/**
 * Integration map for Eat76 MVP.
 *
 * Stripe: see src/lib/stripe/README.md for architecture, OSS references, and setup.
 * Supabase: planned for orders, auth, and real-time status.
 */

export const INTEGRATION_NOTES = {
  supabase: [
    "early_access table for form submissions",
    "orders, restaurants, drivers tables",
    "real-time order status updates",
    "Supabase Auth for restaurant/driver/admin roles",
  ],
  stripe: [
    "Platform account: Eat76 (dashboard.stripe.com) — not a separate sub-account",
    "Checkout Session: POST /api/stripe/checkout",
    "Connect Accounts v2 (recipient): POST /api/stripe/connect/onboard",
    "Webhooks: POST /api/stripe/webhook (checkout.session.completed)",
    "metadata.platform = eat76 on all Stripe objects",
  ],
} as const;
