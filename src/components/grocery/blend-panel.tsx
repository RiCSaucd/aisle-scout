import { useMemo, useState } from "react";
import { toast } from "sonner";
import { blendList, SAMPLE_LIST, type BlendMatch } from "@/lib/grocery/blend";
import { formatMoney } from "@/lib/grocery/format";
import { expiryStatus } from "@/lib/grocery/shelf-life";
import { cheapestStore, type PriceContext } from "@/lib/grocery/pricing";
import { STORE_MAP } from "@/lib/grocery/stores";
import { useGroceryStore } from "@/lib/grocery/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { StoreMark } from "./store-mark";

type Row = BlendMatch & { include: boolean; pantryNote?: string };

function pantryNoteFor(
  productId: string,
  qtyNeeded: number,
  inventory: { productId: string; qty: number; lowAt: number; expiresOn?: string }[],
): { note?: string; stocked: boolean } {
  const item = inventory.find((i) => i.productId === productId);
  if (!item) return { stocked: false };
  const expiring = expiryStatus(item.expiresOn) !== "ok";
  if (expiring) return { note: `In pantry · use by ${item.expiresOn}`, stocked: false };
  if (item.qty < qtyNeeded) return { note: `In pantry · ${item.qty} on hand`, stocked: false };
  if (item.qty <= item.lowAt) return { note: `In pantry · only ${item.qty} left`, stocked: false };
  return { note: `Already have ${item.qty}`, stocked: true };
}

export function BlendPanel({ ctx }: { ctx: PriceContext }) {
  const inventory = useGroceryStore((s) => s.inventory);
  const blendIntoList = useGroceryStore((s) => s.blendIntoList);
  const [text, setText] = useState("");
  const [skipStocked, setSkipStocked] = useState(true);
  const [mode, setMode] = useState<"add" | "replace">("replace");
  const [overrides, setOverrides] = useState<Record<number, Partial<Row>>>({});

  const rows: Row[] = useMemo(() => {
    return blendList(text).map((m, i) => {
      const extra = overrides[i] ?? {};
      const product = extra.product !== undefined ? extra.product : m.product;
      const pantry = product ? pantryNoteFor(product.id, extra.qty ?? m.qty, inventory ?? []) : { stocked: false };
      const include = extra.include ?? (product ? !(skipStocked && pantry.stocked) : false);
      return {
        ...m,
        ...extra,
        product,
        include,
        pantryNote: pantry.note,
      };
    });
  }, [text, inventory, skipStocked, overrides]);

  const selected = rows.filter((r) => r.include && r.product);
  const unmatched = rows.filter((r) => !r.product);

  function setRow(i: number, patch: Partial<Row>) {
    setOverrides((prev) => ({ ...prev, [i]: { ...prev[i], ...patch } }));
  }

  function commit() {
    if (selected.length === 0) {
      toast.error("Match at least one item, or paste a list first");
      return;
    }
    blendIntoList(
      selected.map((r) => ({ productId: r.product!.id, qty: r.qty })),
      mode,
    );
    toast.success(
      mode === "replace"
        ? `Your list is ${selected.length} item${selected.length === 1 ? "" : "s"} — trip plan updated`
        : `Blended ${selected.length} item${selected.length === 1 ? "" : "s"} into the list`,
    );
    setText("");
    setOverrides({});
  }

  return (
    <section id="blend" className="space-y-4 scroll-mt-24">
      <div>
        <h2 className="font-display text-2xl font-medium">Blend your list</h2>
        <p className="text-sm text-muted-foreground">
          Paste what you actually need — a note, a text, a recipe dump. We match it to the St. Augustine
          book, skip a full pantry, and rebuild the trip around it.
        </p>
      </div>

      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setOverrides({});
        }}
        placeholder={"milk\neggs\nchicken\nstrawberries\ntide"}
        aria-label="Paste or type your grocery list"
        className="min-h-36"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setText(SAMPLE_LIST);
            setOverrides({});
          }}
        >
          Try a sample list
        </Button>
        <Button variant="ghost" onClick={() => { setText(""); setOverrides({}); }}>
          Clear
        </Button>
      </div>

      {rows.length > 0 ? (
        <Card>
          <CardContent className="space-y-4 pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {selected.length} going on the list
                {unmatched.length ? ` · ${unmatched.length} unmatched` : ""}
              </p>
              <label className="flex h-11 items-center gap-2 text-sm">
                <Checkbox
                  checked={skipStocked}
                  onCheckedChange={(v) => setSkipStocked(v === true)}
                />
                Skip a full pantry
              </label>
            </div>

            <ul className="space-y-3">
              {rows.map((row, i) => {
                const best = row.product ? cheapestStore(row.product.id, row.qty, ctx) : null;
                return (
                  <li key={`${row.raw}-${i}`} className="rounded-lg border border-border bg-background p-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        className="mt-1"
                        checked={row.include}
                        disabled={!row.product}
                        onCheckedChange={(v) => setRow(i, { include: v === true })}
                        aria-label={`Include ${row.product?.name ?? row.raw}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground">You wrote “{row.raw}”</div>
                        {row.product ? (
                          <>
                            <div className="mt-0.5 font-medium">
                              {row.qty === 1 ? "" : `${row.qty} × `}
                              {row.product.name}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              {best ? (
                                <>
                                  <StoreMark storeId={best.storeId} size="sm" />
                                  <span className="tabular-nums">{formatMoney(best.quote.cost)}</span>
                                  {best.quote.note ? <Badge variant="deal">{best.quote.note}</Badge> : null}
                                </>
                              ) : (
                                <span>{STORE_MAP.aldi.short} book</span>
                              )}
                              {row.pantryNote ? (
                                <Badge variant={row.pantryNote.startsWith("Already") ? "secondary" : "warn"}>
                                  {row.pantryNote}
                                </Badge>
                              ) : null}
                            </div>
                          </>
                        ) : (
                          <div className="mt-0.5 text-sm">
                            No match in the book.
                            {row.alternatives.length > 0 ? " Closest:" : ""}
                          </div>
                        )}
                        {row.alternatives.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {row.alternatives.map((alt) => (
                              <button
                                key={alt.id}
                                type="button"
                                className="h-9 rounded-full bg-secondary px-3 text-xs font-medium text-secondary-foreground hover:bg-muted"
                                onClick={() =>
                                  setRow(i, { product: alt, include: true, score: 1 })
                                }
                              >
                                {alt.name}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={commit} disabled={selected.length === 0}>
                {mode === "replace" ? "Use this as my list" : "Add these to the list"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setMode(mode === "replace" ? "add" : "replace")}
              >
                {mode === "replace" ? "Or add on top" : "Or replace the list"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
