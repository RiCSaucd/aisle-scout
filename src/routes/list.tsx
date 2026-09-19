import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ScanBarcode, ShoppingBag, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import { formatMoney } from "@/lib/grocery/format";
import { cheapestStore } from "@/lib/grocery/pricing";
import { STORE_MAP } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { usePriceContext } from "@/lib/grocery/hooks";
import { allPlans } from "@/lib/grocery/optimizer";
import { pushInstacartList } from "@/lib/grocery/live";
import { STORE_IDS, type StoreId } from "@/lib/grocery/types";
import { cn, copyText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSearch } from "@/components/grocery/product-search";
import { ProductSheet } from "@/components/grocery/product-sheet";
import { BlendPanel } from "@/components/grocery/blend-panel";
import { DietBar } from "@/components/grocery/diet-bar";
import { TripPlanDetail, TripPlanPicker } from "@/components/grocery/trip-plan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/list")({
  component: ListPage,
  head: () => ({
    meta: [{ title: "List · Aisle Scout" }],
  }),
});

function ListPage() {
  const ctx = usePriceContext();
  const list = useGroceryStore((s) => s.list);
  const addToList = useGroceryStore((s) => s.addToList);
  const updateListItem = useGroceryStore((s) => s.updateListItem);
  const removeListItem = useGroceryStore((s) => s.removeListItem);
  const toggleChecked = useGroceryStore((s) => s.toggleChecked);
  const clearChecked = useGroceryStore((s) => s.clearChecked);
  const restockFromList = useGroceryStore((s) => s.restockFromList);
  const includeFar = useGroceryStore((s) => s.includeFar);
  const setIncludeFar = useGroceryStore((s) => s.setIncludeFar);
  const lastStoreId = useGroceryStore((s) => s.lastStoreId);
  const setLastStoreId = useGroceryStore((s) => s.setLastStoreId);
  const addMissingStaples = useGroceryStore((s) => s.addMissingStaples);
  const budget = useGroceryStore((s) => s.budget);
  const setBudget = useGroceryStore((s) => s.setBudget);
  const [shopOnly, setShopOnly] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [planIndex, setPlanIndex] = useState(0);
  const [pushing, setPushing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#blend") return;
    document.getElementById("blend")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const plans = useMemo(() => allPlans(list, ctx), [list, ctx]);
  const selected = plans[Math.min(planIndex, Math.max(0, plans.length - 1))];
  const active = list.filter((i) => !i.checked);
  const checked = list.filter((i) => i.checked);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-medium tracking-tight">Shopping list</h1>
        <p className="max-w-xl text-muted-foreground">
          Paste the list you already made, or add one item at a time. Scan in the aisle to check
          prices and check items off.
        </p>
        <ProductSearch
          onPick={(id) => {
            addToList(id, 1);
            toast.success(`Added ${PRODUCT_MAP[id]?.name ?? "item"}`);
          }}
          placeholder="Add milk, strawberries, Tide…"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link to="/scan" search={{ store: lastStoreId }}>
              <ScanBarcode className="size-4" />
              Scan at {STORE_MAP[lastStoreId].short}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/ship">
              <Truck className="size-4" />
              Ship this list
            </Link>
          </Button>
          <Button
            variant="outline"
            disabled={pushing || active.length === 0}
            onClick={() => {
              void (async () => {
                setPushing(true);
                const popup = window.open("about:blank", "_blank", "noreferrer");
                try {
                  const res = await pushInstacartList({
                    data: {
                      title: "Aisle Scout · 32080",
                      items: active.map((i) => ({ productId: i.productId, qty: i.qty })),
                    },
                  });
                  const dest = res.ok ? res.url : res.fallbackUrl;
                  if (popup) popup.location.replace(dest);
                  else window.open(dest, "_blank", "noreferrer");
                  if (res.ok) {
                    toast.success("List is on Instacart");
                    return;
                  }
                  const lines = active
                    .map((i) => `${i.qty} × ${PRODUCT_MAP[i.productId]?.name ?? i.productId}`)
                    .join("\n");
                  const copied = await copyText(lines);
                  toast.message(
                    res.reason === "missing-keys"
                      ? copied
                        ? "No INSTACART_API_KEY yet — list copied, Instacart opened for 32080."
                        : "Instacart opened for 32080. Copy the list from Aisle Scout if the tab is blank."
                      : copied
                        ? "Instacart didn’t accept the list — copied it and opened 32080."
                        : "Instacart opened for 32080. Paste your list there if asked.",
                  );
                } finally {
                  setPushing(false);
                }
              })();
            }}
          >
            <ShoppingBag className="size-4" />
            {pushing ? "Sending…" : "Send to Instacart"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const n = addMissingStaples();
              toast.success(
                n === 0 ? "Staples are already on the list or in the pantry" : `Added ${n} staple${n === 1 ? "" : "s"}`,
              );
            }}
          >
            Add missing staples
          </Button>
        </div>
      </header>

      <DietBar />

      <BlendPanel ctx={ctx} />

      {active.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          List is empty. Paste one above, search a staple, or open Deals and add a BOGO.
        </p>
      ) : (
        <>
          {selected ? (
            <section className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-medium">Trip plan</h2>
                <p className="text-sm text-muted-foreground">
                  {selected.vsMostExpensive > 0
                    ? `${formatMoney(selected.vsMostExpensive)} under full-price at the most expensive nearby store.`
                    : "Prices are close this week."}
                </p>
              </div>
              <label className="flex h-11 items-center gap-2 text-sm">
                <Checkbox
                  checked={includeFar}
                  onCheckedChange={(v) => setIncludeFar(v === true)}
                />
                Include Costco (19 mi) and Sam’s (38 mi)
              </label>
              <div className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Shopping at
                  </p>
                  <Select
                    value={lastStoreId}
                    onValueChange={(v) => {
                      setLastStoreId(v as StoreId);
                      setShopOnly(true);
                    }}
                  >
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STORE_IDS.map((id) => (
                        <SelectItem key={id} value={id}>
                          {STORE_MAP[id].short}
                          {STORE_MAP[id].far ? ` · ${STORE_MAP[id].miles} mi` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <label className="flex h-11 items-center gap-2 text-sm">
                    <Checkbox
                      checked={shopOnly}
                      onCheckedChange={(v) => setShopOnly(v === true)}
                    />
                    Only this stop
                  </label>
                </div>
                <div>
                  <Label htmlFor="budget">Trip budget</Label>
                  <Input
                    id="budget"
                    inputMode="decimal"
                    className="mt-1.5 h-11 tabular-nums"
                    value={budget || ""}
                    onChange={(e) => setBudget(Number(e.target.value) || 0)}
                    placeholder="Off"
                  />
                </div>
              </div>
              <TripPlanPicker
                plans={plans}
                selected={Math.min(planIndex, plans.length - 1)}
                onSelect={setPlanIndex}
              />
              <TripPlanDetail plan={selected} />
              {budget > 0 ? (
                <p
                  className={
                    selected.total > budget
                      ? "text-sm font-medium text-destructive"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {selected.total > budget
                    ? `${formatMoney(selected.total - budget)} over a ${formatMoney(budget)} budget.`
                    : `${formatMoney(budget - selected.total)} left under ${formatMoney(budget)}.`}
                </p>
              ) : null}
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-medium">Items</h2>
            <ul className="space-y-2">
              {active
                .map((item) => {
                  const product = PRODUCT_MAP[item.productId];
                  const best = cheapestStore(item.productId, item.qty, ctx);
                  const assigned =
                    item.preferredStore === "cheapest" ? best?.storeId : item.preferredStore;
                  return { item, product, best, assigned };
                })
                .filter((row) => !shopOnly || row.assigned === lastStoreId)
                .sort((a, b) => {
                  const aHere = a.assigned === lastStoreId ? 0 : 1;
                  const bHere = b.assigned === lastStoreId ? 0 : 1;
                  return aHere - bHere;
                })
                .map(({ item, product, best, assigned }) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleChecked(item.id)}
                        className="mt-1"
                        aria-label={`Check off ${product?.name}`}
                      />
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          className="text-left font-medium"
                          onClick={() => setOpenId(item.productId)}
                        >
                          {product?.name}
                        </button>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {product?.size}
                          {assigned ? ` · ${STORE_MAP[assigned].short}` : ""}
                          {best ? ` · ${formatMoney(best.quote.cost)}` : ""}
                          {best?.quote.note ? ` · ${best.quote.note}` : ""}
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <div className="flex items-center rounded-md border border-border">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateListItem(item.id, { qty: Math.max(1, item.qty - 1) })
                              }
                            >
                              <Minus />
                            </Button>
                            <span className="min-w-8 text-center text-sm tabular-nums">{item.qty}</span>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Increase quantity"
                              onClick={() => updateListItem(item.id, { qty: item.qty + 1 })}
                            >
                              <Plus />
                            </Button>
                          </div>
                          <Select
                            value={item.preferredStore}
                            onValueChange={(v) =>
                              updateListItem(item.id, {
                                preferredStore: v as StoreId | "cheapest",
                              })
                            }
                          >
                            <SelectTrigger className="h-11 w-[11rem]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cheapest">Cheapest nearby</SelectItem>
                              {STORE_IDS.map((id) => (
                                <SelectItem key={id} value={id}>
                                  {STORE_MAP[id].short}
                                  {STORE_MAP[id].far ? ` · ${STORE_MAP[id].miles} mi` : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Remove item"
                            onClick={() => removeListItem(item.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        </>
      )}

      {checked.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-medium">Checked off</h2>
            <Badge variant="secondary">{checked.length}</Badge>
          </div>
          <ul className="space-y-2">
            {checked.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Checkbox checked onCheckedChange={() => toggleChecked(item.id)} />
                <span className="line-through">{PRODUCT_MAP[item.productId]?.name}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => {
                restockFromList();
                toast.success("Moved checked items into the pantry");
              }}
            >
              Restock pantry
            </Button>
            <Button variant="outline" onClick={clearChecked}>
              Clear checked
            </Button>
          </div>
        </section>
      ) : null}

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
