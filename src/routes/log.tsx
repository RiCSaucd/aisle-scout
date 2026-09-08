import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ScanBarcode } from "lucide-react";
import { CATALOG, CATEGORY_LABEL, PRODUCT_MAP } from "@/lib/grocery/catalog";
import { CATEGORY_ORDER, formatMoney } from "@/lib/grocery/format";
import { overrideKey, regularPrice, shelfPrice } from "@/lib/grocery/pricing";
import { STORES, STORE_MAP } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { usePriceContext } from "@/lib/grocery/hooks";
import { CATEGORIES, type StoreId } from "@/lib/grocery/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilterRow } from "@/components/grocery/filter-row";
import { StoreStrip } from "@/components/grocery/store-strip";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/log")({
  component: LogPage,
  head: () => ({
    meta: [{ title: "Log prices · Aisle Scout" }],
  }),
});

function LogPage() {
  const ctx = usePriceContext();
  const logPrices = useGroceryStore((s) => s.logPrices);
  const clearOverride = useGroceryStore((s) => s.clearOverride);
  const logs = useGroceryStore((s) => s.logs);
  const overrides = useGroceryStore((s) => s.overrides);
  const [storeId, setStoreId] = useState<StoreId>("aldi");
  const [category, setCategory] = useState<string>("produce");
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<Record<string, string>>({});

  const products = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CATALOG.filter((p) => {
      if (regularPrice(p.id, storeId) == null) return false;
      if (category !== "all" && p.category !== category) return false;
      if (needle) {
        const hay = `${p.name} ${p.brand ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (a.category !== b.category) {
        return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
      }
      return a.name.localeCompare(b.name);
    });
  }, [category, q, storeId]);

  const changed = Object.entries(draft).filter(([, v]) => v.trim() !== "");
  const storeLogs = logs.filter((l) => l.storeId === storeId).slice(0, 8);

  function save() {
    const entries = changed
      .map(([productId, raw]) => {
        const price = Number(raw);
        if (!Number.isFinite(price) || price <= 0) return null;
        return { productId, storeId, price };
      })
      .filter((e): e is { productId: string; storeId: StoreId; price: number } => e != null);
    if (entries.length === 0) {
      toast.error("Enter at least one price");
      return;
    }
    logPrices(entries);
    setDraft({});
    toast.success(`Logged ${entries.length} ${STORE_MAP[storeId].short} price${entries.length === 1 ? "" : "s"}`);
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-medium tracking-tight">Log a trip</h1>
        <p className="max-w-xl text-muted-foreground">
          Walk the aisle, type what you saw. Logged prices override the book until you clear them.
          Faster with the scanner if you're logging one UPC at a time.
        </p>
        <Button asChild>
          <Link to="/scan" search={{ store: storeId }}>
            <ScanBarcode className="size-4" />
            Open scanner
          </Link>
        </Button>
      </header>

      <div className="flex flex-wrap gap-2">
        {STORES.map((store) => {
          const active = store.id === storeId;
          return (
            <button
              key={store.id}
              type="button"
              onClick={() => {
                setStoreId(store.id);
                setCategory(store.id === "aldi" ? "produce" : "all");
              }}
              className={cn(
                "h-11 rounded-full px-4 text-sm font-medium transition-[border-color,background-color] duration-150",
                active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted",
              )}
            >
              {store.short}
              {store.far ? ` · ${store.miles} mi` : ""}
            </button>
          );
        })}
      </div>

      <FilterRow
        label="Category"
        value={category}
        onChange={setCategory}
        options={[
          { id: "all", label: "All" },
          ...CATEGORIES.map((c) => ({ id: c, label: CATEGORY_LABEL[c] })),
        ]}
      />

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Search ${STORE_MAP[storeId].short} items…`}
        aria-label="Search products to log"
        className="h-12"
      />

      <div className="grid gap-2">
        {products.map((p) => {
          const current = shelfPrice(p.id, storeId, ctx);
          const regular = regularPrice(p.id, storeId);
          const logged = overrideKey(storeId, p.id) in overrides;
          const value = draft[p.id] ?? "";
          return (
            <div
              key={p.id}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{p.name}</span>
                  {logged ? <Badge variant="best">Logged</Badge> : null}
                </div>
                <div className="text-xs text-muted-foreground">
                  {p.size}
                  {current != null ? ` · now ${formatMoney(current)}` : ""}
                  {regular != null && regular !== current ? ` · regular ${formatMoney(regular)}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  inputMode="decimal"
                  placeholder="New price"
                  aria-label={`Price for ${p.name}`}
                  className="h-11 w-28 tabular-nums"
                  value={value}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      [p.id]: e.target.value,
                    }))
                  }
                />
                {logged ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearOverride(storeId, p.id);
                      toast("Back to book price");
                    }}
                  >
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          No items in this slice of the book.
        </p>
      ) : null}

      {storeLogs.length > 0 ? (
        <Card>
          <CardContent className="pt-5">
            <h2 className="font-display text-lg font-medium">Recent {STORE_MAP[storeId].short} logs</h2>
            <ul className="mt-3 space-y-2">
              {storeLogs.map((log) => (
                <li key={log.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span>{PRODUCT_MAP[log.productId]?.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatMoney(log.price)} · {log.observedAt.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <StoreStrip />

      <div className="h-16" />
      <div className="fixed inset-x-0 bottom-14 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-sm lg:bottom-0 lg:left-56">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {changed.length === 0
              ? "Type prices as you walk the aisle"
              : `${changed.length} price${changed.length === 1 ? "" : "s"} ready`}
          </p>
          <Button onClick={save} disabled={changed.length === 0}>
            Save {STORE_MAP[storeId].short} prices
          </Button>
        </div>
      </div>
    </div>
  );
}
