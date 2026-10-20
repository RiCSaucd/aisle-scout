import type { CapacitorConfig } from "@capacitor/cli";

/**
 * App Store shell. The WebView loads the live site so prices and deals update
 * without a store resubmit; `native/www/offline.html` shows when the phone has
 * no connection. Google Play ships the native Kotlin app in `app/` instead.
 */
const config: CapacitorConfig = {
  appId: "com.aislescout.app",
  appName: "Aisle Scout",
  webDir: "native/www",
  server: {
    url: "https://aisle-scout.netlify.app",
    errorPath: "offline.html",
  },
  ios: {
    contentInset: "never",
    backgroundColor: "#f5f5f7",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 400,
      backgroundColor: "#f5f5f7",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#f5f5f7",
    },
  },
};

export default config;
