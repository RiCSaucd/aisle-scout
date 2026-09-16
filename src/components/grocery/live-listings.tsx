import { useEffect, useState } from "react";
import { ExternalLink, Radio } from "lucide-react";
import { listingsForProduct, storefronts } from "@/lib/grocery/listings";
import { liveSourceStatus, type LiveSourceStatus } from "@/lib/grocery/live";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import { cheapestStore, type PriceContext } from "@/lib/grocery/pricing";
import { formatMoney } from "@/lib/grocery/format";
import { STORE_MAP } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { Badge } from "@/components/ui/badge";
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
  const [status, setStatus] = useState<LiveSourceStatus | null>(null);

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

  return (
    <section className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-primary" />
          <h2 className="font-display text-2xl font-semibold">Active listings</h2>
        </div>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {status?.note ??
            "We open Walmart, Instacart, Publix, Target, Aldi, and Flipp for 32080. We do not scrape those sites — their terms forbid it and the prices would lie. Your logged shelf tag is still the most accurate number in St. Augustine."}
        </p>
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
                    <Badge variant="warn">
                      You logged {formatMoney(log.price)} at {STORE_MAP[log.storeId].short}
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
