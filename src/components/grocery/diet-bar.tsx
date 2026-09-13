import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { useGroceryStore } from "@/lib/grocery/store";
import { Checkbox } from "@/components/ui/checkbox";

export function DietBar() {
  const organicOnly = useGroceryStore((s) => s.organicOnly);
  const setOrganicOnly = useGroceryStore((s) => s.setOrganicOnly);
  const includeFarms = useGroceryStore((s) => s.includeFarms);
  const setIncludeFarms = useGroceryStore((s) => s.setIncludeFarms);

  return (
    <div className="space-y-2">
      <label className="flex min-h-12 items-start gap-3 rounded-xl bg-card/80 px-4 py-3 text-sm shadow-[var(--shadow-card)] backdrop-blur-xl">
        <Checkbox
          checked={organicOnly}
          onCheckedChange={(v) => setOrganicOnly(v === true)}
          className="mt-0.5"
        />
        <span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Leaf className="size-3.5" />
            USDA Organic only
          </span>
          <span className="mt-0.5 block text-muted-foreground">
            Food floor is USDA Organic. Household and soap stay as they are. The list swaps to organic twins.
          </span>
        </span>
      </label>
      <label className="flex min-h-12 items-start gap-3 rounded-xl bg-card/80 px-4 py-3 text-sm shadow-[var(--shadow-card)] backdrop-blur-xl">
        <Checkbox
          checked={includeFarms}
          onCheckedChange={(v) => setIncludeFarms(v === true)}
          className="mt-0.5"
        />
        <span>
          <span className="font-medium">Local farms & markets</span>
          <span className="mt-0.5 block text-muted-foreground">
            Rank the Pier, Amphitheatre, Sunday market, Bee Hill, Hastings stands.{" "}
            <Link to="/farms" className="text-foreground underline-offset-4 hover:underline">
              Open the farm board
            </Link>
          </span>
        </span>
      </label>
    </div>
  );
}
