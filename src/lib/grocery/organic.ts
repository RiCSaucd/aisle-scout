import { CATALOG, PRODUCT_MAP, type CatalogItem } from "./catalog";
import type { Category, Cert } from "./types";

export const FOOD_CATEGORIES: Category[] = [
  "produce",
  "dairy",
  "meat",
  "bakery",
  "pantry",
  "frozen",
  "beverages",
];

export function certOf(p: CatalogItem): Cert {
  return p.cert ?? "conventional";
}

export function isFood(p: CatalogItem): boolean {
  return FOOD_CATEGORIES.includes(p.category);
}

export function organicTwinId(productId: string): string | null {
  const p = PRODUCT_MAP[productId];
  if (!p) return null;
  if (certOf(p) === "usda-organic") return p.id;
  const twin = CATALOG.find((x) => x.twinOf === productId && certOf(x) === "usda-organic");
  return twin?.id ?? null;
}

export function swapToOrganic(productId: string): string {
  return organicTwinId(productId) ?? productId;
}

export function catalogForPrefs(organicOnly: boolean): CatalogItem[] {
  if (!organicOnly) {
    return CATALOG.filter((p) => !(certOf(p) === "usda-organic" && p.twinOf));
  }
  return CATALOG.filter((p) => {
    if (!isFood(p)) return true;
    return certOf(p) === "usda-organic";
  });
}

export function certLabel(cert: Cert): string {
  if (cert === "usda-organic") return "USDA Organic";
  if (cert === "farm-fresh") return "Farm fresh";
  return "Conventional";
}
