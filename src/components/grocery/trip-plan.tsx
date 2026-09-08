import { STORE_MAP } from "@/lib/grocery/stores";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import { formatMoney } from "@/lib/grocery/format";
import type { TripPlan } from "@/lib/grocery/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StoreMark } from "./store-mark";

export function TripPlanPicker({
  plans,
  selected,
  onSelect,
}: {
  plans: TripPlan[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {plans.map((plan, i) => {
        const active = i === selected;
        return (
          <button
            key={`${plan.mode}-${plan.label}`}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "rounded-xl border p-4 text-left shadow-[var(--shadow-card)] transition-[border-color,background-color] duration-150",
              active ? "border-primary bg-best-fill/60" : "border-border bg-card hover:bg-muted/40",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {i === 0 ? "Recommended" : plan.mode === "one-store" ? "One stop" : "Multi-stop"}
              </div>
              {i === 0 ? <Badge variant="best">Best</Badge> : null}
            </div>
            <div className="mt-2 font-display text-2xl font-medium tabular-nums">{formatMoney(plan.total)}</div>
            <div className="mt-1 text-sm text-foreground">{plan.label}</div>
            {plan.vsMostExpensive > 0 ? (
              <div className="mt-1 text-xs text-best">Saves {formatMoney(plan.vsMostExpensive)}</div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function TripPlanDetail({ plan }: { plan: TripPlan }) {
  return (
    <div className="grid gap-3">
      {plan.stops.map((stop) => (
        <Card key={stop.storeId}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <StoreMark storeId={stop.storeId} />
              <span className="text-sm font-normal text-muted-foreground">
                {STORE_MAP[stop.storeId].locations[0]?.name}
              </span>
            </CardTitle>
            <span className="font-medium tabular-nums">{formatMoney(stop.total)}</span>
          </CardHeader>
          <CardContent className="space-y-2">
            {stop.items.map((item) => {
              const product = PRODUCT_MAP[item.productId];
              return (
                <div key={item.productId} className="flex items-baseline justify-between gap-3 text-sm">
                  <div>
                    <span className="font-medium">{product?.name ?? item.productId}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      × {item.qty}
                      {item.note ? ` · ${item.note}` : ""}
                    </span>
                  </div>
                  <span className="tabular-nums">{formatMoney(item.cost)}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
      {plan.receivedExtra > 0 ? (
        <p className="text-sm text-muted-foreground">
          BOGO extras on this run: {plan.receivedExtra} free units if you take them.
        </p>
      ) : null}
    </div>
  );
}
