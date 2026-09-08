import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_INVENTORY, SEED_LIST, SEED_STAPLES, SEED_WATCHED } from "./seed";
import { overrideKey } from "./pricing";
import type {
  InventoryItem,
  ListItem,
  PantryLocation,
  PriceLog,
  StoreId,
} from "./types";

type GroceryState = {
  overrides: Record<string, number>;
  logs: PriceLog[];
  inventory: InventoryItem[];
  list: ListItem[];
  clippedPromoIds: string[];
  includeFar: boolean;
  setIncludeFar: (v: boolean) => void;
  lastStoreId: StoreId;
  setLastStoreId: (id: StoreId) => void;
  staples: string[];
  toggleStaple: (productId: string) => void;
  addMissingStaples: () => number;
  watched: string[];
  toggleWatched: (productId: string) => void;
  budget: number;
  setBudget: (n: number) => void;
  logPrices: (
    entries: { productId: string; storeId: StoreId; price: number; note?: string }[],
  ) => void;
  clearOverride: (storeId: StoreId, productId: string) => void;
  clipPromo: (id: string) => void;
  unclipPromo: (id: string) => void;
  addToList: (productId: string, qty?: number, store?: StoreId | "cheapest") => void;
  blendIntoList: (
    items: { productId: string; qty: number }[],
    mode: "add" | "replace",
  ) => void;
  updateListItem: (id: string, patch: Partial<ListItem>) => void;
  removeListItem: (id: string) => void;
  toggleChecked: (id: string) => void;
  clearChecked: () => void;
  addInventory: (item: Omit<InventoryItem, "id">) => void;
  updateInventory: (id: string, patch: Partial<InventoryItem>) => void;
  removeInventory: (id: string) => void;
  restockFromList: () => void;
  resetDemo: () => void;
};

function nid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const initialClipped = [
  "tgt-avocado-circle",
  "tgt-yogurt-dotw",
  "tgt-cheerios-coupon",
  "tgt-laundry",
];

export const useGroceryStore = create<GroceryState>()(
  persist(
    (set, get) => ({
      overrides: {},
      logs: [],
      inventory: SEED_INVENTORY,
      list: SEED_LIST,
      clippedPromoIds: initialClipped,
      includeFar: false,
      setIncludeFar: (v) => set({ includeFar: v }),
      lastStoreId: "publix",
      setLastStoreId: (id) => set({ lastStoreId: id }),
      staples: SEED_STAPLES,
      toggleStaple: (productId) => {
        const has = get().staples.includes(productId);
        set({
          staples: has
            ? get().staples.filter((id) => id !== productId)
            : [...get().staples, productId],
        });
      },
      addMissingStaples: () => {
        const list = get().list;
        const inv = get().inventory;
        let added = 0;
        for (const productId of get().staples) {
          const onList = list.some((i) => i.productId === productId && !i.checked);
          if (onList) continue;
          const stock = inv.find((i) => i.productId === productId);
          if (stock && stock.qty > stock.lowAt) continue;
          get().addToList(productId, 1);
          added += 1;
        }
        return added;
      },
      watched: SEED_WATCHED,
      toggleWatched: (productId) => {
        const has = get().watched.includes(productId);
        set({
          watched: has
            ? get().watched.filter((id) => id !== productId)
            : [...get().watched, productId],
        });
      },
      budget: 85,
      setBudget: (n) => set({ budget: Math.max(0, n) }),
      logPrices: (entries) => {
        const now = new Date().toISOString();
        const next = { ...get().overrides };
        const logs = [...get().logs];
        for (const e of entries) {
          next[overrideKey(e.storeId, e.productId)] = e.price;
          logs.unshift({
            id: nid("log"),
            productId: e.productId,
            storeId: e.storeId,
            price: e.price,
            observedAt: now,
            note: e.note,
          });
        }
        set({ overrides: next, logs: logs.slice(0, 400) });
      },
      clearOverride: (storeId, productId) => {
        const next = { ...get().overrides };
        delete next[overrideKey(storeId, productId)];
        set({ overrides: next });
      },
      clipPromo: (id) => {
        if (get().clippedPromoIds.includes(id)) return;
        set({ clippedPromoIds: [...get().clippedPromoIds, id] });
      },
      unclipPromo: (id) => {
        set({ clippedPromoIds: get().clippedPromoIds.filter((x) => x !== id) });
      },
      addToList: (productId, qty = 1, store = "cheapest") => {
        const existing = get().list.find((i) => i.productId === productId && !i.checked);
        if (existing) {
          set({
            list: get().list.map((i) =>
              i.id === existing.id ? { ...i, qty: i.qty + qty } : i,
            ),
          });
          return;
        }
        set({
          list: [
            ...get().list,
            {
              id: nid("li"),
              productId,
              qty,
              preferredStore: store,
              checked: false,
            },
          ],
        });
      },
      blendIntoList: (items, mode) => {
        const merged = new Map<string, number>();
        for (const item of items) {
          merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.qty);
        }
        if (mode === "replace") {
          const checked = get().list.filter((i) => i.checked);
          set({
            list: [
              ...checked,
              ...[...merged.entries()].map(([productId, qty]) => ({
                id: nid("li"),
                productId,
                qty,
                preferredStore: "cheapest" as const,
                checked: false,
              })),
            ],
          });
          return;
        }
        for (const [productId, qty] of merged) {
          get().addToList(productId, qty);
        }
      },
      updateListItem: (id, patch) => {
        set({
          list: get().list.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        });
      },
      removeListItem: (id) => {
        set({ list: get().list.filter((i) => i.id !== id) });
      },
      toggleChecked: (id) => {
        set({
          list: get().list.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
        });
      },
      clearChecked: () => {
        set({ list: get().list.filter((i) => !i.checked) });
      },
      addInventory: (item) => {
        set({ inventory: [...get().inventory, { ...item, id: nid("inv") }] });
      },
      updateInventory: (id, patch) => {
        set({
          inventory: get().inventory.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        });
      },
      removeInventory: (id) => {
        set({ inventory: get().inventory.filter((i) => i.id !== id) });
      },
      restockFromList: () => {
        const checked = get().list.filter((i) => i.checked);
        const inv = [...get().inventory];
        for (const item of checked) {
          const existing = inv.find((x) => x.productId === item.productId);
          if (existing) {
            existing.qty += item.qty;
          } else {
            inv.push({
              id: nid("inv"),
              productId: item.productId,
              qty: item.qty,
              location: "pantry" as PantryLocation,
              lowAt: 1,
            });
          }
        }
        set({ inventory: inv, list: get().list.filter((i) => !i.checked) });
      },
      resetDemo: () => {
        set({
          overrides: {},
          logs: [],
          inventory: SEED_INVENTORY,
          list: SEED_LIST,
          clippedPromoIds: initialClipped,
          includeFar: false,
          lastStoreId: "publix",
          staples: SEED_STAPLES,
          watched: SEED_WATCHED,
          budget: 85,
        });
      },
    }),
    {
      name: "aisle-scout-v1",
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GroceryState>;
        return {
          ...current,
          ...p,
          lastStoreId: p.lastStoreId ?? current.lastStoreId,
          staples: p.staples ?? current.staples,
          watched: p.watched ?? current.watched,
          budget: p.budget ?? current.budget,
        };
      },
    },
  ),
);

export function rehydrateGrocery(): void {
  void useGroceryStore.persist.rehydrate();
}
