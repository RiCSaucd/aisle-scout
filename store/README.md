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

Full checklist, listing copy and every Play Console form answer: **[google-play.md](google-play.md)**.

1. Make an upload key once, keep it safe (losing it means a Play support ticket):
   ```bash
   keytool -genkeypair -v -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Add repo secrets: `ANDROID_KEYSTORE_BASE64` (`base64 -w0 upload.jks`), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
   Locally, put the same four values in a gitignored `keystore.properties` (`storeFile`, `storePassword`, `keyAlias`, `keyPassword`).
3. Run **Actions → Mobile**, download `app-release.aab`, and upload it to an **Internal testing** track in Play Console. The version code is the run number, so each upload is higher.
4. Listing assets: `store/assets/play-icon-512.png`, `store/assets/play-feature-graphic-1024x500.png`, and the phone screenshots in `store/google-play/phone-screenshots/` (captured from the Kotlin app by `AppScreensTest`).
5. Data safety form: no account, no data shared; the camera is used on-device (ML Kit). Privacy URL: `https://aisle-scout.netlify.app/legal`.

New personal Play developer accounts must run a closed test with 12+ testers for 14 days before production.

## App Store (Capacitor shell in `ios/`)

The WebView loads `https://aisle-scout.netlify.app`, so price and deal updates ship without a resubmit. With no connection it shows `native/www/offline.html`. Camera and photo permission strings, the icon, and the launch screen are already in the project.

### Upload to TestFlight without a Mac

GitHub's Mac runners build, sign and upload the app. One-time setup, all in a browser:

1. **App record:** in [App Store Connect](https://appstoreconnect.apple.com) → **Apps → +  → New App**: platform iOS, name *Aisle Scout*, bundle ID `com.aislescout.app` (if it isn't in the list yet, register it under [Identifiers](https://developer.apple.com/account/resources/identifiers/list) first), any SKU such as `aislescout-ios`.
2. **API key:** App Store Connect → **Users and Access → Integrations → App Store Connect API → Team Keys → +**, access **Admin** (Xcode needs it to create the signing certificate). Download the `.p8` file — Apple only lets you download it once. Note the **Key ID** and the **Issuer ID** shown above the list.
3. **Team ID:** [developer.apple.com/account](https://developer.apple.com/account) → **Membership details → Team ID** (10 characters).
4. **GitHub secrets** (repo → Settings → Secrets and variables → Actions):
   - `APPLE_TEAM_ID` — the Team ID
   - `APP_STORE_CONNECT_KEY_ID` — the Key ID
   - `APP_STORE_CONNECT_ISSUER_ID` — the Issuer ID
   - `APP_STORE_CONNECT_KEY` — the whole text of the `.p8` file, including the `BEGIN`/`END` lines
5. **Run it:** Actions → **Mobile** → **Run workflow** → tick **Also archive the iPhone app and upload it to TestFlight**. The build number is the run number. The build shows up in App Store Connect → TestFlight after Apple finishes processing (usually 10–30 minutes).

### Or on a Mac with Xcode 16+

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
