import type { Category, PantryLocation } from "./types";

export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDaysISO(start: string, days: number): string {
  const [y, m, d] = start.split("-").map(Number);
  const dt = new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + days);
  return todayISO(dt);
}

export function daysUntil(iso: string, now = todayISO()): number {
  const a = Date.parse(`${iso}T12:00:00`);
  const b = Date.parse(`${now}T12:00:00`);
  return Math.round((a - b) / 86400000);
}

export function shelfLifeDays(category: Category, location: PantryLocation): number {
  if (location === "freezer") return 90;
  if (location === "pantry") {
    if (category === "produce") return 7;
    if (category === "bakery") return 5;
    return 120;
  }
  switch (category) {
    case "produce":
      return 5;
    case "dairy":
      return 10;
    case "meat":
      return 3;
    case "bakery":
      return 4;
    case "frozen":
      return 2;
    default:
      return 14;
  }
}

export type ExpiryStatus = "expired" | "tonight" | "soon" | "ok";

export function expiryStatus(expiresOn: string | undefined, now = todayISO()): ExpiryStatus {
  if (!expiresOn) return "ok";
  const n = daysUntil(expiresOn, now);
  if (n < 0) return "expired";
  if (n <= 1) return "tonight";
  if (n <= 3) return "soon";
  return "ok";
}
