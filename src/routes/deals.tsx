import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import { KIND_LABEL, formatMoney } from "@/lib/grocery/format";
import { PROMOTIONS, WEEK_LABEL } from "@/lib/grocery/promotions";
import { STORES, STORE_MAP } from "@/lib/grocery/stores";
import { dealComparison } from "@/lib/grocery/pricing";
import { useGroceryStore } from "@/lib/grocery/store";
import { usePriceContext } from "@/lib/grocery/hooks";
import type { PromotionKind, StoreId } from "@/lib/grocery/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilterRow } from "@/components/grocery/filter-row";
import { ProductSheet } from "@/components/grocery/product-sheet";
import { StoreMark } from "@/components/grocery/store-mark";

export const Route = createFileRoute("/deals")({
  component: DealsPage,
  head: () => ({
    meta: [{ title: "Deals · Aisle Scout" }],
  }),
});

const KIND_OPTIONS: { id: string; label: string }[] = [
  { id: "all", label: "All deals" },
  { id: "bogo", label: "BOGO" },
  { id: "circle", label: "Circle" },
  { id: "coupon", label: "Coupons" },
  { id: "rollback", label: "Rollbacks" },
  { id: "sale", label: "Sales" },
  { id: "aldi-finds", label: "Aldi Finds" },
];

function DealsPage() {
  const ctx = usePriceContext();
  const clipped = useGroceryStore((s) => s.clippedPromoIds);
  const clipPromo = useGroceryStore((s) => s.clipPromo);
  const unclipPromo = useGroceryStore((s) => s.unclipPromo);
  const addToList = useGroceryStore((s) => s.addToList);
  const [store, setStore] = useState<string>("all");
  const [kind, setKind] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const deals = useMemo(() => {
    return PROMOTIONS.filter((p) => {
      if (store !== "all" && p.storeId !== store) return false;
      if (kind !== "all" && p.kind !== kind) return false;
      return true;
    }).sort((a, b) => {
      const ca = dealComparison(a, ctx);
      const cb = dealComparison(b, ctx);
      if (ca.beats !== cb.beats) return ca.beats ? -1 : 1;
      return cb.saveVsNext - ca.saveVsNext;
    });
  }, [store, kind, ctx]);

  const clipCount = PROMOTIONS.filter((p) => p.requiresClip && !clipped.includes(p.id)).length;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Circular week · {WEEK_LABEL}
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight">Deals, BOGOs, clips</h1>
        <p className="max-w-xl text-muted-foreground">
          Publix BOGOs, Winn-Dixie on A1A, CVS ExtraBucks, Walgreens personal-care BOGOs, ABC spirits, Walmart rollbacks,
          Target Circle, and Aldi produce.
          {clipCount > 0 ? ` ${clipCount} coupons still need a clip to count in the math.` : ""}
        </p>
      </header>

      <FilterRow
        label="Store"
        value={store}
        onChange={setStore}
        options={[
          { id: "all", label: "All stores" },
          ...STORES.map((s) => ({ id: s.id, label: s.short })),
        ]}
      />
      <FilterRow label="Deal type" value={kind} onChange={setKind} options={KIND_OPTIONS} />

      <div className="grid gap-3">
        {deals.map((promo) => {
          const product = PRODUCT_MAP[promo.productId];
          const cmp = dealComparison(promo, ctx);
          const isClipped = clipped.includes(promo.id);
          return (
            <Card key={promo.id}>
              <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-start sm:justify-between">
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => setOpenId(promo.productId)}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StoreMark storeId={promo.storeId as StoreId} size="sm" />
                    <Badge variant="deal">{KIND_LABEL[promo.kind as PromotionKind]}</Badge>
                    {cmp.beats ? <Badge variant="best">Beats the others</Badge> : null}
                  </div>
                  <div className="mt-2 font-medium">{product?.name}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{promo.details}</p>
                  {cmp.self && cmp.nextBest ? (
                    <p className="mt-2 text-sm">
                      <span className="tabular-nums font-medium">{formatMoney(cmp.self.cost)}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        for {cmp.self.qty}
                        {cmp.beats
                          ? ` · ${formatMoney(cmp.saveVsNext)} less than ${STORE_MAP[cmp.nextBest.storeId].short}`
                          : ` · ${STORE_MAP[cmp.nextBest.storeId].short} is still cheaper at ${formatMoney(cmp.nextBest.cost)}`}
                      </span>
                    </p>
                  ) : null}
                </button>
                <div className="flex shrink-0 flex-col gap-2 sm:w-40">
                  {promo.requiresClip ? (
                    <Button
                      variant={isClipped ? "secondary" : "default"}
                      onClick={() => {
                        if (isClipped) {
                          unclipPromo(promo.id);
                          toast("Unclipped — price math updated");
                        } else {
                          clipPromo(promo.id);
                          toast.success(`Clipped ${promo.label}`);
                        }
                      }}
                    >
                      {isClipped ? "Clipped" : "Clip coupon"}
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    onClick={() => {
                      addToList(promo.productId, promo.kind === "bogo" || promo.kind === "bogo50" ? 2 : 1);
                      toast.success("Added to list");
                    }}
                  >
                    Add to list
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
