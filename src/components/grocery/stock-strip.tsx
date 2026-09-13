import { Link } from "@tanstack/react-router";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import { expiryStatus } from "@/lib/grocery/shelf-life";
import { useGroceryStore } from "@/lib/grocery/store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function StockStrip() {
  const inventory = useGroceryStore((s) => s.inventory);
  const fridge = inventory.filter((i) => i.location === "fridge" || i.location === "freezer");
  const cabinet = inventory.filter((i) => i.location === "pantry" || i.location === "other");

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <StockCard title="Fridge now" href="/pantry" items={fridge} empty="Fridge is empty — scan a shelf or a barcode." />
      <StockCard
        title="Cabinet now"
        href="/pantry"
        items={cabinet}
        empty="Cabinet is empty — scan pantry items as you put them away."
      />
    </div>
  );
}

function StockCard({
  title,
  href,
  items,
  empty,
}: {
  title: string;
  href: string;
  items: { id: string; productId: string; qty: number; expiresOn?: string }[];
  empty: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-xl font-medium">{title}</h2>
          <Badge variant="secondary">{items.length}</Badge>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {items.slice(0, 6).map((item) => {
              const name = PRODUCT_MAP[item.productId]?.name ?? item.productId;
              const exp = expiryStatus(item.expiresOn);
              return (
                <li key={item.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">{name}</span>
                  {exp !== "ok" ? (
                    <Badge variant="warn">{exp === "expired" ? "Use now" : "Use soon"}</Badge>
                  ) : (
                    <span className="tabular-nums text-muted-foreground">{item.qty}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <Link to={href} className="text-sm font-medium underline-offset-4 hover:underline">
          Full stock
        </Link>
      </CardContent>
    </Card>
  );
}
