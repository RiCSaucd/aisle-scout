import { eanPattern, upcFor } from "@/lib/grocery/barcodes";
import { cn } from "@/lib/utils";

export function BarcodeMark({
  productId,
  compact = false,
  className,
}: {
  productId: string;
  compact?: boolean;
  className?: string;
}) {
  const upc = upcFor(productId);
  const bits = eanPattern(upc);
  const barW = compact ? 1.1 : 1.4;
  const height = compact ? 36 : 56;
  const width = bits.length * barW;
  return (
    <div className={cn("select-none", className)}>
      <svg
        role="img"
        aria-label={`Barcode ${upc}`}
        width={width + 12}
        height={height + (compact ? 16 : 20)}
        viewBox={`0 0 ${width + 12} ${height + (compact ? 16 : 20)}`}
        className="text-foreground"
      >
        {bits.split("").map((b, i) =>
          b === "1" ? (
            <rect
              key={i}
              x={6 + i * barW}
              y={0}
              width={barW}
              height={height}
              fill="currentColor"
            />
          ) : null,
        )}
      </svg>
      <p className="mt-1 text-center font-mono text-xs tracking-[0.18em] text-muted-foreground">
        {upc}
      </p>
    </div>
  );
}