import { useSyncExternalStore } from "react";

export const LIVE_APP_URL = "https://aisle-scout.netlify.app";

type CapacitorGlobal = { isNativePlatform?: () => boolean };

function isNativeApp(): boolean {
  const cap = (globalThis as { Capacitor?: CapacitorGlobal }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

const noopSubscribe = () => () => {};

/**
 * True inside the App Store / Play shell (Capacitor injects `window.Capacitor`).
 * Server render and hydration both see `false`, so there is no mismatch.
 */
export function useIsNativeApp(): boolean {
  return useSyncExternalStore(noopSubscribe, isNativeApp, () => false);
}

/**
 * The "Open the live app" links only make sense in a preview or another host:
 * hidden inside the native shell and on the live site itself.
 */
export function useShowLiveAppLink(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => !isNativeApp() && window.location.origin !== LIVE_APP_URL,
    () => true,
  );
}
