# Open Source Integration Notes

## UberEatsClone (Codename One "Grub")

| Field | Value |
| --- | --- |
| Source | [sergeyCodenameOne/UberEatsClone](https://github.com/sergeyCodenameOne/UberEatsClone) |
| License | **Apache License 2.0** |
| Stack | Java / Codename One (Android, iOS, desktop, web) — **not** React Native |
| Fit for Eat76 | **UX patterns only** — no code copied; incompatible runtime |

### Assessment

The repo is a polished food-delivery *demo template* with no backend. It is **not** a drop-in for Eat76's Next.js 16 + TypeScript stack. Eat76 adopted interaction and layout ideas and rebuilt them in React with Eat76 branding, pricing ($1.76 / $4.76), and existing Stripe scaffolding unchanged.

### Patterns borrowed (ported to Next.js)

| Grub source | Eat76 implementation |
| --- | --- |
| `RestaurantView.java` — category tabs over menu | `MenuCategoryNav.tsx`, `lib/menu-categories.ts` |
| `FilterView.java` — cuisine category chips | `lib/cuisine-filters.ts`, cuisine chips in `OrderBrowse.tsx` |
| `HomeView.java` — "Popular" / top-rated horizontal row | `PopularNearYou.tsx` on browse page |
| `MainWindowOrdersView.java` — in-progress order steps | `OrderTracker.tsx`, `lib/order-tracking.ts`, `/order/track/[id]` |
| `OrderView.java` — cart sheet + line items | Existing `CartPanel.tsx` (slide-up drawer + desktop sidebar) |
| `SearchView.java` — search + filter bar | Sticky search + zone/cuisine filters in `OrderBrowse.tsx` |

### Not adopted

- Codename One UI components, Java models, auth/onboarding flows
- Promo codes, credit-card management, favorites (Eat76 uses Stripe Checkout instead)
- Grub color theme — Eat76 blue/red palette preserved
- Maps / location picker — Eat76 is 19348 zone-scoped

### Attribution

Per Apache 2.0, this project documents inspiration from the Grub demo. Reimplemented UI lives under `src/components/order/` and `src/lib/`. See also `src/lib/integrations.ts`.

Reference clone path (local, not committed): `C:\Users\coryg\Projects\eat76-reference\UberEatsClone`
