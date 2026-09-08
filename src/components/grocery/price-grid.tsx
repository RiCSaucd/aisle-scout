import { STORE_MAP } from "@/lib/grocery/stores";
import { formatMoney } from "@/lib/grocery/format";
import { allQuotes, type PriceContext } from "@/lib/grocery/pricing";
import { cn } from "@/lib/utils";

export function PriceGrid({
  productId,
  qty = 1,
  ctx,
  compact = false,
}: {
  productId: string;
  qty?: number;
  ctx: PriceContext;
  compact?: boolean;
}) {
  const quotes = allQuotes(productId, qty, ctx);
  if (quotes.length === 0) {
    return <p className="text-sm text-muted-foreground">Not on the 32080 book.</p>;
  }
  const best = Math.min(...quotes.map((q) => q.cost));
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
      {quotes.map((q) => {
        const store = STORE_MAP[q.storeId];
        const isBest = q.cost === best;
        return (
          <div
            key={q.storeId}
            className={cn(
              "rounded-md px-1.5 py-2 text-center",
              isBest ? "bg-best-fill text-best" : "bg-muted text-foreground",
            )}
          >
            <div
              className={cn(
                "text-[10px] uppercase tracking-wide",
                isBest ? "text-best" : "text-muted-foreground",
              )}
            >
              {store.short}
            </div>
            <div className={cn("font-medium tabular-nums", compact ? "text-xs" : "text-sm")}>
              {formatMoney(q.unitPrice)}
            </div>
            {store.far ? (
              <div className="mt-0.5 text-[10px] text-muted-foreground">{store.miles} mi</div>
            ) : null}
            {q.promo ? (
              <div className="mt-0.5 truncate text-[10px] font-medium">{q.promo.label}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}