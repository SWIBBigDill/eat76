# Eat76 go-live status

Last updated: June 12, 2026

## What is already provisioned (live now)

| Piece | Status | Details |
| --- | --- | --- |
| Supabase project | Live | `eat76` (ref `acnjhuznxwquxaaflmrm`), us-east-1, free tier |
| Database schema | Applied | `restaurants`, `orders`, `early_access`, `drivers` with RLS + RPCs |
| Restaurant directory | Seeded | All 75 prospect restaurants in the `restaurants` table |
| Vercel env vars | Set (production) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Orders API | Wired | `/api/orders` reads/writes Supabase, falls back to file store |
| Early access forms | Wired | Submissions insert into `early_access` |
| Restaurant dashboard | Live data | Polls Supabase orders every 8s, status updates persist |
| Driver dashboard | Live data | Real pickup queue, claim and deliver updates the same order |
| Customer tracking | Real loop | Track page polls the API; the server is the source of truth |
| Magic link auth | Code ready | Uses Supabase Auth when configured (see step 2 below) |
| Email notifications | Code ready | Sends via Resend when `RESEND_API_KEY` is set |

The full loop works today: place an order on /order, watch it appear on
/restaurant-dashboard, advance it (Accept, Preparing, Ready), pick it up on
/driver-dashboard, and the customer track page follows along in real time.

## Stripe: LIVE (completed June 12, 2026)

Live keys for account `acct_1TFcBUIndviBR6LR` are set in Vercel:
`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`,
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.

Production webhook endpoint `we_1ThbW7IndviBR6LRRfNES6c8` is enabled at
`https://eat76.vercel.app/api/stripe/webhook` for `checkout.session.completed`
and `account.updated`. Live checkout session creation is verified working.

Note: these are LIVE keys. Checkout charges real cards. The Connect button on
/restaurants creates real connected accounts.

## Remaining manual steps (need account owner access)

### 1. Supabase auth + secret key (5 minutes)

1. Open https://supabase.com/dashboard/project/acnjhuznxwquxaaflmrm/auth/url-configuration
   - Site URL: `https://eat76.vercel.app`
   - Add redirect URL: `https://eat76.vercel.app/auth/callback`
   (This makes magic link emails land back on the production site.)
2. Open https://supabase.com/dashboard/project/acnjhuznxwquxaaflmrm/settings/api-keys
   - Copy the secret key and add it to Vercel as `SUPABASE_SECRET_KEY`
   (The app works without it through scoped RPCs, but the secret key gives the
   server full access and is the production-correct setup.)

### 2. Email notifications (optional, 10 minutes)

1. Create a free account at https://resend.com
2. Add `RESEND_API_KEY` to Vercel
3. Optionally verify a sending domain and set `NOTIFY_FROM_EMAIL`

Order confirmation and delivery emails start sending automatically.

### 3. Business steps (the real work)

- Sign 5-10 restaurants in 19348; replace template menus with verified ones
- Onboard each signed restaurant through Stripe Connect (button on /restaurants)
- Recruit 1-2 pilot drivers
- Optional: app stores per docs/MOBILE_APP_STORE.md

## Architecture notes

- Server routes prefer `SUPABASE_SECRET_KEY`; without it they use the
  publishable key plus narrowly-scoped security definer RPCs
  (`get_order_by_id`, `update_order_status`, `get_restaurant_orders`,
  `get_active_deliveries`, `assign_driver`, `get_recent_orders`).
- All tables have RLS enabled. Public policies only allow inserting orders and
  early access submissions, plus reading the restaurant directory.
- If Supabase is unreachable, every store falls back to the local file store so
  the site never hard-fails.
