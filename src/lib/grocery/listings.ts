import { MARKET_ZIP } from "./types";
import { PRODUCT_MAP } from "./catalog";
import { upcFor } from "./barcodes";

export type ListingKind = "shop" | "ad" | "pickup";

export type ListingLink = {
  id: string;
  label: string;
  href: string;
  kind: ListingKind;
  note?: string;
};

const ZIP = MARKET_ZIP;
const WALMART_STORE = "579";

function q(s: string) {
  return encodeURIComponent(s);
}

export function productQuery(productId: string): string {
  const p = PRODUCT_MAP[productId];
  if (!p) return productId;
  return [p.brand, p.name].filter(Boolean).join(" ");
}

/** Official store pages for 32080 — no scraping. */
export function storefronts(): ListingLink[] {
  return [
    {
      id: "walmart",
      label: "Walmart #579",
      href: `https://www.walmart.com/store/${WALMART_STORE}-st-augustine-fl`,
      kind: "pickup",
      note: "US-1 Supercenter",
    },
    {
      id: "instacart",
      label: "Instacart",
      href: `https://www.instacart.com/store?zipcode=${ZIP}`,
      kind: "shop",
      note: "Publix, Aldi, and more to the house",
    },
    {
      id: "publix",
      label: "Publix",
      href: "https://www.publix.com/shop",
      kind: "shop",
      note: "Anastasia Plaza + weekly BOGOs",
    },
    {
      id: "target",
      label: "Target",
      href: `https://www.target.com/store-locator/find-stores?address=${ZIP}`,
      kind: "shop",
    },
    {
      id: "aldi",
      label: "Aldi",
      href: "https://www.aldi.us/en/weekly-specials/",
      kind: "ad",
      note: "This week’s produce",
    },
    {
      id: "flipp",
      label: "Flipp ads",
      href: `https://flipp.com/en-us/${ZIP}/flyers`,
      kind: "ad",
      note: "Every circular in 32080",
    },
    {
      id: "shipt",
      label: "Shipt",
      href: "https://www.shipt.com/",
      kind: "shop",
      note: "Target + Publix delivery",
    },
    {
      id: "winndixie",
      label: "Winn-Dixie",
      href: "https://www.winndixie.com/weekly-ad",
      kind: "ad",
    },
  ];
}

export function listingsForProduct(productId: string): ListingLink[] {
  const name = productQuery(productId);
  const upc = upcFor(productId);
  return [
    {
      id: "walmart",
      label: "Walmart",
      href: `https://www.walmart.com/search?q=${q(name)}&facet=fulfillment_method:In-store`,
      kind: "shop",
      note: `Store ${WALMART_STORE}`,
    },
    {
      id: "instacart",
      label: "Instacart",
      href: `https://www.instacart.com/store/publix/s?k=${q(name)}`,
      kind: "shop",
    },
    {
      id: "publix",
      label: "Publix",
      href: `https://www.publix.com/search?searchTerm=${q(name)}`,
      kind: "shop",
    },
    {
      id: "target",
      label: "Target",
      href: `https://www.target.com/s?searchTerm=${q(name)}`,
      kind: "shop",
    },
    {
      id: "aldi",
      label: "Aldi",
      href: `https://www.aldi.us/en/search/?q=${q(name)}`,
      kind: "shop",
    },
    {
      id: "upc",
      label: "UPC lookup",
      href: `https://www.walmart.com/search?q=${upc}`,
      kind: "shop",
      note: upc,
    },
  ];
}
