import { createServerFn } from "@tanstack/react-start";
import type { PantryLocation } from "./types";
import { catalogHint, sightFromRaw, type RawSighting, type SightedItem } from "./sight";
import type { RecipeCard } from "./recipes";

function parseJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function grokJson(prompt: string, image?: string): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;

  const userContent:
    | string
    | (
        | { type: "image_url"; image_url: { url: string; detail: "low" } }
        | { type: "text"; text: string }
      )[] = image
    ? [
        { type: "image_url", image_url: { url: image, detail: "low" } },
        { type: "text", text: prompt },
      ]
    : prompt;

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.2,
      max_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Return only valid JSON. No markdown.",
        },
        { role: "user", content: userContent },
      ],
    }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = body.choices?.[0]?.message?.content ?? "";
  return parseJsonObject(text);
}

export const readShelfPhoto = createServerFn({ method: "POST" })
  .validator((input: { image: string; location: PantryLocation }) => input)
  .handler(async ({ data }): Promise<{ ok: true; items: SightedItem[]; source: "ai" } | { ok: false; error: string }> => {
    if (!data.image || data.image.length > 1_800_000) {
      return { ok: false, error: "Photo is too large. Try a closer shot." };
    }
    const parsed = await grokJson(
      `Inventory this ${data.location} photo for a home grocery app.
JSON shape: {"items":[{"name":"whole milk","qty":1,"daysLeft":6,"condition":"fresh"}]}
condition is fresh | use-soon | expired.
Only list food you can actually see. qty is a number. daysLeft is how many days until it should be used.
Prefer common grocery names. Catalog (id:name): ${catalogHint()}`,
      data.image,
    );
    if (!parsed) {
      return { ok: false, error: "Could not read that photo. Try more light, or log items by name." };
    }
    const items = Array.isArray(parsed.items) ? (parsed.items as RawSighting[]) : [];
    if (items.length === 0) {
      return { ok: false, error: "Didn't spot groceries in that frame. Get closer to the shelf." };
    }
    return { ok: true, items: sightFromRaw(items, data.location), source: "ai" };
  });

export const inventRecipes = createServerFn({ method: "POST" })
  .validator(
    (input: { inventory: { productId: string; qty: number; expiresOn?: string; location: string }[] }) => input,
  )
  .handler(async ({ data }): Promise<{ ok: true; recipes: RecipeCard[] } | { ok: false; error: string }> => {
    const parsed = await grokJson(
      `Write 3 simple recipes using this home inventory first, especially items close to expiry.
Inventory JSON: ${JSON.stringify(data.inventory)}
Catalog ids: ${catalogHint()}
JSON: {"recipes":[{"id":"slug","title":"","minutes":20,"servings":2,"why":"","uses":[{"productId":"eggs","name":"Large Eggs","qty":1}],"missing":[{"productId":"spinach","name":"Spinach"}],"steps":["..."],"score":10}]}
uses must be items they have. missing is only if the recipe really needs a store run. Short steps.`,
    );
    if (!parsed || !Array.isArray(parsed.recipes)) {
      return { ok: false, error: "Grok could not plate anything extra. Using the house recipes." };
    }
    const recipes = (parsed.recipes as RecipeCard[]).map((r, i) => ({
      id: r.id || `grok-${i}`,
      title: String(r.title ?? "Untitled"),
      minutes: Number(r.minutes) || 20,
      servings: Number(r.servings) || 2,
      why: String(r.why ?? "Uses what is already here."),
      uses: Array.isArray(r.uses) ? r.uses : [],
      missing: Array.isArray(r.missing) ? r.missing : [],
      steps: Array.isArray(r.steps) ? r.steps.map(String) : [],
      score: Number(r.score) || 10,
    }));
    return { ok: true, recipes };
  });
