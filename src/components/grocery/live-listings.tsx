import { useEffect, useState } from "react";
import { ExternalLink, Radio, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { listingsForProduct, storefronts } from "@/lib/grocery/listings";
import {
  isShelfLog,
  liveSourceStatus,
  lookupWalmartAisle,
  type LiveSourceStatus,
} from "@/lib/grocery/live";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import { cheapestStore, type PriceContext } from "@/lib/grocery/pricing";
import { formatMoney } from "@/lib/grocery/format";
import { STORE_MAP } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AISLE = [
  "strawberries",
  "bananas",
  "avocados",
  "eggs",
  "chicken-breast",
  "whole-milk",
];

export function LiveListings({
  ctx,
  onOpen,
}: {
  ctx: PriceContext;
  onOpen: (id: string) => void;
}) {
  const logs = useGroceryStore((s) => s.logs);
  const applyLiveQuotes = useGroceryStore((s) => s.applyLiveQuotes);
  const [status, setStatus] = useState<LiveSourceStatus | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    liveSourceStatus()
      .then(setStatus)
      .catch(() => {
        setStatus({
          zip: "32080",
          walmartAffiliate: false,
          instacartPlatform: false,
          note: "Live pages are the store sites. Shelf logs still win.",
        });
      });
  }, []);

  async function refreshWalmart() {
    setBusy(true);
    try {
      const res = await lookupWalmartAisle({ data: { productIds: AISLE } });
      if (!res.ok) {
        toast.message(
          res.reason === "missing-keys"
            ? "Walmart I/O needs WALMART_CONSUMER_ID and WALMART_PRIVATE_KEY. Use the Walmart #579 chip until those keys are on the server."
            : "Walmart I/O didn’t return prices. Try the Walmart #579 chip.",
        );
        return;
      }
      const { applied, skipped } = applyLiveQuotes(res.quotes);
      toast.success(
        applied
          ? `Walmart I/O updated ${applied} · kept ${skipped} shelf log${skipped === 1 ? "" : "s"}`
          : skipped
            ? "Every Walmart price already has a shelf log — those win."
            : "No Walmart hits for this aisle.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="size-4 text-primary" />
            <h2 className="font-display text-2xl font-semibold">Active listings</h2>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {status?.note ??
              "Walmart #579 by UPC search, Instacart list push, and your scanned tags. The tag always wins."}
          </p>
        </div>
        <Button variant="outline" onClick={() => void refreshWalmart()} disabled={busy}>
          <RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} />
          {status?.walmartAffiliate ? "Refresh Walmart #579" : "Walmart #579 lookup"}
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {storefronts().map((s) => (
          <a
            key={s.id}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-card px-4 text-sm font-medium shadow-[var(--shadow-card)] hover:bg-muted"
          >
            {s.label}
            <ExternalLink className="size-3.5 text-muted-foreground" />
          </a>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {AISLE.map((id) => {
          const product = PRODUCT_MAP[id];
          if (!product) return null;
          const best = cheapestStore(id, 1, ctx);
          const log = logs
            .filter((l) => l.productId === id)
            .sort((a, b) => b.observedAt.localeCompare(a.observedAt))[0];
          const links = listingsForProduct(id).filter((l) => l.id !== "upc");
          const shelf = log && isShelfLog(log.note);
          return (
            <Card key={id}>
              <CardHeader className="pb-2">
                <button type="button" className="text-left" onClick={() => onOpen(id)}>
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">{product.size}</p>
                </button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {best ? (
                    <Badge variant="best">
                      Book {formatMoney(best.quote.unitPrice)} · {STORE_MAP[best.storeId].short}
                    </Badge>
                  ) : null}
                  {log ? (
                    <Badge variant={shelf ? "warn" : "deal"}>
                      {shelf ? "Shelf " : "Walmart I/O "}
                      {formatMoney(log.price)} at {STORE_MAP[log.storeId].short}
                    </Badge>
                  ) : (
                    <Badge>No shelf log yet</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {links.map((l) => (
                    <a
                      key={l.id}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center rounded-full bg-muted px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
