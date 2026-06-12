# Stripe setup for Eat76

Eat76 uses a **single Stripe platform account** (business name: **Eat76**) with **Stripe Connect** so restaurants receive food proceeds via destination charges. Customer checkout uses **Checkout Sessions**.

Production site: **https://eat76.vercel.app**

---

## What you need (manual — requires Stripe login)

These steps cannot be automated without your Stripe Dashboard credentials.

### 1. Create the Eat76 platform account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register).
2. Register with business name **Eat76** (local food delivery marketplace).
3. Complete basic business profile (you can stay in **Test mode** until ready for live payments).

### 2. Enable Stripe Connect

1. Dashboard → **Connect** → **Get started**.
2. Choose a **marketplace** use case — platforms that collect payments and pay out sellers.
3. Confirm platform responsibilities (Eat76 collects fees; platform handles disputes in MVP).

### 3. Copy API keys (Test mode first)

1. Dashboard → **Developers** → **API keys**.
2. Copy:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`) — or create a [restricted key](https://docs.stripe.com/keys/restricted-api-keys) (`rk_test_...`) with Checkout, Connect, and Webhook permissions only.

### 4. Register production webhook

1. Dashboard → **Developers** → **Webhooks** → **Add endpoint**.
2. **Endpoint URL:** `https://eat76.vercel.app/api/stripe/webhook`
3. **Events to send:**
   - `checkout.session.completed`
   - `account.updated`
4. After creating the endpoint, open it and copy the **Signing secret** (`whsec_...`).

For local development, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the CLI signing secret in `.env.local` while testing locally.

### 5. Add environment variables

#### Local (`.env.local`)

Copy `.env.example` to `.env.local` and fill in values. **Never commit `.env.local`.**

#### Vercel (Production + Preview)

Project: **so-when-it-be-32c132f5/eat76**

```bash
npx vercel env add STRIPE_SECRET_KEY production
npx vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
npx vercel env add STRIPE_WEBHOOK_SECRET production
npx vercel env add NEXT_PUBLIC_APP_URL production
# Optional: keep demo checkout until you are ready
# npx vercel env add NEXT_PUBLIC_STRIPE_ENABLED production   # value: false
```

Or use [Vercel project settings → Environment Variables](https://vercel.com/so-when-it-be-32c132f5/eat76/settings/environment-variables).

Redeploy after adding vars (push to `main` or `npx vercel deploy --prod`).

### 6. Test Connect onboarding

1. Open [https://eat76.vercel.app/restaurants](https://eat76.vercel.app/restaurants).
2. Click **Connect Stripe (Restaurant Demo)**.
3. Complete Stripe Express onboarding (test mode uses fake data).
4. Return URL lands on `/restaurant-dashboard?onboarded=true`.

### 7. Test customer checkout

1. Add items to cart on `/order/[restaurant]`.
2. With keys configured, **Place Order** should redirect to Stripe Checkout (when wired; cart currently uses demo flow until checkout UI is connected).
3. Use [Stripe test cards](https://docs.stripe.com/testing#cards) (e.g. `4242 4242 4242 4242`).

### 8. Go live

1. Complete platform verification in Dashboard.
2. Toggle Dashboard to **Live mode**.
3. Replace test keys with live keys (`pk_live_...`, `sk_live_...` or `rk_live_...`).
4. Re-create the webhook endpoint for the same production URL in **live mode** and update `STRIPE_WEBHOOK_SECRET`.
5. Set `NEXT_PUBLIC_APP_URL=https://eat76.vercel.app`.

---

## Required environment variables

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `STRIPE_SECRET_KEY` | Yes (for payments) | `sk_test_...` or `rk_test_...` | Server API: Checkout, Connect, webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes (for client detection) | `pk_test_...` | Client-side Stripe enabled detection |
| `STRIPE_WEBHOOK_SECRET` | Yes (for webhooks) | `whsec_...` | Verify webhook signatures |
| `NEXT_PUBLIC_APP_URL` | Recommended | `https://eat76.vercel.app` | Checkout return URLs |
| `NEXT_PUBLIC_STRIPE_ENABLED` | Optional | `false` | Force demo mode even if keys exist |
| `STRIPE_PUBLISHABLE_KEY` | Optional | `pk_test_...` | Server-side fallback (prefer `NEXT_PUBLIC_*`) |

Without keys, the app runs in **demo mode**: cart checkout saves to `sessionStorage`, Connect button shows a friendly configuration message.

---

## Dashboard checklist (visual cues)

When stepping through the Dashboard, expect:

| Step | Where to look | What you should see |
|------|---------------|---------------------|
| Connect enabled | Connect → Overview | Marketplace / connected accounts section |
| Test keys | Developers → API keys | `pk_test_` and `sk_test_` visible while in Test mode |
| Webhook | Developers → Webhooks | Endpoint `https://eat76.vercel.app/api/stripe/webhook` with 2 events |
| Branding | Settings → Branding | Eat76 logo/colors on Checkout pages |
| Test payment | Payments → All payments | Test charges after checkout |

---

## CLI alternatives (optional)

The Stripe CLI was **not** available in the automated setup environment. On your machine:

```bash
# Install: https://stripe.com/docs/stripe-cli#install
stripe login
stripe --version

# Ephemeral sandbox (Stripe CLI 1.21+)
stripe sandbox create

# Forward webhooks locally
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Code references

| Route / file | Purpose |
|--------------|---------|
| `POST /api/stripe/checkout` | Create Checkout Session |
| `POST /api/stripe/connect/onboard` | Accounts v2 restaurant onboarding |
| `POST /api/stripe/webhook` | Signature-verified events |
| `src/lib/stripe/README.md` | Architecture and fee split |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Connect button: "Stripe is not configured" | No `STRIPE_SECRET_KEY` on Vercel | Add env vars and redeploy |
| Webhook 400 invalid signature | Wrong `STRIPE_WEBHOOK_SECRET` | Copy secret from the exact endpoint (test vs live) |
| Checkout 503 | Missing secret key or `NEXT_PUBLIC_STRIPE_ENABLED=false` | Check env vars |
| Connect account creation fails | Connect not enabled on platform | Dashboard → Connect → Get started |
