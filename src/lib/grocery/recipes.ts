import { PRODUCT_MAP } from "./catalog";
import { daysUntil, todayISO } from "./shelf-life";
import type { InventoryItem } from "./types";

export type RecipeNeed = { productId: string; qty: number; optional?: boolean };

export type RecipeCard = {
  id: string;
  title: string;
  minutes: number;
  servings: number;
  why: string;
  uses: { productId: string; name: string; qty: number }[];
  missing: { productId: string; name: string }[];
  steps: string[];
  score: number;
};

const TEMPLATES: {
  id: string;
  title: string;
  minutes: number;
  servings: number;
  needs: RecipeNeed[];
  steps: string[];
}[] = [
  {
    id: "spinach-omelette",
    title: "Spinach cheddar omelette",
    minutes: 12,
    servings: 1,
    needs: [
      { productId: "eggs", qty: 1 },
      { productId: "spinach", qty: 1 },
      { productId: "cheddar", qty: 0.3, optional: true },
      { productId: "butter", qty: 0.2, optional: true },
    ],
    steps: [
      "Wilt the spinach in a pat of butter.",
      "Beat two eggs, pour in, and fold in cheddar.",
      "Salt, pepper, eat while it's still puffy.",
    ],
  },
  {
    id: "yogurt-parfait",
    title: "Berry yogurt parfait",
    minutes: 5,
    servings: 1,
    needs: [
      { productId: "greek-yogurt", qty: 1 },
      { productId: "strawberries", qty: 1 },
      { productId: "bananas", qty: 0.5, optional: true },
    ],
    steps: [
      "Slice the strawberries and banana.",
      "Layer with Greek yogurt.",
      "Eat the fruit that's turning first.",
    ],
  },
  {
    id: "banana-oats",
    title: "Banana oat skillet",
    minutes: 15,
    servings: 2,
    needs: [
      { productId: "bananas", qty: 1 },
      { productId: "oatmeal", qty: 1 },
      { productId: "eggs", qty: 0.5, optional: true },
      { productId: "whole-milk", qty: 0.3, optional: true },
    ],
    steps: [
      "Mash a ripe banana into oats and a splash of milk.",
      "Stir in an egg if you have one.",
      "Cook in a buttered skillet until set, like a thick pancake.",
    ],
  },
  {
    id: "chicken-rice",
    title: "Chicken and rice bowl",
    minutes: 25,
    servings: 2,
    needs: [
      { productId: "chicken-breast", qty: 1 },
      { productId: "white-rice", qty: 1 },
      { productId: "spinach", qty: 0.5, optional: true },
      { productId: "salsa", qty: 0.5, optional: true },
    ],
    steps: [
      "Warm leftover or fresh chicken in a skillet.",
      "Spoon over rice.",
      "Wilt spinach on top and finish with salsa if it's in the door.",
    ],
  },
  {
    id: "spaghetti-night",
    title: "Pantry spaghetti",
    minutes: 20,
    servings: 2,
    needs: [
      { productId: "spaghetti", qty: 1 },
      { productId: "marinara", qty: 1 },
      { productId: "ground-beef", qty: 0.5, optional: true },
    ],
    steps: [
      "Boil spaghetti in salted water.",
      "Warm marinara. Brown beef if you have it.",
      "Toss and eat. Garlic bread if the loaf isn't stale.",
    ],
  },
  {
    id: "tuna-rice",
    title: "Tuna rice skillet",
    minutes: 18,
    servings: 2,
    needs: [
      { productId: "tuna", qty: 1 },
      { productId: "white-rice", qty: 1 },
      { productId: "black-beans", qty: 1, optional: true },
      { productId: "salsa", qty: 0.5, optional: true },
    ],
    steps: [
      "Heat rice with a splash of water.",
      "Fold in tuna and beans.",
      "Salsa on top. Dinner in one pan.",
    ],
  },
  {
    id: "pb-banana",
    title: "Peanut butter banana toast",
    minutes: 5,
    servings: 1,
    needs: [
      { productId: "peanut-butter", qty: 1 },
      { productId: "bananas", qty: 1 },
      { productId: "white-bread", qty: 1, optional: true },
    ],
    steps: [
      "Toast bread if you have it — or eat it open-face on a banana split down the middle.",
      "Spread peanut butter, slice banana on top.",
    ],
  },
  {
    id: "egg-fried-rice",
    title: "Egg fried rice",
    minutes: 15,
    servings: 2,
    needs: [
      { productId: "eggs", qty: 1 },
      { productId: "white-rice", qty: 1 },
      { productId: "green-onions", qty: 0.5, optional: true },
      { productId: "salsa", qty: 0.5, optional: true },
    ],
    steps: [
      "Scramble eggs in a hot pan, push aside.",
      "Fry leftover rice until it pops.",
      "Mix, salt, green onion if it's in the crisper.",
    ],
  },
];

export function recipesFromInventory(
  inventory: InventoryItem[],
  now = todayISO(),
): RecipeCard[] {
  const have = new Map(inventory.map((i) => [i.productId, i]));
  const cards: RecipeCard[] = [];
  for (const t of TEMPLATES) {
    const uses: RecipeCard["uses"] = [];
    const missing: RecipeCard["missing"] = [];
    let haveRequired = 0;
    let required = 0;
    let urgency = 0;
    for (const need of t.needs) {
      const row = have.get(need.productId);
      const name = PRODUCT_MAP[need.productId]?.name ?? need.productId;
      if (row && row.qty > 0) {
        uses.push({ productId: need.productId, name, qty: Math.min(row.qty, need.qty) });
        if (!need.optional) haveRequired += 1;
        if (row.expiresOn) {
          const d = daysUntil(row.expiresOn, now);
          if (d <= 1) urgency += 3;
          else if (d <= 3) urgency += 2;
          else if (d <= 7) urgency += 1;
        }
      } else if (!need.optional) {
        missing.push({ productId: need.productId, name });
      }
      if (!need.optional) required += 1;
    }
    if (haveRequired === 0) continue;
    const why =
      urgency >= 3
        ? "Uses something that should be eaten tonight."
        : urgency >= 1
          ? "Uses what is close to the date."
          : missing.length === 0
            ? "Everything is already in the house."
            : `Need ${missing.map((m) => m.name).join(", ")} from the store.`;
    cards.push({
      id: t.id,
      title: t.title,
      minutes: t.minutes,
      servings: t.servings,
      why,
      uses,
      missing,
      steps: t.steps,
      score: haveRequired * 4 + urgency * 3 - missing.length * 2 + (haveRequired === required ? 5 : 0),
    });
  }
  return cards.sort((a, b) => b.score - a.score).slice(0, 5);
}
