import type { InventoryItem, ListItem } from "./types";

export const SEED_INVENTORY: InventoryItem[] = [
  {
    id: "inv-milk",
    productId: "whole-milk",
    qty: 0.4,
    location: "fridge",
    expiresOn: "2026-09-09",
    lowAt: 0.5,
  },
  {
    id: "inv-eggs",
    productId: "eggs",
    qty: 4,
    location: "fridge",
    expiresOn: "2026-09-18",
    lowAt: 6,
  },
  {
    id: "inv-spinach",
    productId: "spinach",
    qty: 1,
    location: "fridge",
    expiresOn: "2026-09-08",
    lowAt: 1,
  },
  {
    id: "inv-butter",
    productId: "butter",
    qty: 1,
    location: "fridge",
    expiresOn: "2026-10-02",
    lowAt: 1,
  },
  {
    id: "inv-chicken",
    productId: "chicken-breast",
    qty: 1.2,
    location: "freezer",
    expiresOn: "2026-10-20",
    lowAt: 1,
  },
  {
    id: "inv-rice",
    productId: "white-rice",
    qty: 1,
    location: "pantry",
    lowAt: 1,
  },
  {
    id: "inv-tp",
    productId: "toilet-paper",
    qty: 1,
    location: "other",
    lowAt: 1,
  },
  {
    id: "inv-coffee",
    productId: "coffee",
    qty: 0.2,
    location: "pantry",
    lowAt: 0.4,
  },
  {
    id: "inv-bananas",
    productId: "bananas",
    qty: 3,
    location: "other",
    expiresOn: "2026-09-10",
    lowAt: 4,
  },
  {
    id: "inv-shampoo",
    productId: "shampoo",
    qty: 0.2,
    location: "other",
    lowAt: 0.4,
  },
];

export const SEED_LIST: ListItem[] = [
  { id: "li-straw", productId: "strawberries", qty: 2, preferredStore: "cheapest", checked: false },
  { id: "li-milk", productId: "whole-milk", qty: 1, preferredStore: "cheapest", checked: false },
  { id: "li-eggs", productId: "eggs", qty: 1, preferredStore: "cheapest", checked: false },
  { id: "li-chicken", productId: "chicken-breast", qty: 2, preferredStore: "cheapest", checked: false },
  { id: "li-pasta", productId: "spaghetti", qty: 2, preferredStore: "cheapest", checked: false },
  { id: "li-sauce", productId: "marinara", qty: 2, preferredStore: "cheapest", checked: false },
  { id: "li-bacon", productId: "bacon", qty: 2, preferredStore: "cheapest", checked: false },
  { id: "li-bananas", productId: "bananas", qty: 3, preferredStore: "cheapest", checked: false },
  { id: "li-tp", productId: "toilet-paper", qty: 1, preferredStore: "cheapest", checked: false },
  { id: "li-coffee", productId: "coffee", qty: 1, preferredStore: "cheapest", checked: false },
  { id: "li-towels", productId: "paper-towels", qty: 2, preferredStore: "cheapest", checked: false },
  { id: "li-shampoo", productId: "shampoo", qty: 1, preferredStore: "cheapest", checked: false },
  { id: "li-beer", productId: "beer-12", qty: 1, preferredStore: "cheapest", checked: false },
];

export const SEED_STAPLES = [
  "whole-milk",
  "eggs",
  "bananas",
  "white-bread",
  "coffee",
  "toilet-paper",
  "shampoo",
];

export const SEED_WATCHED = ["chicken-breast", "strawberries", "paper-towels", "vodka-175"];
