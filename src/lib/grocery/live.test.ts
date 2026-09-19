import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isShelfLog, keepLiveQuotes } from "./live-rules.ts";

describe("isShelfLog", () => {
  it("treats a scanned aisle tag as a shelf log", () => {
    assert.equal(isShelfLog("scanned"), true);
  });

  it("treats a missing note as a shelf log", () => {
    assert.equal(isShelfLog(undefined), true);
  });

  it("does not treat a live Walmart I/O quote as a shelf log", () => {
    assert.equal(isShelfLog("live:walmart-io"), false);
  });
});

describe("keepLiveQuotes", () => {
  it("skips a live Walmart quote when a shelf log exists for that SKU and store", () => {
    const kept = keepLiveQuotes(
      [
        {
          productId: "strawberries",
          storeId: "walmart",
          price: 2.48,
          note: "live:walmart-io",
        },
      ],
      [
        {
          productId: "strawberries",
          storeId: "walmart",
          note: "scanned",
        },
      ],
    );
    assert.deepEqual(kept, []);
  });

  it("keeps a live quote when the only prior log is another live quote", () => {
    const quote = {
      productId: "strawberries",
      storeId: "walmart",
      price: 2.48,
      note: "live:walmart-io",
    };
    const kept = keepLiveQuotes([quote], [
      {
        productId: "strawberries",
        storeId: "walmart",
        note: "live:walmart-io",
      },
    ]);
    assert.deepEqual(kept, [quote]);
  });

  it("does not let a Publix shelf tag block a Walmart live quote", () => {
    const quote = {
      productId: "strawberries",
      storeId: "walmart",
      price: 2.48,
      note: "live:walmart-io",
    };
    const kept = keepLiveQuotes([quote], [
      {
        productId: "strawberries",
        storeId: "publix",
        note: "scanned",
      },
    ]);
    assert.deepEqual(kept, [quote]);
  });
});
