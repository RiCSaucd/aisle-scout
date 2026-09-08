import { STORE_MAP } from "./stores";
import { cheapestStore, compareStoreIds, quoteLine, type PriceContext } from "./pricing";
import type { ListItem, StoreId, TripPlan, TripStop } from "./types";

function stopsFromAssignments(
  assignments: { storeId: StoreId; productId: string; qty: number }[],
  ctx: PriceContext,
): { stops: TripStop[]; total: number; receivedExtra: number } {
  const byStore = new Map<StoreId, TripStop>();
  let receivedExtra = 0;
  for (const row of assignments) {
    const quote = quoteLine(row.productId, row.storeId, row.qty, ctx);
    if (!quote) continue;
    receivedExtra += Math.max(0, quote.receivedQty - row.qty);
    let stop = byStore.get(row.storeId);
    if (!stop) {
      stop = { storeId: row.storeId, items: [], total: 0 };
      byStore.set(row.storeId, stop);
    }
    stop.items.push({
      productId: row.productId,
      qty: row.qty,
      cost: quote.cost,
      note: quote.note,
    });
    stop.total += quote.cost;
  }
  const order = compareStoreIds(ctx);
  const stops = [...byStore.values()].sort(
    (a, b) => order.indexOf(a.storeId) - order.indexOf(b.storeId),
  );
  const total = stops.reduce((sum, s) => sum + s.total, 0);
  return { stops, total, receivedExtra };
}

function expensiveBaseline(items: ListItem[], ctx: PriceContext): number {
  let total = 0;
  const ids = compareStoreIds(ctx);
  for (const item of items) {
    if (item.checked) continue;
    let worst = 0;
    for (const storeId of ids) {
      const q = quoteLine(item.productId, storeId, item.qty, ctx);
      if (q && q.regular * item.qty > worst) worst = q.regular * item.qty;
    }
    total += worst;
  }
  return total;
}

function canFill(storeId: StoreId, items: ListItem[], ctx: PriceContext): boolean {
  return items.every((i) => quoteLine(i.productId, storeId, i.qty, ctx) != null);
}

export function planOneStore(items: ListItem[], ctx: PriceContext): TripPlan {
  const active = items.filter((i) => !i.checked);
  const ids = compareStoreIds(ctx);
  let best: TripPlan | null = null;
  for (const storeId of ids) {
    if (active.length && !canFill(storeId, active, ctx)) continue;
    const assignments = active.map((i) => ({
      storeId,
      productId: i.productId,
      qty: i.qty,
    }));
    const built = stopsFromAssignments(assignments, ctx);
    const miles = STORE_MAP[storeId].miles;
    const farNote = STORE_MAP[storeId].far ? ` · ${miles} mi` : "";
    const plan: TripPlan = {
      mode: "one-store",
      label: `All at ${STORE_MAP[storeId].short}${farNote}`,
      ...built,
      vsMostExpensive: expensiveBaseline(active, ctx) - built.total,
    };
    if (!best || plan.total < best.total) best = plan;
  }
  return (
    best ?? {
      mode: "one-store",
      label: "Empty list",
      stops: [],
      total: 0,
      receivedExtra: 0,
      vsMostExpensive: 0,
    }
  );
}

export function planSplit(items: ListItem[], ctx: PriceContext): TripPlan {
  const active = items.filter((i) => !i.checked);
  const assignments: { storeId: StoreId; productId: string; qty: number }[] = [];
  for (const item of active) {
    if (item.preferredStore !== "cheapest") {
      assignments.push({
        storeId: item.preferredStore,
        productId: item.productId,
        qty: item.qty,
      });
      continue;
    }
    const best = cheapestStore(item.productId, item.qty, ctx);
    if (best) {
      assignments.push({
        storeId: best.storeId,
        productId: item.productId,
        qty: item.qty,
      });
    }
  }
  const built = stopsFromAssignments(assignments, ctx);
  const storeNames = built.stops.map((s) => STORE_MAP[s.storeId].short).join(" + ");
  return {
    mode: "split",
    label: built.stops.length <= 1 ? storeNames || "Split trip" : `Split · ${storeNames}`,
    ...built,
    vsMostExpensive: expensiveBaseline(active, ctx) - built.total,
  };
}

export function planTwoStop(items: ListItem[], ctx: PriceContext): TripPlan {
  const active = items.filter((i) => !i.checked);
  const ids = compareStoreIds(ctx);
  let best: TripPlan | null = null;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i]!;
      const b = ids[j]!;
      const assignments: { storeId: StoreId; productId: string; qty: number }[] = [];
      for (const item of active) {
        const qa = quoteLine(item.productId, a, item.qty, ctx);
        const qb = quoteLine(item.productId, b, item.qty, ctx);
        if (!qa && !qb) continue;
        const pick = qa && qb ? (qa.cost <= qb.cost ? a : b) : qa ? a : b;
        assignments.push({ storeId: pick, productId: item.productId, qty: item.qty });
      }
      if (assignments.length < active.length) continue;
      const built = stopsFromAssignments(assignments, ctx);
      const plan: TripPlan = {
        mode: "two-stop",
        label: `${STORE_MAP[a].short} + ${STORE_MAP[b].short}`,
        ...built,
        vsMostExpensive: expensiveBaseline(active, ctx) - built.total,
      };
      if (!best || plan.total < best.total) best = plan;
    }
  }
  return best ?? planSplit(items, ctx);
}

export function allPlans(items: ListItem[], ctx: PriceContext): TripPlan[] {
  const one = planOneStore(items, ctx);
  const two = planTwoStop(items, ctx);
  const split = planSplit(items, ctx);
  const unique: TripPlan[] = [one];
  if (two.stops.length > 1 && Math.abs(two.total - one.total) > 0.04) unique.push(two);
  if (
    split.stops.length > 2 &&
    Math.abs(split.total - two.total) > 0.04 &&
    Math.abs(split.total - one.total) > 0.04
  ) {
    unique.push(split);
  }
  return unique.sort((a, b) => a.total - b.total);
}
