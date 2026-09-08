import type { Category, Product, StoreId, Unit } from "./types";
import { STORE_IDS } from "./types";

export type CatalogItem = Product & {
  regular: Partial<Record<StoreId, number>>;
};

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

const GROCERS: StoreId[] = ["aldi", "walmart", "target", "publix", "winndixie"];
const CLUBS: StoreId[] = ["costco", "sams"];

function carryFor(category: Category): StoreId[] {
  switch (category) {
    case "produce":
      return [...GROCERS, ...CLUBS];
    case "dairy":
      return [...GROCERS, "cvs", "walgreens", "cstore", ...CLUBS];
    case "meat":
      return [...GROCERS, ...CLUBS];
    case "bakery":
      return [...GROCERS, "cstore", "costco"];
    case "pantry":
      return [...GROCERS, "dollargeneral", "dollartree", ...CLUBS];
    case "frozen":
      return [...GROCERS, ...CLUBS];
    case "beverages":
      return [...GROCERS, "cvs", "walgreens", "dollargeneral", "cstore", ...CLUBS];
    case "household":
      return [...GROCERS, "cvs", "walgreens", "dollargeneral", ...CLUBS];
    case "personal":
      return [...GROCERS, "cvs", "walgreens", "dollargeneral", "cstore", ...CLUBS];
    case "alcohol":
      return ["aldi", "walmart", "target", "publix", "winndixie", "abc", "cstore", ...CLUBS];
  }
}

const MARKUP: Partial<Record<StoreId, number>> = {
  winndixie: 1.2,
  cvs: 1.55,
  walgreens: 1.58,
  dollargeneral: 1.08,
  dollartree: 0.5,
  cstore: 1.9,
  abc: 1.05,
  costco: 0.78,
  sams: 0.83,
};

function expand(
  category: Category,
  base: Partial<Record<StoreId, number>>,
  only?: StoreId[],
): Partial<Record<StoreId, number>> {
  if (only) {
    const out: Partial<Record<StoreId, number>> = {};
    for (const id of only) {
      if (base[id] != null) out[id] = base[id];
    }
    return out;
  }
  const walmart = base.walmart ?? base.aldi ?? 1;
  const out: Partial<Record<StoreId, number>> = { ...base };
  if (out.winndixie == null && base.target != null && base.publix != null) {
    out.winndixie = r2((base.target + base.publix) / 2);
  }
  for (const id of carryFor(category)) {
    if (out[id] != null) continue;
    if (id === "dollartree") {
      if (walmart > 4) continue;
      out[id] = 1.25;
      continue;
    }
    const m = MARKUP[id];
    if (m == null) continue;
    out[id] = r2(walmart * m);
  }
  return out;
}

function item(
  id: string,
  name: string,
  category: Category,
  size: string,
  unit: Unit,
  aldi: number,
  walmart: number,
  target: number,
  publix: number,
  brand?: string,
  extra?: Partial<Record<StoreId, number>>,
): CatalogItem {
  return {
    id,
    name,
    brand,
    category,
    size,
    unit,
    regular: expand(category, { aldi, walmart, target, publix, ...extra }),
  };
}

function limited(
  id: string,
  name: string,
  category: Category,
  size: string,
  unit: Unit,
  prices: Partial<Record<StoreId, number>>,
  brand?: string,
): CatalogItem {
  return {
    id,
    name,
    brand,
    category,
    size,
    unit,
    regular: expand(category, prices, STORE_IDS.filter((s) => prices[s] != null)),
  };
}

/** St. Augustine market book — week of Sep 4, 2026. Everyday shelf prices before promos. */
export const CATALOG: CatalogItem[] = [
  // Produce — Aldi usually wins
  item("bananas", "Bananas", "produce", "per lb", "lb", 0.44, 0.54, 0.59, 0.69),
  item("strawberries", "Strawberries", "produce", "1 lb clamshell", "each", 2.79, 3.48, 3.99, 5.99),
  item("blueberries", "Blueberries", "produce", "18 oz", "each", 3.49, 3.98, 4.49, 5.99),
  item("raspberries", "Raspberries", "produce", "6 oz", "each", 2.49, 2.98, 3.29, 3.99),
  item("avocados", "Hass Avocados", "produce", "each", "each", 0.79, 0.98, 1.29, 1.49),
  item("roma-tomatoes", "Roma Tomatoes", "produce", "per lb", "lb", 1.19, 1.38, 1.69, 1.99),
  item("grape-tomatoes", "Grape Tomatoes", "produce", "10 oz", "each", 1.49, 1.98, 2.29, 2.79),
  item("iceberg", "Iceberg Lettuce", "produce", "head", "each", 1.29, 1.48, 1.79, 1.99),
  item("romaine", "Romaine Hearts", "produce", "3-pack", "pack", 2.49, 2.98, 3.29, 3.99),
  item("spinach", "Baby Spinach", "produce", "5 oz", "each", 1.79, 2.28, 2.49, 2.99),
  item("broccoli", "Broccoli Crowns", "produce", "per lb", "lb", 1.49, 1.78, 1.99, 2.49),
  item("cauliflower", "Cauliflower", "produce", "head", "each", 2.29, 2.68, 2.99, 3.49),
  item("carrots", "Baby Carrots", "produce", "1 lb bag", "bag", 1.19, 1.28, 1.49, 1.79),
  item("yellow-onions", "Yellow Onions", "produce", "3 lb bag", "bag", 1.99, 2.48, 2.79, 3.29),
  item("red-onions", "Red Onions", "produce", "per lb", "lb", 1.09, 1.28, 1.49, 1.69),
  item("russets", "Russet Potatoes", "produce", "5 lb bag", "bag", 2.49, 2.98, 3.49, 3.99),
  item("sweet-potatoes", "Sweet Potatoes", "produce", "per lb", "lb", 0.89, 0.98, 1.19, 1.49),
  item("garlic", "Garlic", "produce", "3-count", "pack", 0.99, 1.18, 1.49, 1.79),
  item("lemons", "Lemons", "produce", "2 lb bag", "bag", 2.49, 2.98, 3.49, 3.99),
  item("limes", "Limes", "produce", "1 lb bag", "bag", 1.49, 1.78, 1.99, 2.49),
  item("bell-peppers", "Green Bell Peppers", "produce", "each", "each", 0.59, 0.78, 0.89, 0.99),
  item("cucumbers", "Cucumbers", "produce", "each", "each", 0.59, 0.68, 0.79, 0.89),
  item("zucchini", "Zucchini", "produce", "per lb", "lb", 1.19, 1.38, 1.59, 1.89),
  item("corn", "Sweet Corn", "produce", "each", "each", 0.33, 0.48, 0.59, 0.69),
  item("gala-apples", "Gala Apples", "produce", "3 lb bag", "bag", 2.99, 3.48, 3.99, 4.49),
  item("granny-smith", "Granny Smith Apples", "produce", "per lb", "lb", 1.19, 1.38, 1.59, 1.99),
  item("oranges", "Navel Oranges", "produce", "4 lb bag", "bag", 3.49, 3.98, 4.49, 4.99),
  item("grapes", "Red Seedless Grapes", "produce", "per lb", "lb", 1.49, 1.98, 2.29, 2.99),
  item("watermelon", "Seedless Watermelon", "produce", "each", "each", 3.99, 4.98, 5.99, 6.99),
  item("cilantro", "Cilantro", "produce", "bunch", "bunch", 0.69, 0.78, 0.99, 1.29),
  item("mushrooms", "White Mushrooms", "produce", "8 oz", "each", 1.49, 1.78, 1.99, 2.49),
  item("celery", "Celery", "produce", "bunch", "bunch", 1.29, 1.48, 1.79, 1.99),
  item("asparagus", "Asparagus", "produce", "per lb", "lb", 2.49, 2.98, 3.49, 3.99),
  item("mini-peppers", "Mini Sweet Peppers", "produce", "1 lb", "bag", 2.99, 3.48, 3.99, 4.49),
  item("salad-mix", "Garden Salad Mix", "produce", "12 oz", "each", 1.99, 2.28, 2.49, 2.99),
  item("jalapenos", "Jalapeños", "produce", "per lb", "lb", 1.29, 1.48, 1.69, 1.99),
  item("mango", "Mango", "produce", "each", "each", 0.79, 0.98, 1.29, 1.49),
  item("pineapple", "Pineapple", "produce", "each", "each", 1.99, 2.48, 2.99, 3.49),
  item("green-beans", "Green Beans", "produce", "per lb", "lb", 1.49, 1.78, 1.99, 2.49),
  item("cabbage", "Green Cabbage", "produce", "head", "each", 1.49, 1.78, 1.99, 2.29),
  item("kale", "Kale", "produce", "bunch", "bunch", 1.49, 1.78, 1.99, 2.49),
  item("green-onions", "Green Onions", "produce", "bunch", "bunch", 0.69, 0.78, 0.99, 1.29),
  item("ginger", "Ginger Root", "produce", "per lb", "lb", 2.99, 3.48, 3.99, 4.49),
  item("peaches", "Peaches", "produce", "per lb", "lb", 1.49, 1.78, 1.99, 2.49),
  item("okra", "Okra", "produce", "per lb", "lb", 1.99, 2.28, 2.49, 2.99),
  item("yellow-squash", "Yellow Squash", "produce", "per lb", "lb", 1.19, 1.38, 1.59, 1.89),
  item("honeydew", "Honeydew", "produce", "each", "each", 2.99, 3.48, 3.99, 4.49),
  item("cantaloupe", "Cantaloupe", "produce", "each", "each", 2.49, 2.98, 3.49, 3.99),
  item("parsley", "Flat-Leaf Parsley", "produce", "bunch", "bunch", 0.69, 0.89, 0.99, 1.29),

  // Dairy
  item("whole-milk", "Whole Milk", "dairy", "1 gallon", "gal", 2.89, 3.24, 3.59, 4.29, "store brand"),
  item("2pct-milk", "2% Milk", "dairy", "1 gallon", "gal", 2.89, 3.24, 3.59, 4.29, "store brand"),
  item("almond-milk", "Almond Milk", "dairy", "half gallon", "each", 2.19, 2.48, 2.79, 3.29, "Almond Breeze"),
  item("eggs", "Large Eggs", "dairy", "dozen", "dozen", 2.65, 2.98, 3.49, 3.99),
  item("butter", "Salted Butter", "dairy", "1 lb", "each", 3.29, 3.68, 4.29, 4.99, "store brand"),
  item("cream-cheese", "Cream Cheese", "dairy", "8 oz", "each", 1.49, 1.98, 2.29, 2.99, "Philadelphia"),
  item("cheddar", "Shredded Cheddar", "dairy", "8 oz", "each", 1.79, 2.18, 2.49, 2.99, "store brand"),
  item("greek-yogurt", "Greek Yogurt", "dairy", "32 oz", "each", 3.49, 3.98, 4.49, 5.49, "Chobani"),
  item("sour-cream", "Sour Cream", "dairy", "16 oz", "each", 1.49, 1.78, 1.99, 2.49),
  item("half-half", "Half & Half", "dairy", "pint", "each", 1.79, 2.18, 2.49, 2.99),
  item("string-cheese", "String Cheese", "dairy", "12-pack", "pack", 3.49, 3.98, 4.29, 4.99),
  item("cottage-cheese", "Cottage Cheese", "dairy", "24 oz", "each", 2.49, 2.78, 3.19, 3.69),

  // Meat
  item("chicken-breast", "Boneless Chicken Breast", "meat", "per lb", "lb", 2.89, 2.97, 3.49, 4.99),
  item("ground-beef", "Ground Beef 80/20", "meat", "per lb", "lb", 3.99, 4.47, 4.99, 5.99),
  item("ground-turkey", "Ground Turkey 93%", "meat", "per lb", "lb", 3.49, 3.98, 4.49, 5.49),
  item("bacon", "Bacon", "meat", "12 oz", "each", 3.49, 3.98, 4.49, 6.99, "Oscar Mayer"),
  item("pork-chops", "Bone-in Pork Chops", "meat", "per lb", "lb", 2.49, 2.78, 3.29, 3.99),
  item("salmon", "Atlantic Salmon Fillet", "meat", "per lb", "lb", 6.99, 7.48, 8.99, 9.99),
  item("shrimp", "Large Shrimp", "meat", "1 lb bag", "bag", 6.99, 7.98, 8.99, 10.99),
  item("rotisserie", "Rotisserie Chicken", "meat", "each", "each", 5.99, 6.98, 7.99, 8.99),
  item("hot-dogs", "Beef Hot Dogs", "meat", "15 oz", "pack", 2.49, 2.98, 3.29, 4.99, "Ball Park"),
  item("deli-turkey", "Oven Roasted Turkey", "meat", "per lb", "lb", 4.99, 5.48, 6.49, 7.99),

  // Bakery
  item("white-bread", "White Bread", "bakery", "20 oz loaf", "loaf", 1.09, 1.28, 1.49, 2.49, "store brand"),
  item("wheat-bread", "Wheat Bread", "bakery", "20 oz loaf", "loaf", 1.29, 1.48, 1.79, 2.79, "store brand"),
  item("bagels", "Plain Bagels", "bakery", "6-count", "pack", 2.19, 2.68, 2.99, 3.99, "Thomas"),
  item("tortillas", "Flour Tortillas", "bakery", "10-count", "pack", 1.79, 1.98, 2.29, 2.79),
  item("hamburger-buns", "Hamburger Buns", "bakery", "8-count", "pack", 1.29, 1.48, 1.79, 2.49),

  // Pantry
  item("peanut-butter", "Peanut Butter", "pantry", "16 oz", "each", 1.79, 2.18, 2.49, 2.99, "Jif"),
  item("grape-jelly", "Grape Jelly", "pantry", "18 oz", "each", 1.49, 1.78, 1.99, 2.49, "Smucker's"),
  item("spaghetti", "Spaghetti", "pantry", "16 oz", "each", 0.89, 1.00, 1.19, 1.79, "Barilla"),
  item("marinara", "Marinara Sauce", "pantry", "24 oz", "each", 1.29, 1.48, 1.79, 2.49, "Prego"),
  item("white-rice", "Long Grain Rice", "pantry", "2 lb", "bag", 1.49, 1.68, 1.99, 2.29),
  item("cheerios", "Cheerios", "pantry", "18 oz", "each", 3.49, 3.68, 3.99, 4.99, "General Mills"),
  item("oatmeal", "Old Fashioned Oats", "pantry", "42 oz", "each", 2.99, 3.48, 3.79, 4.29, "Quaker"),
  item("olive-oil", "Extra Virgin Olive Oil", "pantry", "16.9 oz", "each", 4.49, 4.98, 5.99, 7.49),
  item("flour", "All-Purpose Flour", "pantry", "5 lb", "bag", 2.19, 2.38, 2.79, 3.29),
  item("sugar", "Granulated Sugar", "pantry", "4 lb", "bag", 2.49, 2.68, 2.99, 3.49),
  item("coffee", "Ground Coffee", "pantry", "30.5 oz", "each", 6.99, 7.48, 8.49, 9.99, "Folgers"),
  item("tuna", "Chunk Light Tuna", "pantry", "5 oz", "each", 0.79, 0.88, 0.99, 1.29, "StarKist"),
  item("black-beans", "Black Beans", "pantry", "15 oz", "each", 0.79, 0.82, 0.99, 1.19),
  item("chicken-broth", "Chicken Broth", "pantry", "32 oz", "each", 1.19, 1.28, 1.49, 1.79),
  item("chips", "Potato Chips", "pantry", "7.75 oz", "each", 1.79, 2.48, 2.79, 4.49, "Lay's"),
  item("salsa", "Medium Salsa", "pantry", "16 oz", "each", 1.49, 1.78, 1.99, 2.49),
  item("ketchup", "Ketchup", "pantry", "20 oz", "each", 1.49, 1.68, 1.89, 2.49, "Heinz"),
  item("mayo", "Mayonnaise", "pantry", "30 oz", "each", 2.99, 3.48, 3.79, 4.49, "Hellmann's"),

  // Frozen
  item("frozen-pizza", "Rising Crust Pizza", "frozen", "each", "each", 3.99, 4.48, 4.99, 6.99, "DiGiorno"),
  item("frozen-broccoli", "Frozen Broccoli", "frozen", "12 oz", "each", 0.99, 1.08, 1.29, 1.49),
  item("ice-cream", "Ice Cream", "frozen", "48 oz", "each", 3.49, 3.98, 4.49, 5.99, "store brand"),
  item("waffles", "Frozen Waffles", "frozen", "10-count", "pack", 1.79, 2.18, 2.49, 3.29, "Eggo"),
  item("nuggets", "Chicken Nuggets", "frozen", "25 oz", "each", 4.99, 5.48, 5.99, 6.99),
  item("frozen-berries", "Frozen Mixed Berries", "frozen", "12 oz", "each", 2.49, 2.78, 3.19, 3.99),

  // Beverages
  item("oj", "Orange Juice", "beverages", "52 oz", "each", 2.79, 3.18, 3.49, 3.99, "Simply"),
  item("coke-12", "Coca-Cola 12-pack", "beverages", "12 × 12 oz", "pack", 5.49, 5.98, 6.49, 7.99, "Coca-Cola"),
  item("water-24", "Bottled Water", "beverages", "24-pack", "pack", 2.99, 3.48, 3.99, 4.99),
  item("sparkling", "Sparkling Water", "beverages", "12-pack", "pack", 3.49, 3.98, 4.29, 4.99, "LaCroix"),
  item("sweet-tea", "Sweet Tea", "beverages", "1 gallon", "gal", 1.99, 2.28, 2.49, 2.99),

  // Household
  item("paper-towels", "Paper Towels", "household", "6 mega rolls", "pack", 7.99, 8.97, 9.99, 14.99, "Bounty"),
  item("toilet-paper", "Toilet Paper", "household", "12 mega rolls", "pack", 8.99, 9.97, 11.49, 15.99, "Charmin"),
  item("dish-soap", "Dish Soap", "household", "22 oz", "each", 1.49, 1.68, 1.99, 2.49, "Dawn"),
  item("detergent", "Laundry Detergent", "household", "92 oz", "each", 8.49, 8.97, 9.99, 12.99, "Tide"),
  item("trash-bags", "Kitchen Trash Bags", "household", "40-count", "pack", 6.49, 6.98, 7.49, 8.99),

  // Personal care
  item("shampoo", "Shampoo", "personal", "12.6 oz", "each", 3.29, 3.97, 4.49, 5.99, "Pantene"),
  item("conditioner", "Conditioner", "personal", "12.6 oz", "each", 3.29, 3.97, 4.49, 5.99, "Pantene"),
  item("body-wash", "Body Wash", "personal", "22 oz", "each", 4.49, 5.47, 5.99, 7.49, "Dove"),
  item("bar-soap", "Bar Soap 2-pack", "personal", "2 bars", "pack", 1.29, 1.48, 1.79, 2.49, "Dove", {
    dollartree: 1.25,
  }),
  item("toothpaste", "Toothpaste", "personal", "5.8 oz", "each", 2.49, 2.97, 3.29, 4.49, "Crest"),
  item("deodorant", "Deodorant", "personal", "2.6 oz", "each", 3.49, 4.27, 4.79, 5.99, "Old Spice"),
  item("lotion", "Body Lotion", "personal", "16.9 oz", "each", 3.99, 4.48, 4.99, 6.49, "Lubriderm"),
  item("razors", "Disposable Razors", "personal", "10-count", "pack", 5.99, 6.97, 7.49, 9.99, "Gillette"),

  // Spices (pantry)
  item("salt", "Iodized Salt", "pantry", "26 oz", "each", 0.49, 0.62, 0.79, 0.99),
  item("black-pepper", "Black Pepper", "pantry", "3 oz", "each", 1.49, 1.88, 2.29, 2.99),
  item("garlic-powder", "Garlic Powder", "pantry", "3.25 oz", "each", 1.29, 1.58, 1.99, 2.49),
  item("italian-seasoning", "Italian Seasoning", "pantry", "0.75 oz", "each", 1.19, 1.38, 1.69, 2.29),
  item("cinnamon", "Ground Cinnamon", "pantry", "2.37 oz", "each", 1.29, 1.48, 1.79, 2.49),
  item("taco-seasoning", "Taco Seasoning", "pantry", "1 oz", "each", 0.59, 0.68, 0.89, 1.19),

  // Alcohol — beer/wine at grocers + ABC + c-store + clubs; spirits at package stores
  item("beer-12", "Domestic Beer 12-pack", "alcohol", "12 × 12 oz", "pack", 11.99, 12.48, 13.99, 15.99, "Miller Lite"),
  item("seltzer-12", "Hard Seltzer 12-pack", "alcohol", "12 × 12 oz", "pack", 14.99, 15.98, 16.99, 18.99, "White Claw"),
  item("wine-chard", "Chardonnay", "alcohol", "750 ml", "each", 7.99, 8.48, 9.99, 11.99, "Kendall-Jackson"),
  limited(
    "vodka-175",
    "Vodka 1.75 L",
    "alcohol",
    "1.75 L",
    "each",
    { abc: 24.99, publix: 28.99, winndixie: 27.99, costco: 21.99, sams: 22.98 },
    "Tito's",
  ),
  limited(
    "whiskey-175",
    "Bourbon 1.75 L",
    "alcohol",
    "1.75 L",
    "each",
    { abc: 29.99, publix: 34.99, winndixie: 33.99, costco: 26.99, sams: 27.98 },
    "Evan Williams",
  ),
];

export const PRODUCT_MAP: Record<string, CatalogItem> = Object.fromEntries(
  CATALOG.map((p) => [p.id, p]),
);

export const CATEGORY_LABEL: Record<Category, string> = {
  produce: "Produce",
  dairy: "Dairy & eggs",
  meat: "Meat & seafood",
  bakery: "Bakery",
  pantry: "Pantry & spices",
  frozen: "Frozen",
  beverages: "Drinks",
  household: "Household",
  personal: "Personal care",
  alcohol: "Beer, wine & spirits",
};
