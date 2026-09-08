import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CATALOG, CATEGORY_LABEL } from "@/lib/grocery/catalog";
import { CATEGORY_ORDER, formatMoney } from "@/lib/grocery/format";
import { cheapestStore, allQuotes } from "@/lib/grocery/pricing";
import { STORES, STORE_MAP } from "@/lib/grocery/stores";
import { usePriceContext } from "@/lib/grocery/hooks";
import { CATEGORIES, type Category, type StoreId } from "@/lib/grocery/types";
import { Input } from "@/components/ui/input";
import { FilterRow } from "@/components/grocery/filter-row";
import { PriceGrid } from "@/components/grocery/price-grid";
import { ProductSheet } from "@/components/grocery/product-sheet";
import { StoreMark } from "@/components/grocery/store-mark";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/prices")({
  component: PricesPage,
  head: () => ({
    meta: [{ title: "Prices · Aisle Scout" }],
  }),
});

function PricesPage() {
  const ctx = usePriceContext();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [winner, setWinner] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CATALOG.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (needle) {
        const hay = `${p.name} ${p.brand ?? ""} ${p.category}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      const best = cheapestStore(p.id, 1, ctx);
      if (winner !== "all" && best?.storeId !== winner) return false;
      return true;
    }).sort((a, b) => {
      if (a.category !== b.category) {
        return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
      }
      return a.name.localeCompare(b.name);
    });
  }, [q, category, winner, ctx]);

  const grouped = useMemo(() => {
    const map = new Map<Category, typeof rows>();
    for (const p of rows) {
      const list = map.get(p.category) ?? [];
      list.push(p);
      map.set(p.category, list);
    }
    return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => [c, map.get(c)!] as const);
  }, [rows]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-medium tracking-tight">Price book</h1>
        <p className="max-w-xl text-muted-foreground">
          The 32080 book — island grocers, pharmacies, dollar stores, ABC, US-1, and the warehouse clubs. Sage tile
          is the nearby win unless you turn clubs on.
        </p>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the book…"
          aria-label="Search prices"
          className="h-12"
        />
      </header>

      <FilterRow
        label="Category"
        value={category}
        onChange={setCategory}
        options={[
          { id: "all", label: "All" },
          ...CATEGORIES.map((c) => ({ id: c, label: CATEGORY_LABEL[c] })),
        ]}
      />
      <FilterRow
        label="Cheapest at"
        value={winner}
        onChange={setWinner}
        options={[
          { id: "all", label: "Any store" },
          ...STORES.map((s) => ({
            id: s.id,
            label: s.far ? `${s.short} · ${s.miles} mi` : s.short,
          })),
        ]}
      />

      <p className="text-sm text-muted-foreground">
        {rows.length} item{rows.length === 1 ? "" : "s"}
      </p>

      {grouped.map(([cat, items]) => (
        <section key={cat} className="space-y-3">
          <h2 className="font-display text-2xl font-medium">{CATEGORY_LABEL[cat]}</h2>
          <div className="grid gap-3">
            {items.map((p) => {
              const quotes = allQuotes(p.id, 1, ctx);
              const bestCost = Math.min(...quotes.map((x) => x.cost));
              const worstCost = Math.max(...quotes.map((x) => x.cost));
              const best = cheapestStore(p.id, 1, ctx);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setOpenId(p.id)}
                  className="rounded-xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-colors duration-150 hover:bg-muted/40"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.brand ? `${p.brand} · ` : ""}
                        {p.size}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {best ? <StoreMark storeId={best.storeId as StoreId} size="sm" /> : null}
                      {worstCost - bestCost > 0.2 ? (
                        <Badge variant="best">Save {formatMoney(worstCost - bestCost)}</Badge>
                      ) : null}
                    </div>
                  </div>
                  <PriceGrid productId={p.id} ctx={ctx} compact />
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          Nothing matches that filter.
        </p>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Sage tile is the win. Shelf prices include this week's BOGOs, Circle clips, and rollbacks. Logged trip
        prices override the book until you clear them.
      </p>

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
