import { CATALOG, type CatalogItem } from "./catalog";

export type ParsedLine = {
  raw: string;
  qty: number;
  query: string;
};

export type BlendMatch = {
  raw: string;
  qty: number;
  query: string;
  product: CatalogItem | null;
  score: number;
  alternatives: CatalogItem[];
};

const ALIASES: [string, string][] = [
  ["chicken broth", "chicken-broth"],
  ["chicken breast", "chicken-breast"],
  ["rotisserie chicken", "rotisserie"],
  ["ground turkey", "ground-turkey"],
  ["ground beef", "ground-beef"],
  ["peanut butter", "peanut-butter"],
  ["pasta sauce", "marinara"],
  ["spaghetti sauce", "marinara"],
  ["tomato sauce", "marinara"],
  ["toilet paper", "toilet-paper"],
  ["paper towels", "paper-towels"],
  ["paper towel", "paper-towels"],
  ["laundry detergent", "detergent"],
  ["dish soap", "dish-soap"],
  ["trash bags", "trash-bags"],
  ["almond milk", "almond-milk"],
  ["whole milk", "whole-milk"],
  ["2% milk", "2pct-milk"],
  ["2 percent milk", "2pct-milk"],
  ["greek yogurt", "greek-yogurt"],
  ["cream cheese", "cream-cheese"],
  ["cottage cheese", "cottage-cheese"],
  ["string cheese", "string-cheese"],
  ["sour cream", "sour-cream"],
  ["half and half", "half-half"],
  ["half & half", "half-half"],
  ["olive oil", "olive-oil"],
  ["orange juice", "oj"],
  ["coca cola", "coke-12"],
  ["coca-cola", "coke-12"],
  ["sparkling water", "sparkling"],
  ["bottled water", "water-24"],
  ["sweet tea", "sweet-tea"],
  ["hot dogs", "hot-dogs"],
  ["deli turkey", "deli-turkey"],
  ["pork chops", "pork-chops"],
  ["wheat bread", "wheat-bread"],
  ["white bread", "white-bread"],
  ["hamburger buns", "hamburger-buns"],
  ["frozen pizza", "frozen-pizza"],
  ["ice cream", "ice-cream"],
  ["frozen berries", "frozen-berries"],
  ["mixed berries", "frozen-berries"],
  ["baby spinach", "spinach"],
  ["bell peppers", "bell-peppers"],
  ["bell pepper", "bell-peppers"],
  ["grape tomatoes", "grape-tomatoes"],
  ["roma tomatoes", "roma-tomatoes"],
  ["sweet potatoes", "sweet-potatoes"],
  ["red onions", "red-onions"],
  ["yellow onions", "yellow-onions"],
  ["green onions", "green-onions"],
  ["black beans", "black-beans"],
  ["potato chips", "chips"],
  ["chicken nuggets", "nuggets"],
  ["milk", "whole-milk"],
  ["eggs", "eggs"],
  ["egg", "eggs"],
  ["chicken", "chicken-breast"],
  ["beef", "ground-beef"],
  ["hamburger", "ground-beef"],
  ["turkey", "deli-turkey"],
  ["bacon", "bacon"],
  ["pasta", "spaghetti"],
  ["spaghetti", "spaghetti"],
  ["sauce", "marinara"],
  ["marinara", "marinara"],
  ["prego", "marinara"],
  ["tp", "toilet-paper"],
  ["tide", "detergent"],
  ["laundry", "detergent"],
  ["detergent", "detergent"],
  ["bounty", "paper-towels"],
  ["charmin", "toilet-paper"],
  ["dawn", "dish-soap"],
  ["coke", "coke-12"],
  ["soda", "coke-12"],
  ["oj", "oj"],
  ["bread", "white-bread"],
  ["yogurt", "greek-yogurt"],
  ["chobani", "greek-yogurt"],
  ["avocado", "avocados"],
  ["avocados", "avocados"],
  ["tomato", "roma-tomatoes"],
  ["tomatoes", "roma-tomatoes"],
  ["lettuce", "iceberg"],
  ["apples", "gala-apples"],
  ["potatoes", "russets"],
  ["onion", "yellow-onions"],
  ["onions", "yellow-onions"],
  ["pb", "peanut-butter"],
  ["jelly", "grape-jelly"],
  ["rice", "white-rice"],
  ["oats", "oatmeal"],
  ["oatmeal", "oatmeal"],
  ["oil", "olive-oil"],
  ["coffee", "coffee"],
  ["folgers", "coffee"],
  ["cheerios", "cheerios"],
  ["cereal", "cheerios"],
  ["tuna", "tuna"],
  ["beans", "black-beans"],
  ["broth", "chicken-broth"],
  ["chips", "chips"],
  ["lays", "chips"],
  ["salsa", "salsa"],
  ["ketchup", "ketchup"],
  ["heinz", "ketchup"],
  ["mayo", "mayo"],
  ["mayonnaise", "mayo"],
  ["flour", "flour"],
  ["sugar", "sugar"],
  ["tortillas", "tortillas"],
  ["buns", "hamburger-buns"],
  ["bagels", "bagels"],
  ["pizza", "frozen-pizza"],
  ["nuggets", "nuggets"],
  ["water", "water-24"],
  ["lacroix", "sparkling"],
  ["tea", "sweet-tea"],
  ["cheese", "cheddar"],
  ["butter", "butter"],
  ["shrimp", "shrimp"],
  ["salmon", "salmon"],
  ["bananas", "bananas"],
  ["banana", "bananas"],
  ["strawberries", "strawberries"],
  ["berries", "strawberries"],
  ["shampoo", "shampoo"],
  ["conditioner", "conditioner"],
  ["body wash", "body-wash"],
  ["dove soap", "bar-soap"],
  ["soap", "bar-soap"],
  ["toothpaste", "toothpaste"],
  ["crest", "toothpaste"],
  ["deodorant", "deodorant"],
  ["lotion", "lotion"],
  ["razors", "razors"],
  ["salt", "salt"],
  ["black pepper", "black-pepper"],
  ["pepper", "black-pepper"],
  ["garlic powder", "garlic-powder"],
  ["italian seasoning", "italian-seasoning"],
  ["cinnamon", "cinnamon"],
  ["taco seasoning", "taco-seasoning"],
  ["beer", "beer-12"],
  ["miller", "beer-12"],
  ["white claw", "seltzer-12"],
  ["seltzer", "seltzer-12"],
  ["wine", "wine-chard"],
  ["chardonnay", "wine-chard"],
  ["vodka", "vodka-175"],
  ["titos", "vodka-175"],
  ["bourbon", "whiskey-175"],
  ["whiskey", "whiskey-175"],
];

const ALIAS_BY_LENGTH = [...ALIASES].sort((a, b) => b[0].length - a[0].length);

const STOP = new Set([
  "a",
  "an",
  "the",
  "some",
  "of",
  "and",
  "or",
  "for",
  "with",
  "fresh",
  "organic",
  "need",
  "get",
  "buy",
  "grab",
  "please",
]);

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s%+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s: string): string[] {
  return norm(s)
    .split(" ")
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function splitListText(text: string): string[] {
  const lines = text
    .split(/\n|;/)
    .map((s) => s.replace(/^[-*•]+\s+/, "").replace(/^\d+[.)]\s+/, "").trim())
    .filter(Boolean);
  if (lines.length === 1 && (lines[0]!.match(/,/g) ?? []).length >= 2) {
    return lines[0]!.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return lines;
}

export function parseLine(raw: string): ParsedLine {
  let rest = raw.trim().replace(/^[-*•]+\s+/, "").replace(/^\d+[.)]\s+/, "");
  let qty = 1;
  const leading = rest.match(/^(\d+(?:\.\d+)?)\s*(x|×)?\s+/i);
  if (leading) {
    qty = Number(leading[1]);
    rest = rest.slice(leading[0].length);
  } else if (/^dozens?\b/i.test(rest)) {
    rest = rest.replace(/^dozens?\s+/i, "");
  }
  rest = rest.replace(
    /^(lbs?|pounds?|oz|ounces?|gallons?|gals?|bags?|packs?|bunches?|loaves|loaf|heads?)\s+(of\s+)?/i,
    "",
  );
  rest = rest.replace(
    /\s+(lbs?|pounds?|oz|ounces?|gallons?|gals?|bags?|packs?|dozen|dozens)$/i,
    "",
  );
  return { raw, qty: Number.isFinite(qty) && qty > 0 ? qty : 1, query: rest.trim() };
}

function haystack(p: CatalogItem): string {
  return norm(`${p.id.replace(/-/g, " ")} ${p.name} ${p.brand ?? ""}`);
}

function scoreProduct(query: string, p: CatalogItem): number {
  const q = norm(query);
  if (!q) return 0;
  const hay = haystack(p);
  if (hay === q || norm(p.name) === q || p.id === q.replace(/\s+/g, "-")) return 1;
  if (hay.startsWith(q) || norm(p.name).startsWith(q)) return 0.92;
  const word = new RegExp(`(?:^| )${q}(?:$| )`);
  if (word.test(hay)) return 0.88;
  const qt = tokens(q);
  const ht = new Set(tokens(hay));
  if (qt.length === 0) return 0;
  const hit = qt.filter((t) => ht.has(t) || [...ht].some((h) => h.startsWith(t) || t.startsWith(h))).length;
  return hit / qt.length;
}

function aliasId(query: string): string | undefined {
  const q = norm(query);
  for (const [alias, id] of ALIAS_BY_LENGTH) {
    if (q === alias || q.startsWith(`${alias} `) || q.endsWith(` ${alias}`)) return id;
  }
  return undefined;
}

export function matchLine(line: ParsedLine): BlendMatch {
  const aliased = aliasId(line.query);
  const scored = CATALOG.map((p) => ({
    p,
    s: (aliased === p.id ? 1 : 0) * 0.15 + scoreProduct(line.query, p),
  }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 4);

  const top = scored[0];
  const product =
    (top && top.s >= 0.55 ? top.p : null) ??
    (aliased ? (CATALOG.find((p) => p.id === aliased) ?? null) : null);
  const alternatives = scored
    .filter((x) => x.s >= 0.45 && x.p.id !== product?.id)
    .map((x) => x.p)
    .slice(0, 3);

  return {
    raw: line.raw,
    qty: line.qty,
    query: line.query,
    product,
    score: product ? Math.max(top?.s ?? 0, aliased ? 0.95 : 0) : top?.s ?? 0,
    alternatives,
  };
}

export function blendList(text: string): BlendMatch[] {
  const seen = new Set<string>();
  const out: BlendMatch[] = [];
  for (const raw of splitListText(text)) {
    const parsed = parseLine(raw);
    if (!parsed.query) continue;
    const match = matchLine(parsed);
    const key = match.product?.id ?? `raw:${norm(parsed.query)}`;
    if (seen.has(key) && match.product) {
      const existing = out.find((m) => m.product?.id === match.product?.id);
      if (existing) existing.qty += match.qty;
      continue;
    }
    seen.add(key);
    out.push(match);
  }
  return out;
}

export const SAMPLE_LIST = `gallon of milk
dozen eggs
2 lb chicken breast
strawberries
bananas
spaghetti
pasta sauce
tide
toilet paper
coffee
bacon
paper towels`;
