import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { D as CATEGORIES, T as CATEGORY_LABEL, _ as STORES, a as allQuotes, o as cheapestStore, w as CATALOG } from "./router-C-tyNfJu.mjs";
import { a as formatMoney, i as StoreMark, n as CATEGORY_ORDER, t as Badge } from "./store-mark-DPi0u4Bz.mjs";
import { n as Input, r as usePriceContext } from "./input-09shE_px.mjs";
import { t as FilterRow } from "./filter-row-i549Q8eT.mjs";
import { r as PriceGrid } from "./barcode-mark-D13A3TzG.mjs";
import { t as ProductSheet } from "./product-sheet-BGDwcXNE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prices-CZsgvYxu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PricesPage() {
	const ctx = usePriceContext();
	const [q, setQ] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [winner, setWinner] = (0, import_react.useState)("all");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return CATALOG.filter((p) => {
			if (category !== "all" && p.category !== category) return false;
			if (needle) {
				if (!`${p.name} ${p.brand ?? ""} ${p.category}`.toLowerCase().includes(needle)) return false;
			}
			const best = cheapestStore(p.id, 1, ctx);
			if (winner !== "all" && best?.storeId !== winner) return false;
			return true;
		}).sort((a, b) => {
			if (a.category !== b.category) return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
			return a.name.localeCompare(b.name);
		});
	}, [
		q,
		category,
		winner,
		ctx
	]);
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of rows) {
			const list = map.get(p.category) ?? [];
			list.push(p);
			map.set(p.category, list);
		}
		return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => [c, map.get(c)]);
	}, [rows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-medium tracking-tight",
						children: "Price book"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-muted-foreground",
						children: "The 32080 book — island grocers, pharmacies, dollar stores, ABC, US-1, and the warehouse clubs. Sage tile is the nearby win unless you turn clubs on."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search the book…",
						"aria-label": "Search prices",
						className: "h-12"
					})
				]
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterRow, {
				label: "Cheapest at",
				value: winner,
				onChange: setWinner,
				options: [{
					id: "all",
					label: "Any store"
				}, ...STORES.map((s) => ({
					id: s.id,
					label: s.far ? `${s.short} · ${s.miles} mi` : s.short
				}))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					rows.length,
					" item",
					rows.length === 1 ? "" : "s"
				]
			}),
			grouped.map(([cat, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-medium",
					children: CATEGORY_LABEL[cat]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3",
					children: items.map((p) => {
						const quotes = allQuotes(p.id, 1, ctx);
						const bestCost = Math.min(...quotes.map((x) => x.cost));
						const worstCost = Math.max(...quotes.map((x) => x.cost));
						const best = cheapestStore(p.id, 1, ctx);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setOpenId(p.id),
							className: "rounded-xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] transition-colors duration-150 hover:bg-muted/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [p.brand ? `${p.brand} · ` : "", p.size]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-end gap-1",
									children: [best ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreMark, {
										storeId: best.storeId,
										size: "sm"
									}) : null, worstCost - bestCost > .2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "best",
										children: ["Save ", formatMoney(worstCost - bestCost)]
									}) : null]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceGrid, {
								productId: p.id,
								ctx,
								compact: true
							})]
						}, p.id);
					})
				})]
			}, cat)),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
				children: "Nothing matches that filter."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Sage tile is the win. Shelf prices include this week's BOGOs, Circle clips, and rollbacks. Logged trip prices override the book until you clear them."
			}),
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
export { PricesPage as component };
