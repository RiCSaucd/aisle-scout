import { Link } from "@tanstack/react-router";
import { STORES, STORE_KIND_LABEL } from "@/lib/grocery/stores";
import { MARKET_ZIP } from "@/lib/grocery/types";
import { StoreMark } from "./store-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function StoreStrip() {
  const nearby = STORES.filter((s) => !s.far);
  const far = STORES.filter((s) => s.far);
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-medium">{MARKET_ZIP} stores</h2>
          <p className="text-sm text-muted-foreground">
            Island grocers, pharmacies, dollar stores, ABC, and late-night c-stores — plus the warehouse clubs a drive away.
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link to="/stores">Directory</Link>
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {nearby.map((store) => (
          <Card key={store.id}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between gap-2">
                <StoreMark storeId={store.id} />
                <Badge variant="secondary">{STORE_KIND_LABEL[store.kind]}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{store.tagline}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {store.miles} mi from {MARKET_ZIP} · {store.locations[0]?.address}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {far.map((store) => (
          <Card key={store.id} className="border-dashed">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between gap-2">
                <StoreMark storeId={store.id} />
                <Badge variant="warn">{store.miles} mi · bulk</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{store.tagline}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}