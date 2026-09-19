/** Shelf tags beat website/API dollars. `live:` notes are from official feeds. */

export function isShelfLog(note?: string): boolean {
  return !note?.startsWith("live:");
}

export function keepLiveQuotes<T extends { productId: string; storeId: string }>(
  entries: T[],
  logs: { productId: string; storeId: string; note?: string }[],
): T[] {
  return entries.filter((e) => {
    const shelf = logs.find(
      (l) =>
        l.productId === e.productId &&
        l.storeId === e.storeId &&
        isShelfLog(l.note),
    );
    return !shelf;
  });
}
