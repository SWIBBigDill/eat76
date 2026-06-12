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

## Future integrations

See `src/lib/integrations.ts` and `TODO` comments throughout the codebase for Supabase and Stripe hooks.
