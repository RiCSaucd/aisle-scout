import { createFileRoute } from "@tanstack/react-router";
import { LOCALS, STORES, STORE_KIND_LABEL } from "@/lib/grocery/stores";
import { MARKET_CITY, MARKET_ZIP, STORE_KINDS } from "@/lib/grocery/types";
import { useGroceryStore } from "@/lib/grocery/store";
import { DietBar } from "@/components/grocery/diet-bar";
import { StoreMark } from "@/components/grocery/store-mark";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/stores")({
  component: StoresPage,
  head: () => ({
    meta: [{ title: "Stores · Aisle Scout" }],
  }),
});

function StoresPage() {
  const includeFar = useGroceryStore((s) => s.includeFar);
  const setIncludeFar = useGroceryStore((s) => s.setIncludeFar);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Market {MARKET_ZIP} · {MARKET_CITY}
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight">Where 32080 actually shops.</h1>
        <p className="max-w-xl text-muted-foreground">
          Groceries, pharmacies, dollar stores, wine and spirits, and the 24-hour c-stores on Anastasia Island — plus
          Costco and Sam’s Club as bulk trips. Other zips get their own book when someone uses Aisle Scout there. This
          one is yours.
        </p>
      </header>

      <DietBar />

      <label className="flex h-12 items-center gap-3 rounded-xl border border-border bg-card px-4 text-sm">
        <Checkbox checked={includeFar} onCheckedChange={(v) => setIncludeFar(v === true)} />
        Rank Costco (19 mi) and Sam’s (38 mi) in trip plans. They’re cheaper on bulk — not on a milk run.
      </label>

      {STORE_KINDS.map((kind) => {
        const group = STORES.filter((s) => s.kind === kind);
        if (group.length === 0) return null;
        return (
          <section key={kind} className="space-y-3">
            <h2 className="font-display text-2xl font-medium">{STORE_KIND_LABEL[kind]}</h2>
            <div className="grid gap-3">
              {group.map((store) => (
                <Card key={store.id} className={store.far ? "border-dashed" : undefined}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <StoreMark storeId={store.id} />
                      </CardTitle>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary">{store.miles} mi</Badge>
                        {store.membership ? <Badge variant="warn">Membership</Badge> : null}
                        {store.bulk ? <Badge variant="secondary">Bulk</Badge> : null}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{store.tagline}</p>
                    <p className="text-sm">{store.sells}</p>
                    <p className="text-xs text-muted-foreground">{store.hours}</p>
                    <ul className="space-y-1.5">
                      {store.locations.map((loc) => (
                        <li key={loc.address} className="text-sm">
                          <span className="font-medium">{loc.name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            · {loc.address}, {loc.city} {loc.zip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-medium">Also on the island</h2>
        <p className="text-sm text-muted-foreground">
          On the map, not on the chain price book.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {LOCALS.map((loc) => (
            <Card key={loc.name}>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{loc.name}</p>
                  <Badge variant="secondary">{loc.kind}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {loc.address} · {loc.city}
                </p>
                <p className="mt-2 text-sm">{loc.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}