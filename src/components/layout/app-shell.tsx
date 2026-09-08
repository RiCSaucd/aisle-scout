import { useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  House,
  Ticket,
  ListChecks,
  Warehouse,
  Table2,
  ScanBarcode,
  MapPin,
} from "lucide-react";
import { rehydrateGrocery, useGroceryStore } from "@/lib/grocery/store";
import { WEEK_LABEL } from "@/lib/grocery/promotions";
import { MARKET_ZIP } from "@/lib/grocery/types";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: House },
  { to: "/deals", label: "Deals", icon: Ticket },
  { to: "/list", label: "List", icon: ListChecks },
  { to: "/scan", label: "Scan", icon: ScanBarcode },
  { to: "/pantry", label: "Pantry", icon: Warehouse },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const listCount = useGroceryStore((s) => s.list.filter((i) => !i.checked).length);

  useEffect(() => {
    rehydrateGrocery();
  }, []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
        <Link to="/" className="px-2">
          <div className="font-display text-xl font-semibold tracking-tight">Aisle Scout</div>
          <div className="mt-1 text-xs text-muted-foreground">{MARKET_ZIP} · {WEEK_LABEL}</div>
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150",
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
                {item.to === "/list" && listCount > 0 ? (
                  <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground tabular-nums">
                    {listCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <Link
          to="/prices"
          className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Table2 className="size-4" />
          Prices
        </Link>
        <Link
          to="/stores"
          className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <MapPin className="size-4" />
          Stores
        </Link>
        <Link
          to="/log"
          className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ScanBarcode className="size-4" />
          Log a trip
        </Link>
      </aside>

      <div className="lg:pl-56">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur-sm lg:hidden">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight">
            Aisle Scout
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/stores"
              className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground"
            >
              <MapPin className="size-4" />
              Stores
            </Link>
            <Link
              to="/prices"
              className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground"
            >
              <Table2 className="size-4" />
              Prices
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 lg:px-8 lg:pb-12 lg:pt-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden">
        <ul className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                  {item.to === "/list" && listCount > 0 ? (
                    <span className="absolute right-[18%] top-1.5 size-1.5 rounded-full bg-primary" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
