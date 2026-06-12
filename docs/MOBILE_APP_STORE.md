# Eat76 Mobile and App Store Deployment Guide

This guide covers how to ship Eat76 on mobile web, Google Play, and the Apple App Store. Eat76 is a Next.js PWA deployed at **https://eat76.vercel.app**. Native store builds are **manual** (not run in CI).

---

## Current state (Phase 1 complete)

| Asset | Location |
|-------|----------|
| Web app manifest | `public/manifest.json` |
| PWA icons (192/512) | `public/icons/icon-*.png` |
| Service worker | `public/sw.js` |
| Offline fallback | `public/offline.html` |
| Privacy policy | `/privacy` |
| Terms of service | `/terms` |
| Account page | `/account` |
| Order tracking deep links | `/order/track/[id]` |
| Capacitor template | `capacitor.config.ts` |

Regenerate icons after logo changes:

```bash
npm run generate-pwa-icons
```

---

## Shared requirements (all store paths)

### Legal and support

- **Privacy policy:** https://eat76.vercel.app/privacy
- **Terms:** https://eat76.vercel.app/terms
- **Support email:** support@eat76.com
- **Privacy contact:** privacy@eat76.com

### App identity

- **App name:** Eat76
- **Bundle ID (recommended):** `com.eat76.app`
- **Theme color:** `#0047BA`
- **Icons:** `public/icons/icon-192.png`, `public/icons/icon-512.png`

### Screenshots (prepare before submission)

| Platform | Sizes (px) |
|----------|------------|
| Google Play phone | 1080 x 1920 (min 2) |
| Google Play 7" tablet | 1200 x 1920 (optional) |
| Google Play 10" tablet | 1600 x 2560 (optional) |
| App Store iPhone 6.7" | 1290 x 2796 |
| App Store iPhone 6.5" | 1284 x 2778 |
| App Store iPhone 5.5" | 1242 x 2208 |
| App Store iPad Pro 12.9" | 2048 x 2732 |

Capture flows: home, restaurant browse, menu customize, cart, confirmation, live tracking.

### Payments and compliance

- Checkout uses **Stripe** (hosted Checkout or demo mode). Disclose fees in-app and in store listing.
- Food delivery apps must describe how orders, refunds, and restaurant fulfillment work.
- Location: only request when needed (delivery address, driver tracking). Document in privacy policy.
- Do not claim Apple/Google in-app purchase for physical goods; Stripe for food orders is correct.

### Deep links

Order tracking URLs work today:

```
https://eat76.vercel.app/order/track/ORD-XXXX
```

For native wrappers, configure **Android App Links** and **iOS Universal Links** to the same paths (see Capacitor and TWA sections).

### Push notifications (future)

Use `@capacitor/push-notifications` with **Firebase Cloud Messaging** (Android) and **APNs** (iOS). Eat76 already records in-app notifications in local storage; push is a Phase 3 enhancement.

---

## Phase 1: PWA on mobile web (live now)

Users on Android Chrome and iOS Safari can install Eat76 to the home screen.

1. Deploy to HTTPS (Vercel production).
2. Confirm `manifest.json`, icons, and service worker load.
3. The in-app **Install Eat76** prompt appears when the browser fires `beforeinstallprompt` (mainly Android Chrome).

**iOS Safari:** Share → Add to Home Screen. Apple does not use `beforeinstallprompt`; `apple-mobile-web-app-capable` meta tags are set in `src/app/layout.tsx`.

**Cost:** $0  
**Timeline:** Already shipped with production deploy

---

## Phase 2: Capacitor wrapper (recommended bridge to stores)

Capacitor wraps the web app in a native shell. Eat76 includes `capacitor.config.ts` pointing at production.

### Setup (one time, on your machine)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init Eat76 com.eat76.app --web-dir=out
```

The repo template already defines `capacitor.config.ts`. For **URL mode** (no static export), keep:

```ts
server: {
  url: "https://eat76.vercel.app",
  cleartext: false,
}
```

For **bundled static** mode, export the site, sync, and remove `server.url`:

```bash
# Only if you adopt static export for the consumer shell
npm run build
npx cap sync
```

### Add platforms

```bash
npx cap add android
npx cap add ios
npx cap sync
```

Open native IDEs (manual builds only):

```bash
npx cap open android   # Android Studio
npx cap open ios       # Xcode (macOS required)
```

**Cost:** $0 for tooling; Apple Developer Program required for iOS distribution (below).  
**Timeline:** 1 to 3 days for first successful local builds

---

## Android: Google Play

Apple accepts PWAs only in limited cases. Android has three practical paths.

### Option 1: TWA (Trusted Web Activity) — fastest Android path (recommended for Play)

Wrap the **already-deployed PWA** with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) or `@nicolo-ribaudo/android-browser-helper`. The app is essentially Chrome showing your PWA full screen.

**Requirements:**

1. Production site on **HTTPS**
2. Valid **Web App Manifest** with `display: standalone`, icons 192 and 512
3. **Digital Asset Links** so Android verifies you own the domain

**Steps:**

1. Install Bubblewrap CLI: `npm i -g @bubblewrap/cli`
2. Initialize: `bubblewrap init --manifest https://eat76.vercel.app/manifest.json`
3. Set package name: `com.eat76.app`
4. Host `assetlinks.json` at:

   ```
   https://eat76.vercel.app/.well-known/assetlinks.json
   ```

   Generate the SHA-256 cert fingerprint from your Play signing key or upload key.

5. Build AAB: `bubblewrap build`
6. Create app in [Google Play Console](https://play.google.com/console)
7. Complete store listing, content rating, data safety form (link privacy URL)
8. Upload AAB, internal testing track, then production

**When to choose TWA:** You want the smallest native footprint and instant web updates without resubmitting for every UI change.

**Cost:** Google Play one-time registration **$25**  
**Timeline:** 3 to 7 days including review

### Option 2: Capacitor Android — full native shell

Use when you need plugins (push, biometrics, native share) or offline bundled assets.

**Steps:**

1. Complete Phase 2 Capacitor setup
2. `npx cap open android`
3. Create upload keystore:

   ```bash
   keytool -genkey -v -keystore eat76-upload.keystore -alias eat76 -keyalg RSA -keysize 2048 -validity 10000
   ```

4. Configure signing in Android Studio (Build → Generate Signed Bundle)
5. Build **Android App Bundle (AAB)**
6. Play Console: new app, listing, privacy policy URL, screenshots
7. Internal test → closed test → production

**Cost:** $25 Play registration  
**Timeline:** 1 to 2 weeks first release (includes keystore and listing setup)

### Option 3: React Native WebView shell

A minimal RN app with `react-native-webview` loading `https://eat76.vercel.app`.

**When to use:** You already have a React Native team and want a thin shell without Capacitor.

**Tradeoffs vs Capacitor:**

| | Capacitor | RN WebView |
|--|-----------|------------|
| Plugin ecosystem | Official Capacitor plugins | Manual native bridges |
| Web asset sync | `cap sync` | URL or manual bundle |
| Maintenance | Lower for web-first teams | Higher if you need native features |

**Recommendation:** Prefer **TWA for fastest Play listing**, or **Capacitor** if you are also shipping iOS from the same toolchain.

---

## Apple: App Store

**Apple does not accept a PWA alone** as a standard App Store listing. You need a **native wrapper** (Capacitor iOS is the recommended path for Eat76).

### Capacitor iOS steps

1. **Apple Developer Program:** enroll at [developer.apple.com](https://developer.apple.com) — **$99/year**
2. macOS with **Xcode** (latest stable)
3. `npx cap add ios && npx cap sync && npx cap open ios`
4. In Xcode:
   - Set **Bundle Identifier** `com.eat76.app`
   - Set **Display Name** Eat76
   - Add app icons (use `public/icons/icon-512.png` as source in Asset Catalog)
   - Signing & Capabilities: select your team
5. **App Store Connect:** create app, SKU, primary category **Food & Drink**
6. **Privacy Nutrition Labels:** match `/privacy` (email, purchase history, location if used)
7. **App Review notes** (food ordering):
   - Demo account or explain guest/demo checkout
   - Stripe test mode vs live mode
   - How to place a test order in 19348 delivery zone
   - Link to privacy and terms URLs
8. **TestFlight:** Archive in Xcode → Distribute → TestFlight. Invite internal testers.
9. Submit for review after beta validation.

### App Store guidelines highlights (food delivery)

- Clearly describe **fees** ($1.76 service, $4.76 delivery)
- **Stripe** for physical goods is allowed; do not use IAP for food
- Provide working **support contact** and refund policy
- If using location, explain why in review notes and privacy policy

**Cost:** $99/year Apple Developer  
**Timeline:** 2 to 4 weeks (account approval, first build, review)

---

## Recommendation for Eat76

| Phase | Action | Cost | Timeline |
|-------|--------|------|----------|
| **1** | PWA install on mobile web | $0 | Done |
| **2** | Capacitor project + URL mode to production | $0 | 1 to 3 days |
| **3a Android** | **TWA via Bubblewrap** for fastest Play Store | $25 | ~1 week |
| **3b iOS** | **Capacitor iOS** + TestFlight + App Review | $99/yr | 2 to 4 weeks |

**Total first-year estimate:** ~$124 plus your time for listings and screenshots.

### Suggested order of operations

1. Verify production PWA (manifest, SW, `/privacy`, `/terms`)
2. Ship **Android TWA** to validate store pipeline quickly
3. In parallel, set up **Capacitor iOS** and TestFlight
4. Add **Digital Asset Links** and **Universal Links** for `/order/track/*`
5. Later: `@capacitor/push-notifications` + Firebase/APNs

---

## Digital Asset Links template (TWA)

Create `public/.well-known/assetlinks.json` after you have your signing certificate fingerprint:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.eat76.app",
      "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
    }
  }
]
```

Deploy to Vercel so it is served at `https://eat76.vercel.app/.well-known/assetlinks.json`.

---

## CI note

**Do not** run `cap build`, Xcode archive, or Play upload in GitHub Actions unless you intentionally add signing secrets. This repo documents **manual** native release steps only. Web deploys continue via Vercel on push to `main`.

---

## Checklist before first store submission

- [ ] Production URL live with valid SSL
- [ ] `/privacy` and `/terms` linked in store listings
- [ ] support@eat76.com monitored
- [ ] Screenshots captured on phone and tablet
- [ ] App icons 512x512 uploaded
- [ ] Order flow tested end to end (browse → cart → confirm → track)
- [ ] Stripe live mode configured (or demo mode documented for review)
- [ ] Content rating / data safety questionnaires completed
- [ ] TestFlight or internal Play track tested by 2+ people

---

## Questions

Contact the Eat76 engineering owner or email **support@eat76.com** for listing copy and review demo credentials.
