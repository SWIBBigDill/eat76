# Eat76

Local-first food delivery platform launching first in ZIP **19348** (Kennett Square, PA).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Mock JSON/localStorage data (Supabase + Stripe ready to add)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/restaurants` | Restaurant signup + savings calculator |
| `/drivers` | Driver recruitment |
| `/order` | Customer ordering — zone filters, search, mobile FAB |
| `/order/[restaurant]` | Menu + cart with hero banner & sticky checkout bar |
| `/order/confirmation` | Demo order confirmation + savings recap |
| `/pricing` | Transparent pricing |
| `/restaurant-dashboard` | Mock restaurant admin |
| `/driver-dashboard` | Mock driver dispatch |
| `/admin` | Internal admin + projections |

## Deploy on Vercel

**Live:** https://eat76.vercel.app

### GitHub (auto-deploy)

Repo: https://github.com/SWIBBigDill/eat76

**Option A — Vercel Git integration (recommended)**

1. Open [Vercel project settings → Git](https://vercel.com/so-when-it-be-32c132f5/eat76/settings/git)
2. Connect `SWIBBigDill/eat76`
3. If prompted, authorize the Vercel GitHub App for the `SWIBBigDill` account
4. Production branch: `main`

Pushes to `main` deploy to production. Pull requests get preview URLs.

**Option B — GitHub Actions (already configured)**

Add a repository secret:

1. Create a token at https://vercel.com/account/tokens
2. In GitHub: **Settings → Secrets → Actions → New secret**
3. Name: `VERCEL_TOKEN`, value: your Vercel token

The workflow in `.github/workflows/deploy.yml` deploys on every push to `main`.

### Manual deploy

```bash
npx vercel deploy --prod
```

## Prospect restaurants (19348 radius)

~75 local restaurants are preloaded from the Eat76 onboarding lead list in `src/data/prospects.raw.json`, grouped by delivery zone in `/order`.

**Image policy:** Hero images are fetched only from restaurant-owned websites via `npm run fetch-assets`. Delivery-app menus (DoorDash, Grubhub, etc.) are not scraped. Restaurants without a fetchable site image get a branded SVG placeholder. Menu overrides exist only where sourced from official sites (e.g. Lily, La Verona); others use cuisine templates until onboarding.

```bash
npm run fetch-assets   # refreshes public/restaurants/* and imageManifest.json
```

## Mobile UX & checkout savings

- **Bottom tab nav** on mobile (Home, Order, Restaurants, Drivers)
- **Zone filter chips** and restaurant search on `/order`
- **Cart persists** in `localStorage`; demo checkout saves to `sessionStorage`
- **Checkout savings** — side-by-side comparison vs typical big-app fees (~15% markup + delivery + service) via `calculateCustomerCheckoutComparison()` in `src/lib/pricing.ts`
- **Micro-interactions** — add-to-cart feedback, cart badge pulse, slide-up cart sheet, `prefers-reduced-motion` support

## Future integrations

See `src/lib/integrations.ts` and `TODO` comments throughout the codebase for Supabase and Stripe hooks.
