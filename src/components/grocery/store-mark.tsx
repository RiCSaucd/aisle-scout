import { STORE_MAP } from "@/lib/grocery/stores";
import { STORE_DOT } from "@/lib/grocery/format";
import type { StoreId } from "@/lib/grocery/types";
import { cn } from "@/lib/utils";

export function StoreMark({
  storeId,
  size = "md",
  showName = true,
}: {
  storeId: StoreId;
  size?: "sm" | "md";
  showName?: boolean;
}) {
  const store = STORE_MAP[storeId];
  return (
    <span className={cn("inline-flex items-center gap-1.5", size === "sm" ? "text-xs" : "text-sm")}>
      <span className={cn("rounded-full", STORE_DOT[storeId], size === "sm" ? "size-1.5" : "size-2")} />
      {showName ? <span className="font-medium">{store.short}</span> : null}
    </span>
  );
}
