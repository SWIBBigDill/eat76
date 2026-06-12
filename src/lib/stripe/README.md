# Eat76 Stripe integration

Eat76 is a **local food delivery marketplace**. Stripe powers customer checkout; **Stripe Connect** pays out restaurants when they are onboarded as connected accounts.

## What "Eat76" maps to in Stripe

| Concept | Stripe object | Notes |
|--------|---------------|-------|
| **Eat76 (the business)** | Your **platform Stripe account** | The main account you create at [dashboard.stripe.com](https://dashboard.stripe.com). Business display name: **Eat76**. All API keys (`sk_`, `pk_`, `whsec_`) belong to this account. |
| **Eat76 Connect application** | Connect settings on the same platform account | Not a separate Stripe "sub-account." Enable Connect on the Eat76 platform account; restaurants become **connected accounts** under that application. |
| **Restaurant** | `v2/core/account` with **recipient** configuration | Created via `POST /api/stripe/connect/onboard`. Receives food proceeds via **destination charges** (`transfer_data.destination`). |
| **Driver** | Not a Connect account in MVP | Tips and base pay are tracked in metadata; driver payouts are manual or a future Connect/Transfer phase. |
| **Customer** | Stripe Customer (optional) / Checkout payer | Pays via **Checkout Session** hosted by Eat76 platform. |

Every charge, session, and connected account includes `metadata.platform = "eat76"` for filtering in the Stripe Dashboard.

## Architecture decisions

### Checkout: Checkout Sessions (not raw PaymentIntents)

- **Why:** One-time cart checkout with taxes/fees as line items; Stripe-hosted UI; PCI scope stays minimal.
- **Route:** `POST /api/stripe/checkout` → redirect to `session.url`.
- **Do not** pass `payment_method_types` — dynamic payment methods are enabled by default.

### Connect: Accounts v2 + destination charges

- **Why:** Stripe's current Connect path (`POST /v2/core/accounts`) with explicit `defaults.responsibilities` instead of legacy Express/Standard `type` flags.
- **Restaurant accounts:** `configuration.recipient` + `dashboard: "express"` + platform collects fees/losses (`fees_collector: "application"`, `losses_collector: "application"`).
- **Charge type:** **Destination charges** only — platform creates Checkout Session; `payment_intent_data.transfer_data.destination` routes food proceeds to the restaurant; `application_fee_amount` retains Eat76 service fee, delivery fee, restaurant platform fee, and driver tip (held for payout).

### Fee split (per order)

| Line | Amount | Recipient |
|------|--------|-----------|
| Food subtotal | Menu prices | Restaurant (minus platform %) |
| Service fee | $1.76 | Eat76 platform |
| Delivery fee | $4.76 | Eat76 platform (covers driver base pool) |
| Tip | Customer choice | Held for driver (100%) |
| Restaurant platform fee | 17.76% (orders 1–150/mo) or 12% after | Eat76 platform |

## Steps to create and configure the Eat76 platform account

1. **Create the platform account** at [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register). Business name: **Eat76**. This is the only account you create manually — restaurants are connected accounts, not separate platform signups.

2. **Enable Connect** — Dashboard → **Connect** → Get started. Choose a **marketplace** use case. Platform type: accounts that receive payouts (recipients).

3. **Copy API keys** (Developers → API keys). Prefer a [restricted key](https://docs.stripe.com/keys/restricted-api-keys) (`rk_`) in production with only Checkout, Connect, and Webhook permissions.

4. **Set environment variables** (see `.env.example` in repo root). Never commit real keys.

5. **Configure webhooks** — Dashboard → Developers → Webhooks → Add endpoint: `https://<your-domain>/api/stripe/webhook`. Events: `checkout.session.completed`, `account.updated`. Copy signing secret to `STRIPE_WEBHOOK_SECRET`. Local dev: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

6. **Branding** — Dashboard → Settings → Branding: Eat76 logo/colors for Checkout.

7. **Test Connect onboarding** — `POST /api/stripe/connect/onboard` with `{ restaurantId, businessName, email }`; complete Express onboarding in test mode.

8. **Go live** — Complete platform profile verification, switch to live keys, re-register webhook for production URL.

### MCP / CLI note

The Stripe MCP server in this workspace only exposes **authentication** (`mcp_auth`) — it cannot create a Stripe account or Connect application for you. Use the Dashboard (or `stripe sandbox create` via Stripe CLI for ephemeral test keys). Account creation is always a human/platform-owner step.

## Open-source references (shortlist)

Honest fit for Eat76's stack (Next.js 16, TypeScript, Tailwind, Vercel, marketplace + Connect):

### 1. [MHMDHIDR/restaurant-next](https://github.com/MHMDHIDR/restaurant-next) — **Best overall fit**

- **License:** Check repo (typically MIT-style; verify before reuse).
- **Stack:** Next.js 15, TypeScript, Tailwind, shadcn/ui, Stripe Connect, PostgreSQL/Drizzle.
- **Borrow:** Multi-vendor order lifecycle, Connect onboarding flow, webhook handlers, admin/vendor dashboards.
- **Gap vs Eat76:** Full DB + auth stack; heavier than current static-data MVP. Adopt patterns, not the whole app.

### 2. [kszongic/stripe-connect-marketplace](https://github.com/kszongic/stripe-connect-marketplace) — **Best Connect-only patterns**

- **License:** MIT.
- **Stack:** Next.js 15, Prisma, Tailwind, Checkout Sessions + destination charges + platform fees.
- **Borrow:** `application_fee_amount` math, seller onboarding API routes, webhook order status updates.
- **Gap vs Eat76:** Generic product marketplace (not food delivery); uses legacy Standard accounts — migrate patterns to Accounts v2 as in this repo.

### 3. [Ritenoob/ridedine](https://github.com/Ritenoob/ridedine) — **Best 3-sided marketplace model**

- **License:** Check repo.
- **Stack:** Monorepo — Next.js web + admin, Supabase Edge Functions for Stripe, React Native mobile.
- **Borrow:** Customer/chef/driver role split, commission metadata, Supabase + Stripe webhook architecture.
- **Gap vs Eat76:** Monorepo + mobile + Supabase; largest integration surface. Useful for driver payout and commission design only.

**Not recommended for direct adoption:** [TiM1113/FoodDelivery-AWS-Vercell](https://github.com/TiM1113/FoodDelivery-AWS-Vercell) — strong tests and Stripe checkout but **single-vendor** (no Connect). [gunning4it/openorder](https://github.com/gunning4it/openorder) — restaurant-first POS monorepo, not a multi-vendor delivery marketplace.

## Files in this integration

| File | Purpose |
|------|---------|
| `server.ts` | Server-side Stripe client (`STRIPE_SECRET_KEY`) |
| `client.ts` | Publishable key helper for UI |
| `checkout.ts` | Line items, Connect fee split, validation |
| `constants.ts` | `platform: eat76` metadata helpers |
| `api/stripe/checkout` | Create Checkout Session |
| `api/stripe/webhook` | Signature-verified webhook stub |
| `api/stripe/connect/onboard` | Accounts v2 restaurant onboarding link |

## Local development

```bash
# .env.local from .env.example
npm run dev

# Optional: Stripe CLI webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Without keys, the cart UI stays in **demo mode** (alert). With `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`, **Place Order** redirects to Stripe Checkout.
