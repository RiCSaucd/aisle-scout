import { cn } from "@/lib/utils";

export function FilterRow({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="toolbar" aria-label={label}>
      <div className="flex w-max gap-2 pb-1">
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-[background-color,color] duration-150",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
