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
| `/order` | Customer ordering (demo) |
| `/order/[restaurant]` | Menu + cart |
| `/pricing` | Transparent pricing |
| `/restaurant-dashboard` | Mock restaurant admin |
| `/driver-dashboard` | Mock driver dispatch |
| `/admin` | Internal admin + projections |

## Deploy on Vercel

```bash
npx vercel
```

## Future integrations

See `src/lib/integrations.ts` and `TODO` comments throughout the codebase for Supabase and Stripe hooks.
