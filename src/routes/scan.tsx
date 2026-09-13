import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Check, Pin, Refrigerator, Warehouse } from "lucide-react";
import { toast } from "sonner";
import type { CatalogItem } from "@/lib/grocery/catalog";
import { formatMoney } from "@/lib/grocery/format";
import { cheapestStore, regularPrice, shelfPrice } from "@/lib/grocery/pricing";
import { scanVerdict } from "@/lib/grocery/scan";
import { upcFor } from "@/lib/grocery/barcodes";
import { STORES, STORE_MAP } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { usePriceContext } from "@/lib/grocery/hooks";
import { addDaysISO, shelfLifeDays, todayISO } from "@/lib/grocery/shelf-life";
import type { PantryLocation, StoreId } from "@/lib/grocery/types";
import { STORE_IDS } from "@/lib/grocery/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PriceGrid } from "@/components/grocery/price-grid";
import { PriceScanner } from "@/components/grocery/price-scanner";
import { StoreMark } from "@/components/grocery/store-mark";
import { cn } from "@/lib/utils";

type Search = { store?: string };

export const Route = createFileRoute("/scan")({
  component: ScanPage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    store: typeof s.store === "string" ? s.store : undefined,
  }),
  head: () => ({
    meta: [{ title: "Scan · Aisle Scout" }],
  }),
});

function isStoreId(v: string | undefined): v is StoreId {
  return !!v && (STORE_IDS as readonly string[]).includes(v);
}

function ScanPage() {
  const search = Route.useSearch();
  const ctx = usePriceContext();
  const lastStoreId = useGroceryStore((s) => s.lastStoreId);
  const setLastStoreId = useGroceryStore((s) => s.setLastStoreId);
  const logPrices = useGroceryStore((s) => s.logPrices);
  const addToList = useGroceryStore((s) => s.addToList);
  const list = useGroceryStore((s) => s.list);
  const toggleChecked = useGroceryStore((s) => s.toggleChecked);
  const logs = useGroceryStore((s) => s.logs);
  const watched = useGroceryStore((s) => s.watched);
  const staples = useGroceryStore((s) => s.staples);
  const toggleWatched = useGroceryStore((s) => s.toggleWatched);
  const toggleStaple = useGroceryStore((s) => s.toggleStaple);
  const addInventory = useGroceryStore((s) => s.addInventory);
  const includeFarms = useGroceryStore((s) => s.includeFarms);
  const includeFar = useGroceryStore((s) => s.includeFar);

  const storeId: StoreId = lastStoreId;
  const [hit, setHit] = useState<CatalogItem | null>(null);
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (isStoreId(search.store) && search.store !== lastStoreId) {
      setLastStoreId(search.store);
    }
  }, [search.store, lastStoreId, setLastStoreId]);

  useEffect(() => {
    if (!hit) return;
    document.getElementById("scan-hit")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hit]);

  const book = hit ? shelfPrice(hit.id, storeId, ctx) ?? regularPrice(hit.id, storeId) : null;

  useEffect(() => {
    if (!hit) return;
    const listed = shelfPrice(hit.id, storeId, ctx) ?? regularPrice(hit.id, storeId);
    setPrice(listed != null ? listed.toFixed(2) : "");
  }, [hit, storeId, ctx]);

  const scanned = Number(price);
  const verdict = useMemo(() => {
    if (!hit || !Number.isFinite(scanned) || scanned <= 0) return null;
    return scanVerdict(hit.id, storeId, scanned, ctx, logs);
  }, [hit, storeId, scanned, ctx, logs]);

  const onList = hit ? list.find((i) => i.productId === hit.id && !i.checked) : undefined;
  const best = hit ? cheapestStore(hit.id, 1, ctx) : null;

  function logCurrent() {
    if (!hit || !Number.isFinite(scanned) || scanned <= 0) {
      toast.error("Enter the shelf price");
      return;
    }
    logPrices([
      {
        productId: hit.id,
        storeId,
        price: scanned,
        note: "scanned",
      },
    ]);
    toast.success(`Logged ${hit.name} at ${STORE_MAP[storeId].short}`);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          In the aisle
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight">Price scanner</h1>
        <p className="max-w-xl text-muted-foreground">
          Scan the UPC, type the digits, or tap a sample barcode. Log the shelf price, then put the
          item in the fridge or the cabinet so stock stays current.
        </p>
      </header>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          I'm at
        </p>
        <div className="flex flex-wrap gap-2">
          {STORES.filter((store) => {
            if (store.kind === "farm") return includeFarms;
            if (store.far) return includeFar;
            return true;
          }).map((store) => {
            const active = store.id === storeId;
            return (
              <button
                key={store.id}
                type="button"
                onClick={() => setLastStoreId(store.id)}
                className={cn(
                  "h-11 rounded-full px-4 text-sm font-medium",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted",
                )}
              >
                {store.short}
                {store.far ? ` · ${store.miles} mi` : ""}
              </button>
            );
          })}
        </div>
      </div>

      {hit ? (
        <Card
            id="scan-hit"
            className={verdict?.tone === "best" ? "border-primary/30 bg-best-fill/40" : undefined}
          >
          <CardContent className="space-y-4 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-2xl font-medium">{hit.name}</p>
                <p className="text-sm text-muted-foreground">
                  {hit.brand ? `${hit.brand} · ` : ""}
                  {hit.size} · {upcFor(hit.id)}
                </p>
              </div>
              {verdict ? (
                <Badge variant={verdict.tone === "best" ? "best" : verdict.tone === "warn" ? "warn" : "secondary"}>
                  {verdict.label}
                </Badge>
              ) : null}
            </div>
            {verdict ? <p className="text-sm text-muted-foreground">{verdict.detail}</p> : null}

            <div className="flex flex-wrap gap-3 text-sm">
              <span>
                Book here{" "}
                <strong className="tabular-nums">{book != null ? formatMoney(book) : "—"}</strong>
              </span>
              {best ? (
                <span className="inline-flex items-center gap-1.5">
                  Cheapest <StoreMark storeId={best.storeId} size="sm" />
                  <strong className="tabular-nums">{formatMoney(best.quote.unitPrice)}</strong>
                </span>
              ) : null}
            </div>

            <PriceGrid productId={hit.id} qty={1} ctx={ctx} compact />

            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label htmlFor="scan-price">Shelf price</Label>
                <Input
                  id="scan-price"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1.5 h-12 font-mono text-lg tabular-nums"
                />
              </div>
              <Button className="h-12" onClick={logCurrent}>
                Log price
              </Button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {onList ? (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    toggleChecked(onList.id);
                    logCurrent();
                    toast.success("Checked off the list");
                    setHit(null);
                  }}
                >
                  <Check className="size-4" />
                  Check off list
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    addToList(hit.id, 1, storeId);
                    toast.success("Added to the list");
                  }}
                >
                  Add to list
                </Button>
              )}
              <Button
                variant={watched.includes(hit.id) ? "secondary" : "outline"}
                onClick={() => toggleWatched(hit.id)}
              >
                <Bell className="size-4" />
                {watched.includes(hit.id) ? "Watching" : "Watch"}
              </Button>
              <Button
                variant={staples.includes(hit.id) ? "secondary" : "outline"}
                onClick={() => toggleStaple(hit.id)}
              >
                <Pin className="size-4" />
                {staples.includes(hit.id) ? "Staple" : "Pin staple"}
              </Button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const loc: PantryLocation =
                    hit.category === "frozen"
                      ? "freezer"
                      : hit.category === "produce" || hit.category === "dairy" || hit.category === "meat"
                        ? "fridge"
                        : "pantry";
                  addInventory({
                    productId: hit.id,
                    qty: 1,
                    location: loc === "pantry" ? "fridge" : loc,
                    expiresOn: addDaysISO(todayISO(), shelfLifeDays(hit.category, loc === "pantry" ? "fridge" : loc)),
                    lowAt: 1,
                  });
                  toast.success(`In the fridge · ${hit.name}`);
                }}
              >
                <Refrigerator className="size-4" />
                Put in fridge
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  addInventory({
                    productId: hit.id,
                    qty: 1,
                    location: "pantry",
                    expiresOn: addDaysISO(todayISO(), shelfLifeDays(hit.category, "pantry")),
                    lowAt: 1,
                  });
                  toast.success(`In the cabinet · ${hit.name}`);
                }}
              >
                <Warehouse className="size-4" />
                Put in cabinet
              </Button>
            </div>
            <Button variant="ghost" className="w-full" onClick={() => setHit(null)}>
              Scan next
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <PriceScanner
        onHit={(product) => {
          setHit(product);
        }}
      />

      <p className="text-sm text-muted-foreground">
        Need the whole shelf typed in?{" "}
        <Link to="/log" className="font-medium text-primary">
          Log a trip
        </Link>
        {" · "}
        <Link to="/list" className="font-medium text-primary">
          Open the list
        </Link>
      </p>
    </div>
  );
}
