# Aisle Scout on the App Store and Google Play

| | Apple (App Store) | Google (Play) |
| --- | --- | --- |
| Project | `ios/` — Capacitor shell around the live site | `app/` — native Kotlin / Jetpack Compose app |
| Account | [Apple Developer](https://developer.apple.com/programs/) — $99/year | [Play Console](https://play.google.com/console) — $25 once |
| ID | `com.aislescout.app` | `com.aislescout.app` |
| Category | Shopping | Shopping |
| Devices | iPhone, portrait | Phones, Android 8.0+ |

CI (`.github/workflows/mobile.yml`) builds both on every PR that touches them. The Android job uploads the `.aab` and a debug `.apk` as a run artifact.

## Google Play (native app in `app/`)

1. Make an upload key once, keep it safe (losing it means a Play support ticket):
   ```bash
   keytool -genkeypair -v -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Add repo secrets: `ANDROID_KEYSTORE_BASE64` (`base64 -w0 upload.jks`), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
   Locally, put the same four values in a gitignored `keystore.properties` (`storeFile`, `storePassword`, `keyAlias`, `keyPassword`).
3. Run **Actions → Mobile**, download `app-release.aab`, and upload it to an **Internal testing** track in Play Console. The version code is the run number, so each upload is higher.
4. Listing assets: `store/assets/play-icon-512.png`, `store/assets/play-feature-graphic-1024x500.png`. Phone screenshots must come from the Kotlin app (it looks different from the web app).
5. Data safety form: no account, no data shared; the camera is used on-device (ML Kit). Privacy URL: `https://aisle-scout.netlify.app/legal`.

New personal Play developer accounts must run a closed test with 12+ testers for 14 days before production.

## App Store (Capacitor shell in `ios/`)

The WebView loads `https://aisle-scout.netlify.app`, so price and deal updates ship without a resubmit. With no connection it shows `native/www/offline.html`. Camera and photo permission strings, the icon, and the launch screen are already in the project.

On a Mac with Xcode 16+:

```bash
npm ci
npx cap sync ios
npx cap open ios
```

In Xcode: pick your team under **Signing & Capabilities**, then **Product → Archive → Distribute App → App Store Connect**. Use TestFlight before you submit.

App Store Connect listing:
- Icon: `store/assets/app-store-icon-1024.png`
- Screenshots (6.7", 1290×2796): `store/screenshots/iphone-6.7/`
- Privacy URL: `https://aisle-scout.netlify.app/legal`
- Encryption: already declared exempt in `Info.plist`.

**Review risk:** Apple can reject apps that are “just a website” (guideline 4.2). In review notes, point to the barcode scanner, fridge photo reading, offline list and pantry, and trip planning. If Apple rejects it anyway, the fix is a native iOS screen or two (scanner first), not a resubmit of the same build.

## Store copy

**Subtitle:** Compare 32080 grocery prices in the aisle.

**Description:**
Aisle Scout is the St. Augustine Beach grocery book. Scan a shelf tag, snap the fridge, and see who wins this week — Aldi produce, Publix BOGO, Walmart rollback, farm stalls, or ship-it with Walmart+. USDA Organic and local markets are a toggle. Your list and pantry stay on the phone.

**Support:** GitHub issues on RiCSaucd/aisle-scout.

## Still on you

Apple and Google only accept uploads from your developer accounts. Nothing here can submit for you.
