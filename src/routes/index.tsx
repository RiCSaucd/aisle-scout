import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, ScanBarcode, Ticket, TriangleAlert } from "lucide-react";
import { CATALOG, CATEGORY_LABEL, PRODUCT_MAP } from "@/lib/grocery/catalog";
import { EXPIRY_ALERT_BY, PROMOTIONS, WEEK_LABEL } from "@/lib/grocery/promotions";
import { cheapestStore, winCounts } from "@/lib/grocery/pricing";
import { formatMoney } from "@/lib/grocery/format";
import { STORE_MAP } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { usePriceContext } from "@/lib/grocery/hooks";
import { allPlans } from "@/lib/grocery/optimizer";
import { MARKET_ZIP } from "@/lib/grocery/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductSearch } from "@/components/grocery/product-search";
import { PriceGrid } from "@/components/grocery/price-grid";
import { ProductSheet } from "@/components/grocery/product-sheet";
import { StoreMark } from "@/components/grocery/store-mark";
import { StoreStrip } from "@/components/grocery/store-strip";

export const Route = createFileRoute("/")({ component: Home });

const FEATURED = [
  "strawberries",
  "bananas",
  "avocados",
  "eggs",
  "chicken-breast",
  "whole-milk",
  "shampoo",
  "beer-12",
];

function Home() {
  const ctx = usePriceContext();
  const inventory = useGroceryStore((s) => s.inventory);
  const list = useGroceryStore((s) => s.list);
  const watched = useGroceryStore((s) => s.watched);
  const [openId, setOpenId] = useState<string | null>(null);

  const wins = useMemo(() => winCounts(ctx), [ctx]);
  const winLeader = (Object.entries(wins) as [keyof typeof wins, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const plans = useMemo(() => allPlans(list, ctx), [list, ctx]);
  const bestPlan = plans[0];

  const alerts = inventory.filter((i) => {
    const expiring = i.expiresOn && i.expiresOn <= EXPIRY_ALERT_BY;
    const low = i.qty <= i.lowAt;
    return expiring || low;
  });

  const produceItems = CATALOG.filter((p) => p.category === "produce");
  const produceWins = produceItems.reduce((n, p) => {
    const best = cheapestStore(p.id, 1, ctx);
    return n + (best?.storeId === "aldi" ? 1 : 0);
  }, 0);

  const bogoCount = PROMOTIONS.filter((p) => p.kind === "bogo").length;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {MARKET_ZIP} · St. Augustine Beach · {WEEK_LABEL}
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          The cheapest basket this week.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          The 32080 book: Publix and Winn-Dixie on A1A, CVS, Walgreens, Dollar General, ABC, the US-1 grocers,
          and late-night c-stores. Costco and Sam’s are on it as bulk trips — they’re a haul from the beach.
        </p>
        <ProductSearch onPick={setOpenId} />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link to="/scan">
              <ScanBarcode className="size-4" />
              Scan a shelf tag
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/list" hash="blend">
              Paste a grocery list
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cheapest on</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-medium tabular-nums">{winLeader?.[1] ?? 0}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              items at {winLeader ? STORE_MAP[winLeader[0]].short : "—"} of {CATALOG.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aldi produce</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-medium tabular-nums">{produceWins}</p>
            <p className="mt-1 text-sm text-muted-foreground">of {produceItems.length} produce items this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Publix BOGOs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-medium tabular-nums">{bogoCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">active through Wednesday</p>
          </CardContent>
        </Card>
      </section>

      {bestPlan && list.some((i) => !i.checked) ? (
        <Card className="border-primary/20 bg-best-fill/40">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Your list, optimized</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{bestPlan.label}</p>
            </div>
            <Badge variant="best">{formatMoney(bestPlan.total)}</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {bestPlan.vsMostExpensive > 0
                ? `Saves ${formatMoney(bestPlan.vsMostExpensive)} versus shopping full price at the most expensive store.`
                : "Prices are tight this week — still worth clipping the Publix BOGOs."}
              {bestPlan.receivedExtra > 0
                ? ` BOGO extras: ${bestPlan.receivedExtra} free units.`
                : ""}
            </p>
            <Button asChild>
              <Link to="/list">
                Open list
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-medium">This week's staples</h2>
            <p className="text-sm text-muted-foreground">Sage tile is the nearby win. Clubs stay off until you ask.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/prices">All prices</Link>
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURED.map((id) => {
            const p = PRODUCT_MAP[id];
            if (!p) return null;
            const best = cheapestStore(id, 1, ctx);
            return (
              <button
                key={id}
                type="button"
                onClick={() => setOpenId(id)}
                className="rounded-xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-[transform,background-color] duration-150 hover:bg-muted/40"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.size} · {CATEGORY_LABEL[p.category]}
                    </div>
                  </div>
                  {best ? (
                    <StoreMark storeId={best.storeId} size="sm" />
                  ) : null}
                </div>
                <PriceGrid productId={id} ctx={ctx} compact />
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Ticket className="size-4 text-primary" />
            <CardTitle>Hot promotions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PROMOTIONS.filter((p) => watched.includes(p.productId))
              .concat(PROMOTIONS.filter((p) => !watched.includes(p.productId)))
              .slice(0, 6)
              .map((promo) => {
              const product = PRODUCT_MAP[promo.productId];
              const watching = watched.includes(promo.productId);
              return (
                <button
                  key={promo.id}
                  type="button"
                  className="flex w-full items-start justify-between gap-3 rounded-lg px-1 py-1 text-left hover:bg-muted/50"
                  onClick={() => setOpenId(promo.productId)}
                >
                  <div>
                    <div className="text-sm font-medium">{product?.name}</div>
                    <div className="text-xs text-muted-foreground">{promo.details}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="deal">{promo.label}</Badge>
                    {watching ? <Badge variant="warn">Watching</Badge> : null}
                  </div>
                </button>
              );
            })}
            <Button variant="outline" asChild className="w-full">
              <Link to="/deals">All deals</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Leaf className="size-4 text-primary" />
            <CardTitle>Pantry watch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing running low.</p>
            ) : (
              alerts.slice(0, 6).map((item) => {
                const product = PRODUCT_MAP[item.productId];
                const expiring = item.expiresOn && item.expiresOn <= EXPIRY_ALERT_BY;
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {expiring ? <TriangleAlert className="size-4 text-warn" /> : null}
                      <div>
                        <div className="text-sm font-medium">{product?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.qty} left
                          {item.expiresOn ? ` · use by ${item.expiresOn.slice(5)}` : ""}
                        </div>
                      </div>
                    </div>
                    <Badge variant={expiring ? "warn" : "secondary"}>
                      {expiring ? "Expiring" : "Low"}
                    </Badge>
                  </div>
                );
              })
            )}
            <Button variant="outline" asChild className="w-full">
              <Link to="/pantry">Open pantry</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <StoreStrip />

      <ProductSheet
        productId={openId}
        ctx={ctx}
        open={!!openId}
        onOpenChange={(o) => {
          if (!o) setOpenId(null);
        }}
      />
    </div>
  );
}
