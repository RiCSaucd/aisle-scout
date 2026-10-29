/** Shopping list → CSV. Pure so it runs under `node --test` without the app aliases. */

export type ListCsvRow = {
  item: string;
  size: string;
  qty: number;
  assignedStore: string;
  cheapestStore: string;
  cheapestPrice: number | null;
};

export const LIST_CSV_HEADER = "item,size,qty,assigned_store,cheapest_store,cheapest_price";

/** Quote a text cell, doubling inner quotes. A leading = + - @ is defused so spreadsheets don't run it. */
export function quoteCsv(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function listToCsv(rows: ListCsvRow[]): string {
  return (
    [
      LIST_CSV_HEADER,
      ...rows.map((r) =>
        [
          quoteCsv(r.item),
          quoteCsv(r.size),
          r.qty,
          quoteCsv(r.assignedStore),
          quoteCsv(r.cheapestStore),
          r.cheapestPrice === null ? "" : r.cheapestPrice.toFixed(2),
        ].join(","),
      ),
    ].join("\n") + "\n"
  );
}

/** `aisle-scout-list-2026-10-20.csv`, using the local date. */
export function listCsvFilename(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `aisle-scout-list-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.csv`;
}
