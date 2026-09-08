import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CATALOG, CATEGORY_LABEL } from "@/lib/grocery/catalog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ProductSearch({
  onPick,
  placeholder = "Search bananas, bacon, Bounty…",
  autoFocus = false,
}: {
  onPick: (productId: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 1) return [];
    return CATALOG.filter((p) => {
      const hay = `${p.name} ${p.brand ?? ""} ${p.category}`.toLowerCase();
      return hay.includes(needle);
    }).slice(0, 8);
  }, [q]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-lg pl-10"
        aria-label="Search products"
      />
      {results.length > 0 ? (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-md">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm hover:bg-muted",
                )}
                onClick={() => {
                  onPick(p.id);
                  setQ("");
                }}
              >
                <span>
                  <span className="font-medium">{p.name}</span>
                  <span className="ml-2 text-muted-foreground">{p.size}</span>
                </span>
                <span className="text-xs text-muted-foreground">{CATEGORY_LABEL[p.category]}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
