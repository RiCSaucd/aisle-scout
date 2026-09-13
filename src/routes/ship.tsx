import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { formatMoney } from "@/lib/grocery/format";
import { STORE_MAP } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { usePriceContext } from "@/lib/grocery/hooks";
import {
  PASS_IDS,
  PASS_LABEL,
  cheapestShip,
  quoteAllDeliveries,
  walmartPlusBreakEven,
  type PassId,
} from "@/lib/grocery/delivery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterRow } from "@/components/grocery/filter-row";
import { StoreMark } from "@/components/grocery/store-mark";

export const Route = createFileRoute("/ship")({
  component: ShipPage,
  head: () => ({
    meta: [{ title: "Ship it · Aisle Scout" }],
  }),
});

function ShipPage() {
  const ctx = usePriceContext();
  const list = useGroceryStore((s) => s.list);
  const includeFar = useGroceryStore((s) => s.includeFar);
  const setIncludeFar = useGroceryStore((s) => s.setIncludeFar);
  const passes = useGroceryStore((s) => s.passes);
  const setPass = useGroceryStore((s) => s.setPass);
  const deliveriesPerMonth = useGroceryStore((s) => s.deliveriesPerMonth);
  const setDeliveriesPerMonth = useGroceryStore((s) => s.setDeliveriesPerMonth);

  const quotes = useMemo(
    () => quoteAllDeliveries(list, ctx, { passes, deliveriesPerMonth, includeFar }),
    [list, ctx, passes, deliveriesPerMonth, includeFar],
  );
  const ships = quotes.filter((q) => q.service.kind === "delivery");
  const pickups = quotes.filter((q) => q.service.kind === "pickup");
  const best = cheapestShip(ships);
  const walmartPlus = ships.find((q) => q.service.id === "walmart-plus");
  const walmartGuest = ships.find((q) => q.service.id === "walmart-guest");
  const aldiCart = ships.find((q) => q.service.id === "instacart-aldi");
  const breakEven = walmartPlusBreakEven();
  const activeCount = list.filter((i) => !i.checked).length;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          32080 · to the door
        </p>
        <h1 className="font-display text-4xl font-medium tracking-tight">Ship the list</h1>
        <p className="max-w-xl text-muted-foreground">
          Same Walmart shelf prices they scan on US-1, plus every other way groceries actually arrive
          at a St. Augustine Beach house. Sam’s is Walmart’s warehouse cousin — bulk, far, and only
          cheaper if you can store it.
        </p>
      </header>

      {activeCount === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          Put something on the list first.
          <Button asChild variant="link" className="ml-1 h-auto p-0">
            <Link to="/list">Open the list</Link>
          </Button>
        </p>
      ) : null}

      {best ? (
        <Card className="relative overflow-hidden border-primary/30">
          <CardContent className="space-y-3 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Cheapest to the door
                </p>
                <p className="font-display text-3xl font-medium">{best.service.name}</p>
                <p className="text-sm text-muted-foreground">{best.service.blurb}</p>
              </div>
              <StoreMark storeId={best.service.storeId} />
            </div>
            <p className="font-display text-4xl font-medium tabular-nums">{formatMoney(best.landed)}</p>
            <p className="text-sm text-muted-foreground">
              Groceries {formatMoney(best.grocery)}
              {best.deliveryFee ? ` · delivery ${formatMoney(best.deliveryFee)}` : " · delivery $0"}
              {best.serviceFee ? ` · service ${formatMoney(best.serviceFee)}` : ""}
              {best.tip ? ` · tip ${formatMoney(best.tip)}` : ""}
              {best.passSlice ? ` · pass ${formatMoney(best.passSlice)} this drop` : ""}
            </p>
            {walmartPlus && walmartGuest && best.service.id === "walmart-plus" ? (
              <p className="text-sm">
                Walmart+ pays for itself after {breakEven} delivered orders versus paying the $7.95
                fee every time. Weekly drops: keep the pass.
              </p>
            ) : null}
            {aldiCart && best.service.id === "walmart-plus" && aldiCart.landed - best.landed > 0 ? (
              <p className="text-sm text-muted-foreground">
                Aldi on Instacart lands at {formatMoney(aldiCart.landed)} — cheaper food, more fees.
              </p>
            ) : null}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link to="/prices" search={{ at: "walmart" }}>
                  Walmart shelf book
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/list">Edit the list</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-medium">Passes you already pay for</h2>
        <p className="text-sm text-muted-foreground">
          Check what you already subscribe to. We’ll stop charging that annual fee against this drop.
        </p>
        <ul className="space-y-2">
          {PASS_IDS.map((id) => (
            <li key={id} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">
              <Checkbox
                checked={passes[id]}
                onCheckedChange={(v) => setPass(id as PassId, v === true)}
                id={`pass-${id}`}
              />
              <label htmlFor={`pass-${id}`} className="text-sm font-medium">
                {PASS_LABEL[id]}
              </label>
            </li>
          ))}
        </ul>
        <FilterRow
          label="Drops per month"
          value={String(deliveriesPerMonth)}
          onChange={(v) => setDeliveriesPerMonth(Number(v))}
          options={[
            { id: "1", label: "1× / month" },
            { id: "2", label: "Every other week" },
            { id: "4", label: "Weekly" },
            { id: "8", label: "Twice a week" },
          ]}
        />
        <label className="flex items-center gap-3 text-sm">
          <Checkbox checked={includeFar} onCheckedChange={(v) => setIncludeFar(v === true)} />
          Include Sam’s and Costco (bulk, far)
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl font-medium">Every door that will take this list</h2>
        <ul className="space-y-3">
          {ships.map((q, i) => (
            <li key={q.service.id}>
              <Card>
                <CardContent className="space-y-2 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{q.service.name}</p>
                        {i === 0 && q.service.available ? <Badge>Cheapest ship</Badge> : null}
                        {q.service.far ? <Badge variant="secondary">Far / bulk</Badge> : null}
                        {!q.service.available ? <Badge variant="warn">Not in 32080</Badge> : null}
                        {q.complete && q.service.available ? (
                          <Badge variant="secondary">Full list</Badge>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{q.service.blurb}</p>
                    </div>
                    {q.service.available ? (
                      <p className="font-display text-2xl font-medium tabular-nums">
                        {formatMoney(q.landed)}
                      </p>
                    ) : null}
                  </div>
                  {q.service.available ? (
                    <p className="text-xs text-muted-foreground">
                      {STORE_MAP[q.service.storeId].short} groceries {formatMoney(q.grocery)}
                      {q.service.markup !== 1 ? ` · ${Math.round((q.service.markup - 1) * 100)}% app markup` : " · in-store prices"}
                      {q.deliveryFee ? ` · fee ${formatMoney(q.deliveryFee)}` : " · no delivery fee"}
                      {q.serviceFee ? ` · service ${formatMoney(q.serviceFee)}` : ""}
                      {q.tip ? ` · tip ${formatMoney(q.tip)}` : ""}
                      {q.passSlice ? ` · ${formatMoney(q.passSlice)} of the annual pass` : ""}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">{q.note}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {pickups.map((q) => (
        <section key={q.service.id} className="space-y-2">
          <h2 className="font-display text-2xl font-medium">If you’ll drive</h2>
          <Card>
            <CardContent className="space-y-2 pt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{q.service.name}</p>
                  <p className="text-sm text-muted-foreground">{q.service.blurb}</p>
                </div>
                <p className="font-display text-2xl font-medium tabular-nums">{formatMoney(q.landed)}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Groceries {formatMoney(q.grocery)} · no fee · no tip · 8 miles each way.
              </p>
            </CardContent>
          </Card>
        </section>
      ))}
    </div>
  );
}
