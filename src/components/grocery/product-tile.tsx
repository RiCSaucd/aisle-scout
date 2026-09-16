import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import { cheapestStore, type PriceContext } from "@/lib/grocery/pricing";
import { formatMoney } from "@/lib/grocery/format";
import { photoFor } from "@/lib/grocery/photos";
import { STORE_MAP } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { Button } from "@/components/ui/button";

export function ProductTile({
  productId,
  ctx,
  onOpen,
}: {
  productId: string;
  ctx: PriceContext;
  onOpen: (id: string) => void;
}) {
  const product = PRODUCT_MAP[productId];
  const addToList = useGroceryStore((s) => s.addToList);
  if (!product) return null;
  const photo = photoFor(productId);
  const best = cheapestStore(productId, 1, ctx);

  return (
    <article className="overflow-hidden rounded-xl bg-card text-card-foreground shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={() => onOpen(productId)}
        className="block w-full text-left"
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            className="aspect-square w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-muted text-sm text-muted-foreground">
            {product.name}
          </div>
        )}
        <div className="px-3 pt-3">
          <p className="font-medium leading-snug tracking-tight">{product.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{product.size}</p>
        </div>
      </button>
      <div className="flex items-end justify-between gap-2 px-3 pb-3 pt-2">
        <div>
          <p className="text-lg font-semibold tabular-nums leading-none">
            {best ? formatMoney(best.quote.unitPrice) : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {best ? STORE_MAP[best.storeId].short : "Not in book"}
          </p>
        </div>
        <Button
          size="icon"
          className="shrink-0"
          aria-label={`Add ${product.name} to list`}
          onClick={() => {
            addToList(productId, 1);
            toast.success(`Added ${product.name}`);
          }}
        >
          <Plus className="size-5" />
        </Button>
      </div>
    </article>
  );
}
