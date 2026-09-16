import { useEffect, useState } from "react";
import { Bell, Pin, ScanBarcode } from "lucide-react";
import { toast } from "sonner";
import { PRODUCT_MAP, CATEGORY_LABEL } from "@/lib/grocery/catalog";
import { allQuotes, priceHistory, type PriceContext } from "@/lib/grocery/pricing";
import { formatMoney } from "@/lib/grocery/format";
import { upcFor } from "@/lib/grocery/barcodes";
import { STORE_MAP } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PriceGrid } from "./price-grid";
import { StoreMark } from "./store-mark";
import { BarcodeMark } from "./barcode-mark";
import { photoFor } from "@/lib/grocery/photos";
import { listingsForProduct } from "@/lib/grocery/listings";
import { Link } from "@tanstack/react-router";

export function ProductSheet({
  productId,
  ctx,
  open,
  onOpenChange,
}: {
  productId: string | null;
  ctx: PriceContext;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const product = productId ? PRODUCT_MAP[productId] : undefined;
  const addToList = useGroceryStore((s) => s.addToList);
  const addInventory = useGroceryStore((s) => s.addInventory);
  const lastStoreId = useGroceryStore((s) => s.lastStoreId);
  const watched = useGroceryStore((s) => s.watched);
  const staples = useGroceryStore((s) => s.staples);
  const toggleWatched = useGroceryStore((s) => s.toggleWatched);
  const toggleStaple = useGroceryStore((s) => s.toggleStaple);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [productId]);

  if (!product) return null;

  const quotes = allQuotes(product.id, qty, ctx);
  const history = priceHistory(product.id, quotes[0]?.storeId ?? "aldi", ctx);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{product.name}</SheetTitle>
          <SheetDescription>
            {product.brand ? `${product.brand} · ` : ""}
            {product.size} · {CATEGORY_LABEL[product.category]} · {upcFor(product.id)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {photoFor(product.id) ? (
            <img
              src={photoFor(product.id)}
              alt=""
              className="aspect-square w-full rounded-xl object-cover"
              crossOrigin="anonymous"
            />
          ) : null}
          <PriceGrid productId={product.id} qty={qty} ctx={ctx} />

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Open the live listing
            </p>
            <div className="flex flex-wrap gap-1.5">
              {listingsForProduct(product.id)
                .filter((l) => l.id !== "upc")
                .map((l) => (
                  <a
                    key={l.id}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center rounded-full bg-muted px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    {l.label}
                  </a>
                ))}
            </div>
          </div>

          <div className="space-y-2">
            {quotes.map((q) =>
              q.promo ? (
                <div
                  key={q.storeId}
                  className="rounded-lg border border-border bg-muted/60 px-3 py-2 text-sm"
                >
                  <StoreMark storeId={q.storeId} size="sm" />
                  <p className="mt-1 text-muted-foreground">{q.promo.details}</p>
                </div>
              ) : null,
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Four-week price at cheapest store
            </p>
            <div className="flex items-end gap-2">
              {history.map((h) => {
                const max = Math.max(...history.map((x) => x.price));
                const min = Math.min(...history.map((x) => x.price));
                const span = Math.max(0.01, max - min);
                const height = 24 + ((h.price - min) / span) * 40;
                return (
                  <div key={h.week} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-sm bg-primary/70"
                      style={{ height }}
                      title={formatMoney(h.price)}
                    />
                    <span className="text-[10px] text-muted-foreground">{h.week}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="w-24">
              <Label htmlFor="sheet-qty">Qty</Label>
              <Input
                id="sheet-qty"
                type="number"
                min={1}
                step={1}
                className="mt-1.5"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
            <Button
              className="flex-1"
              onClick={() => {
                addToList(product.id, qty);
                toast.success(`Added ${product.name} to the list`);
                onOpenChange(false);
              }}
            >
              Add to list
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              addInventory({
                productId: product.id,
                qty,
                location: product.category === "produce" || product.category === "dairy" || product.category === "meat"
                  ? "fridge"
                  : product.category === "frozen"
                    ? "freezer"
                    : "pantry",
                lowAt: 1,
              });
              toast.success(`Logged ${product.name} in pantry`);
            }}
          >
            Add to pantry
          </Button>
          <div className="flex gap-2">
            <Button
              variant={watched.includes(product.id) ? "secondary" : "outline"}
              className="flex-1"
              onClick={() => toggleWatched(product.id)}
            >
              <Bell className="size-4" />
              {watched.includes(product.id) ? "Watching" : "Watch"}
            </Button>
            <Button
              variant={staples.includes(product.id) ? "secondary" : "outline"}
              className="flex-1"
              onClick={() => toggleStaple(product.id)}
            >
              <Pin className="size-4" />
              Staple
            </Button>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/scan" search={{ store: lastStoreId }}>
              <ScanBarcode className="size-4" />
              Scan this at {STORE_MAP[lastStoreId].short}
            </Link>
          </Button>
          <BarcodeMark productId={product.id} />

          <div className="flex flex-wrap gap-2">
            {quotes.map((q) => (
              <Badge key={q.storeId} variant={q.cost === Math.min(...quotes.map((x) => x.cost)) ? "best" : "secondary"}>
                {STORE_MAP[q.storeId].short} {formatMoney(q.cost)}
                {q.note ? ` · ${q.note}` : ""}
              </Badge>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
