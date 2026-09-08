import type { Category, PromotionKind, StoreId, Unit } from "./types";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatMoney(n: number): string {
  return money.format(n);
}

export function formatMoneyExact(n: number): string {
  if (n < 1) return `¢${Math.round(n * 100)}`;
  return money.format(n);
}

export function formatQty(qty: number, unit: Unit): string {
  if (unit === "dozen") return qty === 1 ? "1 dozen" : `${qty} dozen`;
  if (unit === "lb") return `${qty} lb`;
  if (unit === "gal") return qty === 1 ? "1 gal" : `${qty} gal`;
  if (qty === 1) return "1";
  return String(qty);
}

export const STORE_TONE: Record<StoreId, string> = {
  aldi: "text-aldi",
  walmart: "text-walmart",
  target: "text-target",
  publix: "text-publix",
  winndixie: "text-publix",
  cvs: "text-target",
  walgreens: "text-target",
  dollargeneral: "text-warn",
  dollartree: "text-aldi",
  abc: "text-target",
  cstore: "text-warn",
  costco: "text-aldi",
  sams: "text-walmart",
};

export const STORE_DOT: Record<StoreId, string> = {
  aldi: "bg-aldi",
  walmart: "bg-walmart",
  target: "bg-target",
  publix: "bg-publix",
  winndixie: "bg-publix",
  cvs: "bg-target",
  walgreens: "bg-target",
  dollargeneral: "bg-warn",
  dollartree: "bg-aldi",
  abc: "bg-target",
  cstore: "bg-warn",
  costco: "bg-aldi",
  sams: "bg-walmart",
};

export const KIND_LABEL: Record<PromotionKind, string> = {
  bogo: "BOGO",
  bogo50: "BOGO 50%",
  sale: "Sale",
  coupon: "Coupon",
  rollback: "Rollback",
  circle: "Circle",
  "aldi-finds": "Aldi Finds",
};

export const CATEGORY_ORDER: Category[] = [
  "produce",
  "dairy",
  "meat",
  "bakery",
  "pantry",
  "frozen",
  "beverages",
  "household",
  "personal",
  "alcohol",
];
