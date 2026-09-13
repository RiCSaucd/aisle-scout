import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { CATALOG } from "@/lib/grocery/catalog";
import { formatMoney } from "@/lib/grocery/format";
import { certOf } from "@/lib/grocery/organic";
import { cheapestStore } from "@/lib/grocery/pricing";
import { STORES } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { usePriceContext } from "@/lib/grocery/hooks";
import { DietBar } from "@/components/grocery/diet-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreMark } from "@/components/grocery/store-mark";

export const Route = createFileRoute("/farms")({
  component: FarmsPage,
  head: () => ({
    meta: [{ title: "Farms · Aisle Scout" }],
  }),
});

function FarmsPage() {
  const ctx = usePriceContext();
  const includeFarms = useGroceryStore((s) => s.includeFarms);
  const setIncludeFarms = useGroceryStore((s) => s.setIncludeFarms);
  const addToList = useGroceryStore((s) => s.addToList);
  const farms = STORES.filter((s) => s.kind === "farm");
  const stall = CATALOG.filter((p) => certOf(p) !== "conventional").filter((p) =>
    farms.some((f) => p.regular[f.id] != null),
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          32080 · farm fresh
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight">Farms and markets</h1>
        <p className="max-w-xl text-muted-foreground">
          USDA Organic is the floor when that option is on. Farm-fresh stalls still count when you want local — the
          Pier on Wednesday, the Amphitheatre on Saturday, Sunday markets, Bee Hill, Hastings.
        </p>
      </header>

      <DietBar />

      {!includeFarms ? (
        <Button onClick={() => setIncludeFarms(true)}>Turn on local farms in trip plans</Button>
      ) : (
        <p className="text-sm text-muted-foreground">Farms are in the trip math now.</p>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-medium">This week’s stalls</h2>
        <ul className="grid gap-3">
          {stall.map((p) => {
            const best = cheapestStore(p.id, 1, { ...ctx, includeFarms: true });
            return (
              <li key={p.id}>
                <Card>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.brand} · {p.size}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={certOf(p) === "usda-organic" ? "best" : "secondary"}>
                        {certOf(p) === "usda-organic" ? "USDA Organic" : "Farm fresh"}
                      </Badge>
                      {best ? (
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <StoreMark storeId={best.storeId} size="sm" />
                          <strong className="tabular-nums">{formatMoney(best.quote.unitPrice)}</strong>
                        </span>
                      ) : null}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToList(p.id, 1, best?.storeId ?? "cheapest")}
                      >
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-medium">Where to go</h2>
        <div className="grid gap-3">
          {farms.map((store) => (
            <Card key={store.id} className={store.far ? "border-dashed" : undefined}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="size-4 text-best" />
                    {store.name}
                  </CardTitle>
                  <div className="flex gap-1.5">
                    <Badge variant="secondary">{store.miles} mi</Badge>
                    {store.seasonal ? <Badge variant="warn">Seasonal</Badge> : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{store.tagline}</p>
                <p>
                  {store.hours}
                  <span className="mx-1">·</span>
                  {store.locations[0]?.address}, {store.locations[0]?.city}
                </p>
                <p>{store.sells}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/scan" search={{ store: store.id }}>
                    Scan here
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
