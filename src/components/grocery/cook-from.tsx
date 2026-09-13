import { useState } from "react";
import { ChefHat, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { recipesFromInventory, type RecipeCard } from "@/lib/grocery/recipes";
import { daysUntil, expiryStatus, todayISO } from "@/lib/grocery/shelf-life";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import { useGroceryStore } from "@/lib/grocery/store";
import { inventRecipes } from "@/lib/grocery/vision";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CookFrom() {
  const inventory = useGroceryStore((s) => s.inventory);
  const addToList = useGroceryStore((s) => s.addToList);
  const cookRecipe = useGroceryStore((s) => s.cookRecipe);
  const local = recipesFromInventory(inventory);
  const [extra, setExtra] = useState<RecipeCard[] | null>(null);
  const [busy, setBusy] = useState(false);
  const now = todayISO();
  const urgent = inventory
    .filter((i) => {
      const s = expiryStatus(i.expiresOn, now);
      return s === "expired" || s === "tonight" || s === "soon";
    })
    .sort((a, b) => daysUntil(a.expiresOn ?? now, now) - daysUntil(b.expiresOn ?? now, now));

  const recipes = extra ? [...extra, ...local.filter((r) => !extra.some((e) => e.id === r.id))] : local;

  return (
    <section id="cook" className="relative scroll-mt-20 space-y-4">
      <div>
        <h2 className="font-display text-2xl font-medium">Cook from the house</h2>
        <p className="text-sm text-muted-foreground">
          Recipes that start with what is already in the fridge, then fill the gaps on the list.
        </p>
      </div>

      {urgent.length > 0 ? (
        <div className="relative rounded-xl border border-border bg-warn-fill p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-warn">Use first</p>
          <ul className="mt-2 space-y-1 text-sm">
            {urgent.slice(0, 6).map((item) => {
              const product = PRODUCT_MAP[item.productId];
              const s = expiryStatus(item.expiresOn, now);
              const d = item.expiresOn ? daysUntil(item.expiresOn, now) : 99;
              return (
                <li key={item.id} className="flex items-center justify-between gap-3">
                  <span>{product?.name ?? item.productId}</span>
                  <Badge variant="warn">
                    {s === "expired"
                      ? "Past date"
                      : d <= 0
                        ? "Today"
                        : d === 1
                          ? "Tomorrow"
                          : `${d} days`}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nothing is about to turn. Cook for pleasure.</p>
      )}

      {recipes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          Snap the fridge first, or log a few staples, then come back.
        </p>
      ) : (
        <ul className="relative grid gap-3 lg:grid-cols-2">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Card>
                <CardContent className="space-y-3 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-xl font-medium">{recipe.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {recipe.minutes} min · {recipe.servings} serving{recipe.servings === 1 ? "" : "s"}
                      </p>
                    </div>
                    <ChefHat className="size-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{recipe.why}</p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.uses.map((u) => (
                      <Badge key={u.productId} variant="secondary">
                        {u.name}
                      </Badge>
                    ))}
                    {recipe.missing.map((m) => (
                      <Badge key={m.productId} variant="warn">
                        Need {m.name}
                      </Badge>
                    ))}
                  </div>
                  <ol className="list-decimal space-y-1 pl-4 text-sm">
                    {recipe.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {recipe.missing.length > 0 ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          for (const m of recipe.missing) addToList(m.productId, 1);
                          toast.success("Missing pieces added to the list");
                        }}
                      >
                        Add missing to list
                      </Button>
                    ) : null}
                    <Button
                      variant={recipe.missing.length ? "outline" : "default"}
                      onClick={() => {
                        cookRecipe(recipe.uses.map((u) => ({ productId: u.productId, qty: u.qty })));
                        toast.success(`Cooked ${recipe.title}`);
                      }}
                    >
                      I cooked this
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="outline"
        disabled={busy || inventory.length === 0}
        onClick={async () => {
          setBusy(true);
          try {
            const result = await inventRecipes({
              data: {
                inventory: inventory.map((i) => ({
                  productId: i.productId,
                  qty: i.qty,
                  expiresOn: i.expiresOn,
                  location: i.location,
                })),
              },
            });
            if (!result.ok) {
              toast.error(result.error);
              return;
            }
            setExtra(result.recipes);
            toast.success("Grok plated a few more ideas");
          } catch {
            toast.error("Grok is busy. House recipes still work.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? <LoaderCircle className="size-4 animate-spin" /> : <ChefHat className="size-4" />}
        {busy ? "Thinking…" : "Ask Grok for more"}
      </Button>
    </section>
  );
}
