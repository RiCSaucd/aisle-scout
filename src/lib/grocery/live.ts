import { createServerFn } from "@tanstack/react-start";

export type LiveSourceStatus = {
  zip: string;
  walmartAffiliate: boolean;
  instacartPlatform: boolean;
  note: string;
};

/** Reports which official APIs are keyed. Never scrapes retailer sites. */
export const liveSourceStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<LiveSourceStatus> => {
    const walmartAffiliate = Boolean(
      process.env.WALMART_CONSUMER_ID && process.env.WALMART_PRIVATE_KEY,
    );
    const instacartPlatform = Boolean(process.env.INSTACART_API_KEY);
    return {
      zip: "32080",
      walmartAffiliate,
      instacartPlatform,
      note: walmartAffiliate || instacartPlatform
        ? "Official APIs are on — live prices merge on top of the book."
        : "No retailer API keys yet. Home opens Walmart, Instacart, Publix, and Flipp; your shelf logs still beat the book.",
    };
  },
);
