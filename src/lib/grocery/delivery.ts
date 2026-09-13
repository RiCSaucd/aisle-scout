import { PRODUCT_MAP } from "./catalog";
import { quoteLine, type PriceContext } from "./pricing";
import type { ListItem, StoreId } from "./types";

export const PASS_IDS = ["walmartPlus", "instacartPlus", "shipt", "sams", "costco"] as const;
export type PassId = (typeof PASS_IDS)[number];

export const PASS_LABEL: Record<PassId, string> = {
  walmartPlus: "Walmart+ · $98/yr",
  instacartPlus: "Instacart+ · $99/yr",
  shipt: "Shipt / Circle 360 · $99/yr",
  sams: "Sam's Club · $50/yr",
  costco: "Costco · $65/yr",
};

export type DeliveryKind = "delivery" | "pickup";

export type DeliveryService = {
  id: string;
  name: string;
  blurb: string;
  storeId: StoreId;
  kind: DeliveryKind;
  markup: number;
  pass: PassId | null;
  annual: number;
  minFree: number;
  memberFee: number;
  memberFeeUnder: number;
  guestFee: number;
  guestFeeUnder: number;
  serviceRate: number;
  serviceMin: number;
  tipRate: number;
  far?: boolean;
  available: boolean;
};

export const DELIVERY_SERVICES: DeliveryService[] = [
  {
    id: "walmart-plus",
    name: "Walmart+ to the door",
    blurb: "Same Supercenter shelf prices, no markup. The pass that actually ships 32080.",
    storeId: "walmart",
    kind: "delivery",
    markup: 1,
    pass: "walmartPlus",
    annual: 98,
    minFree: 35,
    memberFee: 0,
    memberFeeUnder: 6.99,
    guestFee: 7.95,
    guestFeeUnder: 9.95,
    serviceRate: 0,
    serviceMin: 0,
    tipRate: 0.1,
    available: true,
  },
  {
    id: "walmart-guest",
    name: "Walmart delivery, no pass",
    blurb: "Still in-store prices. You pay the per-trip fee instead of $98 a year.",
    storeId: "walmart",
    kind: "delivery",
    markup: 1,
    pass: null,
    annual: 0,
    minFree: 35,
    memberFee: 7.95,
    memberFeeUnder: 9.95,
    guestFee: 7.95,
    guestFeeUnder: 9.95,
    serviceRate: 0,
    serviceMin: 0,
    tipRate: 0.1,
    available: true,
  },
  {
    id: "instacart-aldi",
    name: "Instacart · Aldi",
    blurb: "Cheapest groceries on the book, then Instacart marks them up and adds a service fee.",
    storeId: "aldi",
    kind: "delivery",
    markup: 1.1,
    pass: "instacartPlus",
    annual: 99,
    minFree: 10,
    memberFee: 0,
    memberFeeUnder: 0,
    guestFee: 5.99,
    guestFeeUnder: 9.99,
    serviceRate: 0.05,
    serviceMin: 2,
    tipRate: 0.1,
    available: true,
  },
  {
    id: "instacart-publix",
    name: "Instacart · Publix",
    blurb: "Anastasia Plaza shopped for you. Convenient. Rarely the cheap door.",
    storeId: "publix",
    kind: "delivery",
    markup: 1.08,
    pass: "instacartPlus",
    annual: 99,
    minFree: 10,
    memberFee: 0,
    memberFeeUnder: 0,
    guestFee: 5.99,
    guestFeeUnder: 9.99,
    serviceRate: 0.05,
    serviceMin: 2,
    tipRate: 0.1,
    available: true,
  },
  {
    id: "instacart-wd",
    name: "Instacart · Winn-Dixie",
    blurb: "The A1A store, delivered. Markup on an already higher shelf.",
    storeId: "winndixie",
    kind: "delivery",
    markup: 1.1,
    pass: "instacartPlus",
    annual: 99,
    minFree: 10,
    memberFee: 0,
    memberFeeUnder: 0,
    guestFee: 5.99,
    guestFeeUnder: 9.99,
    serviceRate: 0.05,
    serviceMin: 2,
    tipRate: 0.1,
    available: true,
  },
  {
    id: "shipt-target",
    name: "Shipt · Target",
    blurb: "Circle 360 / Shipt. In-store Target prices, no markup, from US-1.",
    storeId: "target",
    kind: "delivery",
    markup: 1,
    pass: "shipt",
    annual: 99,
    minFree: 35,
    memberFee: 0,
    memberFeeUnder: 7,
    guestFee: 10,
    guestFeeUnder: 10,
    serviceRate: 0,
    serviceMin: 0,
    tipRate: 0.1,
    available: true,
  },
  {
    id: "sams-instacart",
    name: "Instacart · Sam's Club",
    blurb: "Walmart's warehouse cousin. Bulk from Beach Blvd — 38 miles, membership, markup.",
    storeId: "sams",
    kind: "delivery",
    markup: 1.08,
    pass: "sams",
    annual: 50,
    minFree: 35,
    memberFee: 0,
    memberFeeUnder: 9.99,
    guestFee: 9.99,
    guestFeeUnder: 9.99,
    serviceRate: 0.05,
    serviceMin: 2,
    tipRate: 0.1,
    far: true,
    available: true,
  },
  {
    id: "costco-instacart",
    name: "Instacart · Costco",
    blurb: "World Golf Village warehouse via Instacart. Bulk, membership, 19 miles.",
    storeId: "costco",
    kind: "delivery",
    markup: 1.08,
    pass: "costco",
    annual: 65,
    minFree: 35,
    memberFee: 0,
    memberFeeUnder: 9.99,
    guestFee: 9.99,
    guestFeeUnder: 9.99,
    serviceRate: 0.05,
    serviceMin: 2,
    tipRate: 0.1,
    far: true,
    available: true,
  },
  {
    id: "amazon-fresh",
    name: "Amazon Fresh",
    blurb: "Does not deliver this zip. Jacksonville metro only.",
    storeId: "walmart",
    kind: "delivery",
    markup: 1,
    pass: null,
    annual: 0,
    minFree: 100,
    memberFee: 0,
    memberFeeUnder: 9.95,
    guestFee: 9.95,
    guestFeeUnder: 9.95,
    serviceRate: 0,
    serviceMin: 0,
    tipRate: 0,
    available: false,
  },
  {
    id: "walmart-pickup",
    name: "Walmart pickup on US-1",
    blurb: "Free if you'll drive 8 miles. Same shelf prices. They load the car.",
    storeId: "walmart",
    kind: "pickup",
    markup: 1,
    pass: null,
    annual: 0,
    minFree: 0,
    memberFee: 0,
    memberFeeUnder: 0,
    guestFee: 0,
    guestFeeUnder: 0,
    serviceRate: 0,
    serviceMin: 0,
    tipRate: 0,
    available: true,
  },
];

export type DeliveryQuote = {
  service: DeliveryService;
  grocery: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  passSlice: number;
  landed: number;
  filled: number;
  missing: { productId: string; name: string }[];
  complete: boolean;
  note: string;
};

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function quoteService(
  service: DeliveryService,
  items: ListItem[],
  ctx: PriceContext,
  opts: { passes: Record<PassId, boolean>; deliveriesPerMonth: number },
): DeliveryQuote | null {
  if (!service.available) {
    return {
      service,
      grocery: 0,
      deliveryFee: 0,
      serviceFee: 0,
      tip: 0,
      passSlice: 0,
      landed: 0,
      filled: 0,
      missing: items.filter((i) => !i.checked).map((i) => ({
        productId: i.productId,
        name: PRODUCT_MAP[i.productId]?.name ?? i.productId,
      })),
      complete: false,
      note: "Not offered at 32080.",
    };
  }

  const active = items.filter((i) => !i.checked);
  const missing: DeliveryQuote["missing"] = [];
  let grocery = 0;
  let filled = 0;
  for (const item of active) {
    const quote = quoteLine(item.productId, service.storeId, item.qty, ctx);
    if (!quote) {
      missing.push({
        productId: item.productId,
        name: PRODUCT_MAP[item.productId]?.name ?? item.productId,
      });
      continue;
    }
    grocery += quote.cost * service.markup;
    filled += 1;
  }
  grocery = r2(grocery);
  const hasPass = service.pass ? opts.passes[service.pass] : false;
  const overMin = grocery >= service.minFree;
  const trips = Math.max(1, opts.deliveriesPerMonth) * 12;

  let fee: number;
  let passSlice = 0;
  if (service.id === "walmart-guest" || service.pass == null) {
    fee = overMin ? service.guestFee : service.guestFeeUnder;
  } else if (hasPass) {
    fee = overMin ? service.memberFee : service.memberFeeUnder;
  } else {
    fee = overMin ? service.memberFee : service.memberFeeUnder;
    passSlice = r2(service.annual / trips);
  }

  const serviceFee =
    service.serviceRate > 0 ? r2(Math.max(service.serviceMin, grocery * service.serviceRate)) : 0;
  const tip = r2(grocery * service.tipRate);
  const landed = r2(grocery + fee + serviceFee + tip + passSlice);
  const complete = missing.length === 0 && active.length > 0;
  const note = active.length === 0
    ? "Empty list."
    : complete
      ? "Fills the whole list."
      : `Missing ${missing.map((m) => m.name).join(", ")}.`;

  return {
    service,
    grocery,
    deliveryFee: fee,
    serviceFee,
    tip,
    passSlice,
    landed,
    filled,
    missing,
    complete,
    note,
  };
}

export function quoteAllDeliveries(
  items: ListItem[],
  ctx: PriceContext,
  opts: { passes: Record<PassId, boolean>; deliveriesPerMonth: number; includeFar: boolean },
): DeliveryQuote[] {
  const quotes: DeliveryQuote[] = [];
  for (const service of DELIVERY_SERVICES) {
    if (service.far && !opts.includeFar) continue;
    const q = quoteService(service, items, ctx, opts);
    if (q) quotes.push(q);
  }
  return quotes.sort((a, b) => {
    if (a.service.available !== b.service.available) return a.service.available ? -1 : 1;
    if (a.service.kind !== b.service.kind) return a.service.kind === "delivery" ? -1 : 1;
    if (a.complete !== b.complete) return a.complete ? -1 : 1;
    return a.landed - b.landed;
  });
}

export function cheapestShip(quotes: DeliveryQuote[]): DeliveryQuote | undefined {
  return quotes.find((q) => q.service.kind === "delivery" && q.service.available && q.filled > 0);
}

export function walmartPlusBreakEven(guestFee = 7.95, annual = 98): number {
  return Math.ceil(annual / guestFee);
}
