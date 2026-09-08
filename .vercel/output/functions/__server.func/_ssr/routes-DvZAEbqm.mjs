import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { C as ArrowRight, a as Ticket, c as ScanBarcode, m as Leaf, r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { A as MARKET_ZIP, C as WEEK_LABEL, E as PRODUCT_MAP, T as CATEGORY_LABEL, h as winCounts, i as useGroceryStore, o as cheapestStore, w as CATALOG, x as PROMOTIONS, y as STORE_MAP } from "./router-C-tyNfJu.mjs";
import { a as formatMoney, i as StoreMark, t as Badge } from "./store-mark-DPi0u4Bz.mjs";
import { r as usePriceContext, t as Button } from "./input-09shE_px.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-gOPQnf4z.mjs";
import { r as PriceGrid } from "./barcode-mark-D13A3TzG.mjs";
import { t as ProductSheet } from "./product-sheet-BGDwcXNE.mjs";
import { t as allPlans } from "./optimizer-DuUrk5E5.mjs";
import { t as ProductSearch } from "./product-search-BuTtYMzv.mjs";
import { t as StoreStrip } from "./store-strip-BVMwSTZP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DvZAEbqm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FEATURED = [
	"strawberries",
	"bananas",
	"avocados",
	"eggs",
	"chicken-breast",
	"whole-milk",
	"shampoo",
	"beer-12"
];
function Home() {
	const ctx = usePriceContext();
	const inventory = useGroceryStore((s) => s.inventory);
	const list = useGroceryStore((s) => s.list);
	const watched = useGroceryStore((s) => s.watched);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const wins = (0, import_react.useMemo)(() => winCounts(ctx), [ctx]);
	const winLeader = Object.entries(wins).sort((a, b) => b[1] - a[1])[0];
	const bestPlan = (0, import_react.useMemo)(() => allPlans(list, ctx), [list, ctx])[0];
	const alerts = inventory.filter((i) => {
		const expiring = i.expiresOn && i.expiresOn <= "2026-09-10";
		const low = i.qty <= i.lowAt;
		return expiring || low;
	});
	const produceItems = CATALOG.filter((p) => p.category === "produce");
	const produceWins = produceItems.reduce((n, p) => {
		return n + (cheapestStore(p.id, 1, ctx)?.storeId === "aldi" ? 1 : 0);
	}, 0);
	const bogoCount = PROMOTIONS.filter((p) => p.kind === "bogo").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: [
							MARKET_ZIP,
							" · St. Augustine Beach · ",
							WEEK_LABEL
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl",
						children: "The cheapest basket this week."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-base leading-relaxed text-muted-foreground",
						children: "The 32080 book: Publix and Winn-Dixie on A1A, CVS, Walgreens, Dollar General, ABC, the US-1 grocers, and late-night c-stores. Costco and Sam’s are on it as bulk trips — they’re a haul from the beach."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductSearch, { onPick: setOpenId }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/scan",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanBarcode, { className: "size-4" }), "Scan a shelf tag"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/list",
								hash: "blend",
								children: ["Paste a grocery list", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground",
							children: "Cheapest on"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-medium tabular-nums",
						children: winLeader?.[1] ?? 0
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"items at ",
							winLeader ? STORE_MAP[winLeader[0]].short : "—",
							" of ",
							CATALOG.length
						]
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground",
							children: "Aldi produce"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-medium tabular-nums",
						children: produceWins
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"of ",
							produceItems.length,
							" produce items this week"
						]
					})] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-sm font-medium text-muted-foreground",
							children: "Publix BOGOs"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-medium tabular-nums",
						children: bogoCount
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "active through Wednesday"
					})] })] })
				]
			}),
			bestPlan && list.some((i) => !i.checked) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-primary/20 bg-best-fill/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your list, optimized" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: bestPlan.label
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "best",
						children: formatMoney(bestPlan.total)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [bestPlan.vsMostExpensive > 0 ? `Saves ${formatMoney(bestPlan.vsMostExpensive)} versus shopping full price at the most expensive store.` : "Prices are tight this week — still worth clipping the Publix BOGOs.", bestPlan.receivedExtra > 0 ? ` BOGO extras: ${bestPlan.receivedExtra} free units.` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/list",
							children: ["Open list", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-medium",
						children: "This week's staples"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Sage tile is the nearby win. Clubs stay off until you ask."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/prices",
							children: "All prices"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: FEATURED.map((id) => {
						const p = PRODUCT_MAP[id];
						if (!p) return null;
						const best = cheapestStore(id, 1, ctx);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setOpenId(id),
							className: "rounded-xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-[transform,background-color] duration-150 hover:bg-muted/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										p.size,
										" · ",
										CATEGORY_LABEL[p.category]
									]
								})] }), best ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreMark, {
									storeId: best.storeId,
									size: "sm"
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceGrid, {
								productId: id,
								ctx,
								compact: true
							})]
						}, id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Hot promotions" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [PROMOTIONS.filter((p) => watched.includes(p.productId)).concat(PROMOTIONS.filter((p) => !watched.includes(p.productId))).slice(0, 6).map((promo) => {
						const product = PRODUCT_MAP[promo.productId];
						const watching = watched.includes(promo.productId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex w-full items-start justify-between gap-3 rounded-lg px-1 py-1 text-left hover:bg-muted/50",
							onClick: () => setOpenId(promo.productId),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: product?.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: promo.details
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "deal",
									children: promo.label
								}), watching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "warn",
									children: "Watching"
								}) : null]
							})]
						}, promo.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/deals",
							children: "All deals"
						})
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Pantry watch" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nothing running low."
					}) : alerts.slice(0, 6).map((item) => {
						const product = PRODUCT_MAP[item.productId];
						const expiring = item.expiresOn && item.expiresOn <= "2026-09-10";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [expiring ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 text-warn" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: product?.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										item.qty,
										" left",
										item.expiresOn ? ` · use by ${item.expiresOn.slice(5)}` : ""
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: expiring ? "warn" : "secondary",
								children: expiring ? "Expiring" : "Low"
							})]
						}, item.id);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pantry",
							children: "Open pantry"
						})
					})]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreStrip, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductSheet, {
				productId: openId,
				ctx,
				open: !!openId,
				onOpenChange: (o) => {
					if (!o) setOpenId(null);
				}
			})
		]
	});
}
//#endregion
export { Home as component };
