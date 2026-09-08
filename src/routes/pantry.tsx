import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import { EXPIRY_ALERT_BY, TODAY } from "@/lib/grocery/promotions";
import { useGroceryStore } from "@/lib/grocery/store";
import { usePriceContext } from "@/lib/grocery/hooks";
import { LOCATIONS, type PantryLocation } from "@/lib/grocery/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterRow } from "@/components/grocery/filter-row";
import { ProductSearch } from "@/components/grocery/product-search";
import { ProductSheet } from "@/components/grocery/product-sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/pantry")({
  component: PantryPage,
  head: () => ({
    meta: [{ title: "Pantry · Aisle Scout" }],
  }),
});

const LOCATION_LABEL: Record<PantryLocation, string> = {
  fridge: "Fridge",
  freezer: "Freezer",
  pantry: "Pantry",
  other: "Other",
};

function statusOf(item: { qty: number; lowAt: number; expiresOn?: string }) {
  const expiring = !!(item.expiresOn && item.expiresOn <= EXPIRY_ALERT_BY);
  const expired = !!(item.expiresOn && item.expiresOn < TODAY);
  const low = item.qty <= item.lowAt;
  return { expiring, expired, low };
}

function PantryPage() {
  const ctx = usePriceContext();
  const inventory = useGroceryStore((s) => s.inventory);
  const addInventory = useGroceryStore((s) => s.addInventory);
  const updateInventory = useGroceryStore((s) => s.updateInventory);
  const removeInventory = useGroceryStore((s) => s.removeInventory);
  const addToList = useGroceryStore((s) => s.addToList);
  const resetDemo = useGroceryStore((s) => s.resetDemo);
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pendingQty, setPendingQty] = useState("1");
  const [pendingLoc, setPendingLoc] = useState<PantryLocation>("pantry");
  const [pendingExp, setPendingExp] = useState("");

  const rows = useMemo(() => {
    return inventory
      .filter((i) => (filter === "all" ? true : i.location === filter))
      .slice()
      .sort((a, b) => {
        const sa = statusOf(a);
        const sb = statusOf(b);
        const rank = (s: typeof sa) => (s.expired ? 0 : s.expiring ? 1 : s.low ? 2 : 3);
        return rank(sa) - rank(sb);
      });
  }, [inventory, filter]);

  const alerts = inventory.filter((i) => {
    const s = statusOf(i);
    return s.expired || s.expiring || s.low;
  }).length;

  function commitPending(productId: string) {
    const product = PRODUCT_MAP[productId];
    addInventory({
      productId,
      qty: Math.max(0, Number(pendingQty) || 1),
      location: pendingLoc,
      expiresOn: pendingExp || undefined,
      lowAt: 1,
    });
    toast.success(`Logged ${product?.name ?? "item"}`);
    setPendingId(null);
    setPendingQty("1");
    setPendingExp("");
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-medium tracking-tight">Pantry</h1>
        <p className="max-w-xl text-muted-foreground">
          What you already have. {alerts > 0 ? `${alerts} running low or close to the date.` : "Nothing waving for attention."}
        </p>
        <ProductSearch
          placeholder="Log something you already have…"
          onPick={(id) => {
            const product = PRODUCT_MAP[id];
            const loc: PantryLocation =
              product?.category === "frozen"
                ? "freezer"
                : product?.category === "produce" || product?.category === "dairy" || product?.category === "meat"
                  ? "fridge"
                  : "pantry";
            setPendingLoc(loc);
            setPendingId(id);
          }}
        />
      </header>

      {pendingId ? (
        <Card>
          <CardContent className="space-y-3 pt-5">
            <p className="font-medium">Add {PRODUCT_MAP[pendingId]?.name}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="inv-qty">Quantity</Label>
                <Input
                  id="inv-qty"
                  className="mt-1.5"
                  type="number"
                  min={0}
                  step={0.1}
                  value={pendingQty}
                  onChange={(e) => setPendingQty(e.target.value)}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Select value={pendingLoc} onValueChange={(v) => setPendingLoc(v as PantryLocation)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {LOCATION_LABEL[loc]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inv-exp">Use by</Label>
                <Input
                  id="inv-exp"
                  className="mt-1.5"
                  type="date"
                  value={pendingExp}
                  onChange={(e) => setPendingExp(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => commitPending(pendingId)}>Save to pantry</Button>
              <Button variant="ghost" onClick={() => setPendingId(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <FilterRow
        label="Location"
        value={filter}
        onChange={setFilter}
        options={[
          { id: "all", label: "All" },
          ...LOCATIONS.map((loc) => ({ id: loc, label: LOCATION_LABEL[loc] })),
        ]}
      />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          Nothing in this spot yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((item) => {
            const product = PRODUCT_MAP[item.productId];
            const s = statusOf(item);
            return (
              <li
                key={item.id}
                className="rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <button type="button" className="text-left" onClick={() => setOpenId(item.productId)}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{product?.name}</span>
                      {s.expired ? <Badge variant="warn">Expired</Badge> : null}
                      {!s.expired && s.expiring ? (
                        <Badge variant="warn">
                          <TriangleAlert className="mr-1 size-3" />
                          Use soon
                        </Badge>
                      ) : null}
                      {s.low && !s.expired ? <Badge variant="secondary">Low</Badge> : null}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {LOCATION_LABEL[item.location]}
                      {item.expiresOn ? ` · use by ${item.expiresOn}` : ""}
                    </div>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove from pantry"
                    onClick={() => removeInventory(item.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className="flex items-center rounded-md border border-border">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        updateInventory(item.id, { qty: Math.max(0, Math.round((item.qty - 1) * 10) / 10) })
                      }
                    >
                      <Minus />
                    </Button>
                    <span className="min-w-8 text-center text-sm tabular-nums">{item.qty}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Increase quantity"
                      onClick={() =>
                        updateInventory(item.id, { qty: Math.round((item.qty + 1) * 10) / 10 })
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                  {(s.low || s.expired) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToList(item.productId, 1);
                        toast.success("Added to list");
                      }}
                    >
                      Add to list
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        onClick={() => {
          resetDemo();
          toast("Sample pantry and list restored");
        }}
      >
        Reset sample data
      </button>

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
