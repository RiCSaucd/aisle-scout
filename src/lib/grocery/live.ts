import { createServerFn } from "@tanstack/react-start";
import { PRODUCT_MAP } from "./catalog";
import { upcFor } from "./barcodes";
import { productQuery } from "./listings";
import type { StoreId, Unit } from "./types";

export type LiveSourceStatus = {
  zip: string;
  walmartAffiliate: boolean;
  instacartPlatform: boolean;
  note: string;
};

export type LiveQuote = {
  productId: string;
  storeId: StoreId;
  price: number;
  name: string;
  upc?: string;
  url?: string;
  note: string;
};

export function isShelfLog(note?: string): boolean {
  return !note?.startsWith("live:");
}

function walmartReady() {
  return Boolean(process.env.WALMART_CONSUMER_ID && process.env.WALMART_PRIVATE_KEY);
}

function instacartReady() {
  return Boolean(process.env.INSTACART_API_KEY);
}

/** Reports which official APIs are keyed. Never scrapes retailer sites. */
export const liveSourceStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<LiveSourceStatus> => {
    const walmartAffiliate = walmartReady();
    const instacartPlatform = instacartReady();
    return {
      zip: "32080",
      walmartAffiliate,
      instacartPlatform,
      note: walmartAffiliate || instacartPlatform
        ? "Official APIs are on — live prices merge on top of the book. A scanned shelf tag still wins."
        : "Add WALMART_CONSUMER_ID + WALMART_PRIVATE_KEY and INSTACART_API_KEY to pull live dollars and push the list. Until then we open the store pages; your shelf logs still beat the book.",
    };
  },
);

async function walmartHeaders(): Promise<Record<string, string> | null> {
  const consumerId = process.env.WALMART_CONSUMER_ID;
  const privateKey = process.env.WALMART_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const keyVersion = process.env.WALMART_KEY_VERSION ?? "1";
  if (!consumerId || !privateKey) return null;
  const { createSign } = await import("node:crypto");
  const timestamp = String(Date.now());
  const payload = `${consumerId}\n${timestamp}\n${keyVersion}\n`;
  const sign = createSign("RSA-SHA256");
  sign.update(payload);
  sign.end();
  const signature = sign.sign(privateKey, "base64");
  return {
    Accept: "application/json",
    "WM_CONSUMER.ID": consumerId,
    "WM_CONSUMER.INTIMESTAMP": timestamp,
    "WM_SEC.KEY_VERSION": keyVersion,
    "WM_SEC.AUTH_SIGNATURE": signature,
  };
}

type WalmartItem = {
  name?: string;
  salePrice?: number;
  upc?: string;
  productUrl?: string;
  itemId?: number | string;
};

async function walmartSearch(query: string): Promise<WalmartItem | null> {
  const headers = await walmartHeaders();
  if (!headers) return null;
  const publisher = process.env.WALMART_PUBLISHER_ID;
  const params = new URLSearchParams({ query, numItems: "5" });
  if (publisher) params.set("publisherId", publisher);
  const res = await fetch(
    `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?${params}`,
    { headers },
  );
  if (!res.ok) return null;
  const body = (await res.json()) as { items?: WalmartItem[] };
  const items = body.items ?? [];
  return items.find((i) => typeof i.salePrice === "number") ?? items[0] ?? null;
}

export const lookupWalmartAisle = createServerFn({ method: "POST" })
  .validator((input: { productIds: string[] }) => input)
  .handler(async ({ data }): Promise<{ ok: true; quotes: LiveQuote[] } | { ok: false; reason: string }> => {
    if (!walmartReady()) {
      return { ok: false, reason: "missing-keys" };
    }
    const quotes: LiveQuote[] = [];
    for (const productId of data.productIds.slice(0, 12)) {
      const product = PRODUCT_MAP[productId];
      if (!product) continue;
      try {
        const hit = await walmartSearch(productQuery(productId));
        if (!hit || typeof hit.salePrice !== "number") continue;
        quotes.push({
          productId,
          storeId: "walmart",
          price: hit.salePrice,
          name: hit.name ?? product.name,
          upc: hit.upc,
          url: hit.productUrl,
          note: "live:walmart-io",
        });
      } catch {
        /* skip one SKU, keep the rest */
      }
    }
    return { ok: true, quotes };
  });

function instacartUnit(unit: Unit): string {
  if (unit === "lb") return "lb";
  if (unit === "oz") return "oz";
  return "each";
}

export const pushInstacartList = createServerFn({ method: "POST" })
  .validator((input: { items: { productId: string; qty: number }[]; title?: string }) => input)
  .handler(
    async ({
      data,
    }): Promise<
      { ok: true; url: string } | { ok: false; reason: string; fallbackUrl: string }
    > => {
      const fallbackUrl = "https://www.instacart.com/store?zipcode=32080";
      const key = process.env.INSTACART_API_KEY;
      if (!key) {
        return { ok: false, reason: "missing-keys", fallbackUrl };
      }
      const host =
        process.env.INSTACART_ENV === "development"
          ? "https://connect.dev.instacart.tools"
          : "https://connect.instacart.com";
      const line_items = data.items
        .map((row) => {
          const product = PRODUCT_MAP[row.productId];
          if (!product) return null;
          return {
            name: product.name,
            display_text: `${product.name} · ${product.size}`,
            upcs: [upcFor(product.id)],
            line_item_measurements: [
              { quantity: row.qty, unit: instacartUnit(product.unit) },
            ],
          };
        })
        .filter((x): x is NonNullable<typeof x> => x != null);

      const res = await fetch(`${host}/idp/v1/products/products_link`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          title: data.title ?? "Aisle Scout · 32080",
          link_type: "shopping_list",
          line_items,
          landing_page_configuration: { enable_pantry_items: true },
        }),
      });
      if (!res.ok) {
        return { ok: false, reason: `instacart-${res.status}`, fallbackUrl };
      }
      const body = (await res.json()) as { products_link_url?: string };
      if (!body.products_link_url) {
        return { ok: false, reason: "no-url", fallbackUrl };
      }
      return { ok: true, url: body.products_link_url };
    },
  );
