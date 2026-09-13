import { PRODUCT_MAP, type CatalogItem } from "./catalog";
import { matchLine } from "./blend";
import { addDaysISO, shelfLifeDays, todayISO } from "./shelf-life";
import type { PantryLocation } from "./types";

export type SightedItem = {
  label: string;
  productId: string | null;
  qty: number;
  location: PantryLocation;
  expiresOn?: string;
  confidence: number;
  note?: string;
  alternatives: { id: string; name: string }[];
  keep: boolean;
};

export type RawSighting = {
  name: string;
  qty?: number;
  daysLeft?: number;
  condition?: string;
};

export function matchFood(name: string): {
  product: CatalogItem | null;
  score: number;
  alternatives: CatalogItem[];
} {
  const hit = matchLine({ raw: name, qty: 1, query: name });
  return { product: hit.product, score: hit.score, alternatives: hit.alternatives };
}

export function sightFromRaw(
  rows: RawSighting[],
  location: PantryLocation,
  now = todayISO(),
): SightedItem[] {
  const out: SightedItem[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    const { product, score, alternatives } = matchFood(row.name);
    const key = product?.id ?? `raw:${row.name.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const qty = Math.max(0.5, Math.round((row.qty ?? 1) * 10) / 10);
    let expiresOn: string | undefined;
    if (typeof row.daysLeft === "number") {
      expiresOn = addDaysISO(now, Math.max(0, Math.round(row.daysLeft)));
    } else if (product) {
      const days = shelfLifeDays(product.category, location);
      expiresOn = addDaysISO(now, days);
    }
    const soon =
      row.condition === "use-soon" || row.condition === "expired" || (row.daysLeft ?? 99) <= 3;
    out.push({
      label: product?.name ?? row.name,
      productId: product?.id ?? null,
      qty,
      location,
      expiresOn,
      confidence: score,
      note: soon ? "Use soon" : undefined,
      alternatives: alternatives.map((a) => ({ id: a.id, name: a.name })),
      keep: !!product,
    });
  }
  return out;
}

export const SAMPLE_FRIDGE: RawSighting[] = [
  { name: "whole milk", qty: 1, daysLeft: 6 },
  { name: "large eggs", qty: 1, daysLeft: 14 },
  { name: "baby spinach", qty: 1, daysLeft: 1, condition: "use-soon" },
  { name: "salted butter", qty: 1, daysLeft: 21 },
  { name: "shredded cheddar", qty: 1, daysLeft: 10 },
  { name: "greek yogurt", qty: 1, daysLeft: 5 },
  { name: "strawberries", qty: 1, daysLeft: 2, condition: "use-soon" },
  { name: "bananas", qty: 1, daysLeft: 2, condition: "use-soon" },
  { name: "chicken breast", qty: 1, daysLeft: 2, condition: "use-soon" },
  { name: "cream cheese", qty: 1, daysLeft: 12 },
];

export const SAMPLE_PANTRY: RawSighting[] = [
  { name: "spaghetti", qty: 2, daysLeft: 180 },
  { name: "marinara", qty: 1, daysLeft: 90 },
  { name: "white rice", qty: 1, daysLeft: 180 },
  { name: "black beans", qty: 2, daysLeft: 365 },
  { name: "coffee", qty: 1, daysLeft: 90 },
  { name: "oatmeal", qty: 1, daysLeft: 180 },
  { name: "olive oil", qty: 1, daysLeft: 180 },
  { name: "tuna", qty: 3, daysLeft: 365 },
  { name: "peanut butter", qty: 1, daysLeft: 180 },
];

export function catalogHint(): string {
  return Object.values(PRODUCT_MAP)
    .map((p) => `${p.id}:${p.name}`)
    .join("; ");
}
