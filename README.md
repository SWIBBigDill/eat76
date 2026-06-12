# Eat76

Local-first food delivery for **19348** (Kennett Square, PA). Live: **https://eat76.vercel.app**

## What works now

- **Order flow** — `/order` → menu → cart → checkout (demo or Stripe) → confirmation → `/order/track/[id]`
- **75 restaurants** — zone browse, search, popular picks, cart persistence, savings comparison
- **Partner pages** — `/restaurants` and `/drivers` (footer-linked) with FAQ, forms → `/api/early-access`
- **Dashboards** — restaurant (filter orders), driver (claim + earnings), admin (computed stats)
- **Stripe** — Checkout, Connect onboard, webhooks → `data/orders.json` (see `docs/STRIPE_SETUP.md`)
- **Supabase-ready** — `supabase/migrations/001_initial.sql`, stubs in `src/lib/supabase/`

## Quick start

```bash
npm install
npm run dev
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run fetch-assets` | Pull restaurant hero images from official sites |

## Demo vs live payments

Without Stripe keys, checkout uses **demo mode** (localStorage + file store). Add keys per `.env.example` and `docs/STRIPE_SETUP.md` for live Checkout + Connect.
