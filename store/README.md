# Aisle Scout on the App Store and Google Play

The live app is a PWA (Add to Home Screen works today). Native store listings wrap that same app with **Capacitor**.

| | Apple | Google |
| --- | --- | --- |
| Account | [Apple Developer](https://developer.apple.com/programs/) — $99/year | [Play Console](https://play.google.com/console) — $25 once |
| ID | `com.aislescout.app` | `com.aislescout.app` |
| Name | Aisle Scout | Aisle Scout |
| Category | Shopping | Shopping |
| Age | 13+ | Everyone |

## One-time native projects

On a Mac with Xcode 16+ and Android Studio:

```bash
npm install
npx cap add ios
npx cap add android
npm run build
npx cap sync
npx cap open ios
npx cap open android
```

Point the WebView at your hosted Aisle Scout URL (Grok deploy or Vercel) in `capacitor.config.ts` under `server.url` so grocery prices update without a store resubmit.

## Store copy

**Subtitle:** Compare 32080 grocery prices in the aisle.

**Description:**
Aisle Scout is the St. Augustine Beach grocery book. Scan a shelf tag, snap the fridge, and see who wins this week — Aldi produce, Publix BOGO, Walmart rollback, farm stalls, or ship-it with Walmart+. USDA Organic and local markets are a toggle. Your list and pantry stay on the phone.

**Privacy URL:** `/legal` on the live site (required).

**Support:** GitHub issues on RiCSaucd/aisle-scout.

## Screenshots

Use the home aisle (2-column product photos), Scan, List, and Ship screens at iPhone 6.7" and Pixel 6 sizes. No fake store logos.

## You still need

Apple and Google will not list a binary from this chat. After `cap open`, archive in Xcode / bundle in Android Studio, then submit. Capacitor plugins already wired: StatusBar, SplashScreen.
