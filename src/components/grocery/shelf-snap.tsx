import { useRef, useState } from "react";
import { Camera, ImageUp, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { PRODUCT_MAP } from "@/lib/grocery/catalog";
import {
  SAMPLE_FRIDGE,
  SAMPLE_PANTRY,
  sightFromRaw,
  type SightedItem,
} from "@/lib/grocery/sight";
import { useGroceryStore } from "@/lib/grocery/store";
import { readShelfPhoto } from "@/lib/grocery/vision";
import type { PantryLocation } from "@/lib/grocery/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FilterRow } from "./filter-row";

const LOCATION_LABEL: Record<PantryLocation, string> = {
  fridge: "Fridge",
  freezer: "Freezer",
  pantry: "Pantry",
  other: "Counter",
};

async function compress(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const max = 1024;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bmp.width * scale));
  canvas.height = Math.max(1, Math.round(bmp.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas.toDataURL("image/jpeg", 0.72);
}

export function ShelfSnap() {
  const applySightings = useGroceryStore((s) => s.applySightings);
  const fileRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState<PantryLocation>("fridge");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [rows, setRows] = useState<SightedItem[] | null>(null);

  function loadSample(kind: "fridge" | "pantry") {
    const loc: PantryLocation = kind;
    setLocation(loc);
    setPreview(kind === "fridge" ? "/samples/fridge.jpg" : "/samples/pantry.jpg");
    setRows(sightFromRaw(kind === "fridge" ? SAMPLE_FRIDGE : SAMPLE_PANTRY, loc));
    window.setTimeout(() => {
      document.getElementById("snap-review")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  async function onFile(file: File) {
    setBusy(true);
    setRows(null);
    try {
      const image = await compress(file);
      setPreview(image);
      const result = await readShelfPhoto({ data: { image, location } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setRows(result.items);
      window.setTimeout(() => {
        document.getElementById("snap-review")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch {
      toast.error("Could not read that photo.");
    } finally {
      setBusy(false);
    }
  }

  const kept = rows?.filter((r) => r.keep && r.productId) ?? [];

  return (
    <section id="snap" className="scroll-mt-20 space-y-4">
      <div>
        <h2 className="font-display text-2xl font-medium">Snap a shelf</h2>
        <p className="text-sm text-muted-foreground">
          Photo of the fridge, pantry, freezer, or the counter. We inventory what we see, guess a
          use-by, and flag what should be cooked first.
        </p>
      </div>

      <FilterRow
        label="Where"
        value={location}
        onChange={(v) => setLocation(v as PantryLocation)}
        options={Object.entries(LOCATION_LABEL).map(([id, label]) => ({ id, label }))}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}
          {busy ? "Reading shelf…" : "Take or upload photo"}
        </Button>
        <Button variant="outline" onClick={() => loadSample("fridge")} disabled={busy}>
          <ImageUp className="size-4" />
          Sample fridge
        </Button>
        <Button variant="outline" onClick={() => loadSample("pantry")} disabled={busy}>
          <ImageUp className="size-4" />
          Sample pantry
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void onFile(file);
          }}
        />
      </div>

      {preview ? (
        <img
          src={preview}
          alt="Shelf photo"
          className="max-h-64 w-full rounded-xl border border-border object-cover"
        />
      ) : null}

      {rows ? (
        <Card id="snap-review">
          <CardContent className="space-y-3 pt-5">
            <p className="text-sm text-muted-foreground">
              {kept.length} item{kept.length === 1 ? "" : "s"} to merge into {LOCATION_LABEL[location].toLowerCase()}.
              Uncheck anything that is not actually there.
            </p>
            <ul className="space-y-2">
              {rows.map((row, i) => (
                <li
                  key={`${row.productId ?? row.label}-${i}`}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <Checkbox
                    className="mt-1"
                    checked={row.keep}
                    disabled={!row.productId}
                    onCheckedChange={(v) => {
                      setRows((cur) =>
                        cur?.map((r, j) => (j === i ? { ...r, keep: v === true } : r)) ?? null,
                      );
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{row.label}</span>
                      {row.note ? <Badge variant="warn">{row.note}</Badge> : null}
                      {!row.productId ? <Badge variant="secondary">Unknown</Badge> : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {LOCATION_LABEL[row.location]}
                      {row.expiresOn ? ` · use by ${row.expiresOn}` : ""}
                    </p>
                    {row.alternatives.length > 0 && !row.productId ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {row.alternatives.map((alt) => (
                          <Button
                            key={alt.id}
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRows((cur) =>
                                cur?.map((r, j) =>
                                  j === i
                                    ? {
                                        ...r,
                                        productId: alt.id,
                                        label: PRODUCT_MAP[alt.id]?.name ?? alt.name,
                                        keep: true,
                                      }
                                    : r,
                                ) ?? null,
                              );
                            }}
                          >
                            {alt.name}
                          </Button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <Input
                    className="h-11 w-16 tabular-nums"
                    type="number"
                    min={0}
                    step={0.5}
                    value={row.qty}
                    onChange={(e) => {
                      const qty = Math.max(0, Number(e.target.value) || 0);
                      setRows((cur) => cur?.map((r, j) => (j === i ? { ...r, qty } : r)) ?? null);
                    }}
                    aria-label={`Quantity for ${row.label}`}
                  />
                </li>
              ))}
            </ul>
            <Button
              disabled={kept.length === 0}
              onClick={() => {
                applySightings(
                  kept
                    .filter((r): r is SightedItem & { productId: string } => !!r.productId)
                    .map((r) => ({
                      productId: r.productId,
                      qty: r.qty,
                      location: r.location,
                      expiresOn: r.expiresOn,
                      notes: "from photo",
                    })),
                );
                toast.success(`Updated ${kept.length} pantry item${kept.length === 1 ? "" : "s"}`);
                setRows(null);
              }}
            >
              Merge into pantry
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
