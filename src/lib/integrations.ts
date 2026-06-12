/**
 * Future integration stubs for Eat76 MVP.
 *
 * TODO: Supabase — configure client in lib/supabase/client.ts and server.ts
 * TODO: Stripe — configure checkout in lib/stripe.ts
 */

export const INTEGRATION_NOTES = {
  supabase: [
    "early_access table for form submissions",
    "orders, restaurants, drivers tables",
    "real-time order status updates",
    "Supabase Auth for restaurant/driver/admin roles",
  ],
  stripe: [
    "Checkout Session for customer orders",
    "Connect for restaurant payouts",
    "Webhook handlers for payment confirmation",
  ],
} as const;
