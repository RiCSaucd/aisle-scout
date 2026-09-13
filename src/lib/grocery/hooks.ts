import { useMemo } from "react";
import { useGroceryStore } from "./store";
import type { PriceContext } from "./pricing";

export function usePriceContext(): PriceContext {
  const overrides = useGroceryStore((s) => s.overrides);
  const clippedPromoIds = useGroceryStore((s) => s.clippedPromoIds);
  const includeFar = useGroceryStore((s) => s.includeFar);
  const includeFarms = useGroceryStore((s) => s.includeFarms);
  const organicOnly = useGroceryStore((s) => s.organicOnly);
  return useMemo(
    () => ({
      overrides,
      clippedPromoIds,
      includeFar,
      includeFarms,
      organicOnly,
      now: new Date("2026-09-07T12:00:00"),
    }),
    [overrides, clippedPromoIds, includeFar, includeFarms, organicOnly],
  );
}
