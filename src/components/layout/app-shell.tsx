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
  Truck,
  Refrigerator,
  Leaf,
} from "lucide-react";
import { rehydrateGrocery, useGroceryStore } from "@/lib/grocery/store";
import { rehydrateHouse } from "@/lib/grocery/house-store";
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
    rehydrateHouse();
  }, []);

  return (
    <div className="app-frame text-foreground">
      <div className="app-atmosphere" aria-hidden />
      <div className="app-content">
      <aside className="fixed inset-y-3 left-3 z-30 hidden w-56 flex-col rounded-xl bg-card/70 px-4 py-6 shadow-[var(--shadow-glass)] backdrop-blur-2xl lg:flex">
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
                  "flex h-11 items-center gap-3 rounded-full px-3 text-sm font-medium transition-[background-color,color,transform] duration-150",
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
          to="/farms"
          className="flex h-11 items-center gap-3 rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Leaf className="size-4" />
          Farms
        </Link>
        <Link
          to="/house"
          className="flex h-11 items-center gap-3 rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Refrigerator className="size-4" />
          House
        </Link>
        <Link
          to="/ship"
          className="flex h-11 items-center gap-3 rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Truck className="size-4" />
          Ship it
        </Link>
        <Link
          to="/prices"
          className="flex h-11 items-center gap-3 rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Table2 className="size-4" />
          Prices
        </Link>
        <Link
          to="/stores"
          className="flex h-11 items-center gap-3 rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <MapPin className="size-4" />
          Stores
        </Link>
        <Link
          to="/log"
          className="flex h-11 items-center gap-3 rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ScanBarcode className="size-4" />
          Log a trip
        </Link>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 mx-3 mt-3 flex items-center justify-between rounded-full bg-card/70 px-4 py-2 shadow-[var(--shadow-glass)] backdrop-blur-2xl lg:hidden">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight">
            Aisle Scout
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to="/house"
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground"
            >
              <Refrigerator className="size-4" />
              House
            </Link>
            <Link
              to="/ship"
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground"
            >
              <Truck className="size-4" />
              Ship
            </Link>
            <Link
              to="/prices"
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground"
            >
              <Table2 className="size-4" />
              Prices
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-32 pt-5 lg:px-8 lg:pb-12 lg:pt-8">{children}</main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 rounded-full bg-card/80 pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-glass)] backdrop-blur-2xl lg:hidden">
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
                  <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
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
    </div>
  );
}
