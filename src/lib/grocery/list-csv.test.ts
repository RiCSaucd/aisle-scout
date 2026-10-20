import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LIST_CSV_HEADER, listCsvFilename, listToCsv, quoteCsv } from "./list-csv.ts";

describe("quoteCsv", () => {
  it("wraps text in quotes and doubles inner quotes", () => {
    assert.equal(quoteCsv('Ben & Jerry\'s "Half Baked"'), '"Ben & Jerry\'s ""Half Baked"""');
  });

  it("keeps commas and newlines inside the quoted cell", () => {
    assert.equal(quoteCsv("Eggs, large\ndozen"), '"Eggs, large\ndozen"');
  });

  it("defuses a leading formula character", () => {
    assert.equal(quoteCsv("=HYPERLINK(1)"), `"'=HYPERLINK(1)"`);
    assert.equal(quoteCsv("-5 off"), `"'-5 off"`);
  });
});

describe("listToCsv", () => {
  it("writes only the header for an empty list", () => {
    assert.equal(listToCsv([]), `${LIST_CSV_HEADER}\n`);
  });

  it("writes one row per item with a two-decimal price", () => {
    const csv = listToCsv([
      {
        item: "Whole milk",
        size: "1 gal",
        qty: 2,
        assignedStore: "Publix",
        cheapestStore: "Walmart",
        cheapestPrice: 6.5,
      },
    ]);
    assert.equal(csv, `${LIST_CSV_HEADER}\n"Whole milk","1 gal",2,"Publix","Walmart",6.50\n`);
  });

  it("leaves the price blank when no store has a quote", () => {
    const csv = listToCsv([
      {
        item: "Saffron",
        size: "1 g",
        qty: 1,
        assignedStore: "",
        cheapestStore: "",
        cheapestPrice: null,
      },
    ]);
    assert.equal(csv.split("\n")[1], '"Saffron","1 g",1,"","",');
  });
});

describe("listCsvFilename", () => {
  it("uses the local date, zero-padded", () => {
    assert.equal(listCsvFilename(new Date(2026, 0, 5)), "aisle-scout-list-2026-01-05.csv");
  });
});
