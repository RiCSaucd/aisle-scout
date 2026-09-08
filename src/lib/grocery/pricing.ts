import { CATALOG, PRODUCT_MAP } from "./catalog";
import { isPromoActive, PROMOTIONS } from "./promotions";
import { STORE_MAP } from "./stores";
import type { Promotion, StoreId } from "./types";
import { STORE_IDS } from "./types";

export type PriceContext = {
  overrides: Record<string, number>;
  clippedPromoIds: string[];
  now?: Date;
  includeFar?: boolean;
};

export function compareStoreIds(ctx: PriceContext): StoreId[] {
  return STORE_IDS.filter((id) => {
    const store = STORE_MAP[id];
    if (store.kind === "convenience") return false;
    if (store.far && !ctx.includeFar) return false;
    return true;
  });
}

export function overrideKey(storeId: StoreId, productId: string): string {
  return `${storeId}:${productId}`;
}

export function regularPrice(productId: string, storeId: StoreId): number | null {
  const p = PRODUCT_MAP[productId];
  if (!p) return null;
  const n = p.regular[storeId];
  return typeof n === "number" ? n : null;
}

export function activePromo(
  productId: string,
  storeId: StoreId,
  ctx: PriceContext,
): Promotion | undefined {
  const now = ctx.now ?? new Date();
  return PROMOTIONS.find((promo) => {
    if (promo.productId !== productId || promo.storeId !== storeId) return false;
    if (!isPromoActive(promo, now)) return false;
    if (promo.requiresClip && !ctx.clippedPromoIds.includes(promo.id)) return false;
    return true;
  });
}

export function shelfPrice(
  productId: string,
  storeId: StoreId,
  ctx: PriceContext,
): number | null {
  const key = overrideKey(storeId, productId);
  if (key in ctx.overrides) return ctx.overrides[key]!;
  const promo = activePromo(productId, storeId, ctx);
  if (promo?.salePrice != null) return promo.salePrice;
  return regularPrice(productId, storeId);
}

export type LineQuote = {
  productId: string;
  storeId: StoreId;
  qty: number;
  unitPrice: number;
  cost: number;
  receivedQty: number;
  regular: number;
  saved: number;
  promo?: Promotion;
  note: string;
};

export function quoteLine(
  productId: string,
  storeId: StoreId,
  qty: number,
  ctx: PriceContext,
): LineQuote | null {
  const unit = shelfPrice(productId, storeId, ctx);
  const regular = regularPrice(productId, storeId);
  if (unit == null || regular == null || qty <= 0) return null;

  const promo = activePromo(productId, storeId, ctx);
  let cost = unit * qty;
  let receivedQty = qty;
  let note = "";

  if (promo?.kind === "bogo") {
    const paid = Math.ceil(qty / 2);
    receivedQty = paid * 2;
    cost = paid * unit;
    note = qty % 2 === 1 ? "BOGO — take the free extra" : "BOGO";
  } else if (promo?.kind === "bogo50") {
    const pairs = Math.floor(qty / 2);
    const rem = qty % 2;
    cost = pairs * (unit + unit * 0.5) + rem * unit;
    note = "BOGO 50% off";
  } else if (promo?.kind === "coupon" && promo.couponValue) {
    const times = promo.minQty ? Math.floor(qty / promo.minQty) : 1;
    cost = Math.max(0, unit * qty - promo.couponValue * times);
    note = `${promo.label} applied`;
  } else if (promo?.couponValue) {
    cost = Math.max(0, unit * qty - promo.couponValue);
    note = `${promo.label} applied`;
  } else if (promo?.minQty && qty < promo.minQty) {
    const fallback = regularPrice(productId, storeId) ?? unit;
    cost = fallback * qty;
    note = `Need ${promo.minQty}+ for ${promo.label}`;
  } else if (promo) {
    note = promo.label;
  }

  const saved = Math.max(0, regular * qty - cost);
  return {
    productId,
    storeId,
    qty,
    unitPrice: unit,
    cost,
    receivedQty,
    regular,
    saved,
    promo,
    note,
  };
}

export function cheapestStore(
  productId: string,
  qty: number,
  ctx: PriceContext,
): { storeId: StoreId; quote: LineQuote } | null {
  let best: { storeId: StoreId; quote: LineQuote } | null = null;
  for (const storeId of compareStoreIds(ctx)) {
    const quote = quoteLine(productId, storeId, qty, ctx);
    if (!quote) continue;
    if (!best || quote.cost < best.quote.cost - 0.0001) {
      best = { storeId, quote };
    }
  }
  return best;
}

export function allQuotes(
  productId: string,
  qty: number,
  ctx: PriceContext,
): LineQuote[] {
  return STORE_IDS.map((storeId) => quoteLine(productId, storeId, qty, ctx)).filter(
    (q): q is LineQuote => q != null,
  );
}

export function winCounts(ctx: PriceContext): Record<StoreId, number> {
  const counts = Object.fromEntries(STORE_IDS.map((id) => [id, 0])) as Record<StoreId, number>;
  for (const product of CATALOG) {
    const best = cheapestStore(product.id, 1, ctx);
    if (best) counts[best.storeId] += 1;
  }
  return counts;
}

export function withPromoClipped(ctx: PriceContext, promoId: string): PriceContext {
  if (ctx.clippedPromoIds.includes(promoId)) return ctx;
  return { ...ctx, clippedPromoIds: [...ctx.clippedPromoIds, promoId] };
}

export function dealQty(promo: Promotion): number {
  if (promo.kind === "bogo" || promo.kind === "bogo50") return 2;
  return Math.max(1, promo.minQty ?? 1);
}

export function dealComparison(
  promo: Promotion,
  ctx: PriceContext,
): {
  self: LineQuote | null;
  nextBest: LineQuote | null;
  beats: boolean;
  saveVsNext: number;
} {
  const qty = dealQty(promo);
  const preview = withPromoClipped(ctx, promo.id);
  const self = quoteLine(promo.productId, promo.storeId, qty, preview);
  let nextBest: LineQuote | null = null;
  for (const storeId of compareStoreIds(ctx)) {
    if (storeId === promo.storeId) continue;
    const q = quoteLine(promo.productId, storeId, qty, ctx);
    if (!q) continue;
    if (!nextBest || q.cost < nextBest.cost) nextBest = q;
  }
  const beats = !!(self && nextBest && self.cost + 0.004 < nextBest.cost);
  const saveVsNext = self && nextBest ? Math.max(0, nextBest.cost - self.cost) : 0;
  return { self, nextBest, beats, saveVsNext };
}

export function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function priceHistory(
  productId: string,
  storeId: StoreId,
  ctx: PriceContext,
): { week: string; price: number }[] {
  const regular = regularPrice(productId, storeId);
  if (regular == null) return [];
  const jitter = (hashId(`${productId}:${storeId}`) % 9) / 100;
  const current = shelfPrice(productId, storeId, ctx) ?? regular;
  const weeks = ["Aug 13", "Aug 20", "Aug 27", "Sep 3"];
  return weeks.map((week, i) => {
    if (i === 3) return { week, price: current };
    const wave = 1 + ((i % 2 === 0 ? 1 : -1) * jitter) + (3 - i) * 0.012;
    return { week, price: Math.round(regular * wave * 100) / 100 };
  });
}
