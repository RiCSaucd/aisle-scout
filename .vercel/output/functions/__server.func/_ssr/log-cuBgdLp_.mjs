import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as ScanBarcode } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as CATEGORIES, E as PRODUCT_MAP, T as CATEGORY_LABEL, _ as STORES, i as useGroceryStore, m as shelfPrice, p as regularPrice, r as cn, u as overrideKey, w as CATALOG, y as STORE_MAP } from "./router-C-tyNfJu.mjs";
import { a as formatMoney, n as CATEGORY_ORDER, t as Badge } from "./store-mark-DPi0u4Bz.mjs";
import { n as Input, r as usePriceContext, t as Button } from "./input-09shE_px.mjs";
import { n as CardContent, t as Card } from "./card-gOPQnf4z.mjs";
import { t as FilterRow } from "./filter-row-i549Q8eT.mjs";
import { t as StoreStrip } from "./store-strip-BVMwSTZP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/log-cuBgdLp_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LogPage() {
	const ctx = usePriceContext();
	const logPrices = useGroceryStore((s) => s.logPrices);
	const clearOverride = useGroceryStore((s) => s.clearOverride);
	const logs = useGroceryStore((s) => s.logs);
	const overrides = useGroceryStore((s) => s.overrides);
	const [storeId, setStoreId] = (0, import_react.useState)("aldi");
	const [category, setCategory] = (0, import_react.useState)("produce");
	const [q, setQ] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)({});
	const products = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return CATALOG.filter((p) => {
			if (regularPrice(p.id, storeId) == null) return false;
			if (category !== "all" && p.category !== category) return false;
			if (needle) {
				if (!`${p.name} ${p.brand ?? ""}`.toLowerCase().includes(needle)) return false;
			}
			return true;
		}).sort((a, b) => {
			if (a.category !== b.category) return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
			return a.name.localeCompare(b.name);
		});
	}, [
		category,
		q,
		storeId
	]);
	const changed = Object.entries(draft).filter(([, v]) => v.trim() !== "");
	const storeLogs = logs.filter((l) => l.storeId === storeId).slice(0, 8);
	function save() {
		const entries = changed.map(([productId, raw]) => {
			const price = Number(raw);
			if (!Number.isFinite(price) || price <= 0) return null;
			return {
				productId,
				storeId,
				price
			};
		}).filter((e) => e != null);
		if (entries.length === 0) {
			toast.error("Enter at least one price");
			return;
		}
		logPrices(entries);
		setDraft({});
		toast.success(`Logged ${entries.length} ${STORE_MAP[storeId].short} price${entries.length === 1 ? "" : "s"}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-medium tracking-tight",
						children: "Log a trip"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-muted-foreground",
						children: "Walk the aisle, type what you saw. Logged prices override the book until you clear them. Faster with the scanner if you're logging one UPC at a time."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/scan",
							search: { store: storeId },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanBarcode, { className: "size-4" }), "Open scanner"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: STORES.map((store) => {
					const active = store.id === storeId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setStoreId(store.id);
							setCategory(store.id === "aldi" ? "produce" : "all");
						},
						className: cn("h-11 rounded-full px-4 text-sm font-medium transition-[border-color,background-color] duration-150", active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"),
						children: [store.short, store.far ? ` · ${store.miles} mi` : ""]
					}, store.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterRow, {
				label: "Category",
				value: category,
				onChange: setCategory,
				options: [{
					id: "all",
					label: "All"
				}, ...CATEGORIES.map((c) => ({
					id: c,
					label: CATEGORY_LABEL[c]
				}))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: `Search ${STORE_MAP[storeId].short} items…`,
				"aria-label": "Search products to log",
				className: "h-12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: products.map((p) => {
					const current = shelfPrice(p.id, storeId, ctx);
					const regular = regularPrice(p.id, storeId);
					const logged = overrideKey(storeId, p.id) in overrides;
					const value = draft[p.id] ?? "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: p.name
								}), logged ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "best",
									children: "Logged"
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									p.size,
									current != null ? ` · now ${formatMoney(current)}` : "",
									regular != null && regular !== current ? ` · regular ${formatMoney(regular)}` : ""
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								placeholder: "New price",
								"aria-label": `Price for ${p.name}`,
								className: "h-11 w-28 tabular-nums",
								value,
								onChange: (e) => setDraft((d) => ({
									...d,
									[p.id]: e.target.value
								}))
							}), logged ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									clearOverride(storeId, p.id);
									toast("Back to book price");
								},
								children: "Clear"
							}) : null]
						})]
					}, p.id);
				})
			}),
			products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
				children: "No items in this slice of the book."
			}) : null,
			storeLogs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-lg font-medium",
					children: [
						"Recent ",
						STORE_MAP[storeId].short,
						" logs"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: storeLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-baseline justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: PRODUCT_MAP[log.productId]?.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-muted-foreground",
							children: [
								formatMoney(log.price),
								" · ",
								log.observedAt.slice(0, 10)
							]
						})]
					}, log.id))
				})]
			}) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreStrip, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-14 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-sm lg:bottom-0 lg:left-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: changed.length === 0 ? "Type prices as you walk the aisle" : `${changed.length} price${changed.length === 1 ? "" : "s"} ready`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: save,
						disabled: changed.length === 0,
						children: [
							"Save ",
							STORE_MAP[storeId].short,
							" prices"
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { LogPage as component };
