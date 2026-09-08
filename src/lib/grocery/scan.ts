import { STORE_MAP } from "./stores";
import { cheapestStore, regularPrice, shelfPrice, type PriceContext } from "./pricing";
import type { PriceLog, StoreId } from "./types";

export type ScanVerdict = {
  book: number | null;
  cheapest: { storeId: StoreId; price: number } | null;
  lastPaid: number | null;
  deltaBook: number | null;
  vsCheapest: number | null;
  vsLast: number | null;
  label: string;
  tone: "best" | "warn" | "neutral";
  detail: string;
};

export function scanVerdict(
  productId: string,
  storeId: StoreId,
  scanned: number,
  ctx: PriceContext,
  logs: PriceLog[],
): ScanVerdict {
  const book = shelfPrice(productId, storeId, ctx) ?? regularPrice(productId, storeId);
  const best = cheapestStore(productId, 1, ctx);
  const last = logs.find((l) => l.productId === productId && l.storeId === storeId)?.price ?? null;
  const deltaBook = book != null ? Math.round((scanned - book) * 100) / 100 : null;
  const vsCheapest = best ? Math.round((scanned - best.quote.unitPrice) * 100) / 100 : null;
  const vsLast = last != null ? Math.round((scanned - last) * 100) / 100 : null;

  let label = "On the book";
  let tone: ScanVerdict["tone"] = "neutral";
  let detail = "Shelf matches what we already have.";

  if (book == null) {
    label = "Not in this store's book";
    tone = "warn";
    detail = "This store may not carry it — log anyway if you saw it.";
  } else if (deltaBook != null && deltaBook <= -0.1) {
    label = "Below the book";
    tone = "best";
    detail = `${formatDelta(-deltaBook)} cheaper than the listed price here. Log it.`;
  } else if (deltaBook != null && deltaBook >= 0.25) {
    label = "High vs the book";
    tone = "warn";
    detail = `${formatDelta(deltaBook)} more than we have listed. Double-check the tag.`;
  } else if (best && vsCheapest != null && vsCheapest >= 0.5 && best.storeId !== storeId) {
    label = "Cheaper nearby";
    tone = "warn";
    detail = `${formatDelta(vsCheapest)} more than ${STORE_MAP[best.storeId].short} at $${best.quote.unitPrice.toFixed(2)}.`;
  } else if (vsLast != null && vsLast <= -0.15) {
    label = "New low here";
    tone = "best";
    detail = `Last time you logged ${last!.toFixed(2)} at this store.`;
  } else if (vsLast != null && vsLast >= 0.25) {
    label = "Up since last trip";
    tone = "warn";
    detail = `You paid ${last!.toFixed(2)} last time.`;
  }

  return {
    book,
    cheapest: best ? { storeId: best.storeId, price: best.quote.unitPrice } : null,
    lastPaid: last,
    deltaBook,
    vsCheapest,
    vsLast,
    label,
    tone,
    detail,
  };
}

function formatDelta(n: number): string {
  return `$${Math.abs(n).toFixed(2)}`;
}
