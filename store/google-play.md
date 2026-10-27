# Aisle Scout on Google Play

The Android app in `app/` (Kotlin + Jetpack Compose, works offline, no account) is
ready to upload. This page is the checklist for the parts only the account owner
can do, plus every answer the Play Console forms ask for.

| | |
| --- | --- |
| Package name | `com.aislescout.app` — permanent after the first upload |
| Version | `1.0.0` (versionCode `1`) — raise `versionCode` in `app/build.gradle.kts` for every upload |
| Target SDK | 36 (Android 16), which Play requires for new apps |
| Min SDK | 26 (Android 8.0) |
| Permissions | Internet, network state, camera (barcode scanner) |
| Category | Shopping |
| Listing assets | `store/google-play/` (icon, feature graphic, 6 phone screenshots) |

## 1. Before you start

- **Redeploy the website.** Play checks the privacy policy URL. The live
  `https://aisle-scout.netlify.app/legal` still shows the September 19 version,
  without the "Android app" section that is on `main`. Deploy `main`, then confirm
  the page shows the Android section.
- **Create a Play Console account** at <https://play.google.com/console> ($25 once,
  plus identity verification).
  - **Personal accounts created after Nov 13, 2023** must run a **closed test with at
    least 12 testers, opted in for 14 days in a row**, before Production unlocks.
    Line up 12 people (Gmail/Google accounts) early.
  - Organization accounts (needs a D-U-N-S number) skip that test.

## 2. Make the upload key (once)

Run on any computer with Java, keep the file and both passwords somewhere safe
(a password manager), and never commit them:

```bash
keytool -genkeypair -v -keystore aisle-scout-upload.jks -alias upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

Google holds the real app-signing key (Play App Signing). This upload key only
proves uploads come from you; if you lose it, Play support can reset it.

## 3. Build the signed bundle (pick one)

**A. On GitHub (no Android tools needed).** In the repo's
Settings → Secrets and variables → Actions, add:

| Secret | Value |
| --- | --- |
| `AISLE_SCOUT_KEYSTORE_BASE64` | output of `base64 -w0 aisle-scout-upload.jks` (macOS: `base64 -i aisle-scout-upload.jks`) |
| `AISLE_SCOUT_KEYSTORE_PASSWORD` | keystore password |
| `AISLE_SCOUT_KEY_ALIAS` | `upload` |
| `AISLE_SCOUT_KEY_PASSWORD` | key password |

Then Actions → **Android** → Run workflow on `main`. Download the
`aisle-scout-release-signed` artifact; inside is `app-release.aab`.

**B. On your computer** (JDK 21 and the Android SDK, e.g. from Android Studio).
Create `keystore.properties` in the repo root (it is git-ignored):

```properties
storeFile=/full/path/to/aisle-scout-upload.jks
storePassword=…
keyAlias=upload
keyPassword=…
```

Then `./gradlew :app:bundleRelease` writes `app/build/outputs/bundle/release/app-release.aab`.

## 4. Create the app in Play Console

Create app → name **Aisle Scout**, default language English (US), **App**, **Free**.
Accept Play App Signing when you upload the first bundle. Upload to
**Internal testing** first (your own phone), then **Closed testing** (the 12
testers), then apply for **Production**.

### Store listing

**App name:** Aisle Scout

**Short description** (80 max):
Compare 32080 grocery shelf prices and BOGO deals before you shop.

**Full description:**

> Aisle Scout is a grocery price book for St. Augustine Beach (32080). See which
> nearby store has the lowest shelf price on everyday staples before you leave home.
>
> • Price book: compare audited shelf prices on staples across Aldi, Walmart,
>   Target and Publix.
> • Weekly deals: Publix BOGOs, Target Circle offers, Walmart Rollbacks and Aldi
>   Finds in one list. Clip the ones you want.
> • Shopping list: add staples or paste a recipe into the List Blender, and see how
>   much a multi-store trip saves.
> • Pantry: track what's in the fridge, freezer and pantry, and see which items
>   expire soon.
> • Barcode scanner: scan a product in the aisle to look up its prices. Scanning
>   happens on your phone; camera images are never saved or uploaded.
> • Local farms and markets, nearby stores, and delivery options.
>
> No account, no ads. Your list and pantry stay on your phone. Prices are a
> curated snapshot updated with app releases, so check the shelf tag in store.

Graphics: upload `store/google-play/icon-512.png`, `feature-graphic-1024x500.png`
and the PNGs in `phone-screenshots/` (1080×1920; Play needs 2–8).

### App content forms

| Form | Answer |
| --- | --- |
| Privacy policy | `https://aisle-scout.netlify.app/legal` (after the redeploy in step 1) |
| Ads | No, the app doesn't contain ads |
| App access | All functionality is available without special access |
| Content rating | Fill in the IARC questionnaire truthfully. The price book lists beer and wine, so answer **yes** to references to alcohol; that can raise the rating above Everyone. |
| Target audience | 18 and over is the simplest choice (alcohol listings). Don't pick ages under 13; that brings in the Families policy. |
| News app | No |
| Government app | No |
| Financial features | None |
| Health | None |

### Data safety

The app itself sends nothing anywhere. List, pantry and clipped deals stay on
the phone (cloud backup is turned off), and camera frames are processed on the
phone. The only data that leaves the phone is what Google's ML Kit barcode
library sends to Google, per [Google's ML Kit disclosure](https://developers.google.com/ml-kit/android-data-disclosure):

- **Does the app collect or share user data?** Yes (collected, by ML Kit).
- **Encrypted in transit?** Yes.
- **Way to request deletion?** The app has no account or server of its own;
  ML Kit's page doesn't describe deletion. Answer as you judge right; "No" is
  accurate for the app itself.
- **Data types:**

| Type | Collected | Shared | Optional? | Purpose |
| --- | --- | --- | --- | --- |
| App info and performance → Diagnostics | Yes | No | Required | Analytics |
| Device or other IDs | Yes | No | Required | Analytics |

Not collected: location, personal info, photos (on-device only), contacts,
messages, financial info, app activity.

## What's verified in this repo

- `./gradlew :app:bundleRelease` builds a 22 MB bundle, and signing was tested
  with a throwaway key (`jarsigner -verify` passed).
- `./gradlew :app:lintRelease`: 0 errors.
- `./gradlew :app:testDebugUnitTest` launches the real `MainActivity` on the JVM
  (Robolectric) and opens Home, Prices, Deals, List, My Pantry and Scan. A crash
  on any of them fails the build, and each screen is saved as a PNG; those are the
  screenshots in `phone-screenshots/`.
- The Android workflow repeats all of this on every PR that touches the app.

Not verified: running on a physical phone or emulator, including the live
camera scan. Install the internal-testing build on your own phone and try a
real barcode before inviting testers.
