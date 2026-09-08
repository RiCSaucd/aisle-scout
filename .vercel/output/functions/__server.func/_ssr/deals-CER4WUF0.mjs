import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as WEEK_LABEL, E as PRODUCT_MAP, _ as STORES, c as dealComparison, i as useGroceryStore, x as PROMOTIONS, y as STORE_MAP } from "./router-C-tyNfJu.mjs";
import { a as formatMoney, i as StoreMark, r as KIND_LABEL, t as Badge } from "./store-mark-DPi0u4Bz.mjs";
import { r as usePriceContext, t as Button } from "./input-09shE_px.mjs";
import { n as CardContent, t as Card } from "./card-gOPQnf4z.mjs";
import { t as FilterRow } from "./filter-row-i549Q8eT.mjs";
import { t as ProductSheet } from "./product-sheet-BGDwcXNE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deals-CER4WUF0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_OPTIONS = [
	{
		id: "all",
		label: "All deals"
	},
	{
		id: "bogo",
		label: "BOGO"
	},
	{
		id: "circle",
		label: "Circle"
	},
	{
		id: "coupon",
		label: "Coupons"
	},
	{
		id: "rollback",
		label: "Rollbacks"
	},
	{
		id: "sale",
		label: "Sales"
	},
	{
		id: "aldi-finds",
		label: "Aldi Finds"
	}
];
function DealsPage() {
	const ctx = usePriceContext();
	const clipped = useGroceryStore((s) => s.clippedPromoIds);
	const clipPromo = useGroceryStore((s) => s.clipPromo);
	const unclipPromo = useGroceryStore((s) => s.unclipPromo);
	const addToList = useGroceryStore((s) => s.addToList);
	const [store, setStore] = (0, import_react.useState)("all");
	const [kind, setKind] = (0, import_react.useState)("all");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const deals = (0, import_react.useMemo)(() => {
		return PROMOTIONS.filter((p) => {
			if (store !== "all" && p.storeId !== store) return false;
			if (kind !== "all" && p.kind !== kind) return false;
			return true;
		}).sort((a, b) => {
			const ca = dealComparison(a, ctx);
			const cb = dealComparison(b, ctx);
			if (ca.beats !== cb.beats) return ca.beats ? -1 : 1;
			return cb.saveVsNext - ca.saveVsNext;
		});
	}, [
		store,
		kind,
		ctx
	]);
	const clipCount = PROMOTIONS.filter((p) => p.requiresClip && !clipped.includes(p.id)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: ["Circular week · ", WEEK_LABEL]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-medium tracking-tight",
						children: "Deals, BOGOs, clips"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "max-w-xl text-muted-foreground",
						children: ["Publix BOGOs, Winn-Dixie on A1A, CVS ExtraBucks, Walgreens personal-care BOGOs, ABC spirits, Walmart rollbacks, Target Circle, and Aldi produce.", clipCount > 0 ? ` ${clipCount} coupons still need a clip to count in the math.` : ""]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterRow, {
				label: "Store",
				value: store,
				onChange: setStore,
				options: [{
					id: "all",
					label: "All stores"
				}, ...STORES.map((s) => ({
					id: s.id,
					label: s.short
				}))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterRow, {
				label: "Deal type",
				value: kind,
				onChange: setKind,
				options: KIND_OPTIONS
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: deals.map((promo) => {
					const product = PRODUCT_MAP[promo.productId];
					const cmp = dealComparison(promo, ctx);
					const isClipped = clipped.includes(promo.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col gap-4 pt-5 sm:flex-row sm:items-start sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "min-w-0 flex-1 text-left",
							onClick: () => setOpenId(promo.productId),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreMark, {
											storeId: promo.storeId,
											size: "sm"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "deal",
											children: KIND_LABEL[promo.kind]
										}),
										cmp.beats ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "best",
											children: "Beats the others"
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 font-medium",
									children: product?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: promo.details
								}),
								cmp.self && cmp.nextBest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums font-medium",
										children: formatMoney(cmp.self.cost)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											" ",
											"for ",
											cmp.self.qty,
											cmp.beats ? ` · ${formatMoney(cmp.saveVsNext)} less than ${STORE_MAP[cmp.nextBest.storeId].short}` : ` · ${STORE_MAP[cmp.nextBest.storeId].short} is still cheaper at ${formatMoney(cmp.nextBest.cost)}`
										]
									})]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 flex-col gap-2 sm:w-40",
							children: [promo.requiresClip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: isClipped ? "secondary" : "default",
								onClick: () => {
									if (isClipped) {
										unclipPromo(promo.id);
										toast("Unclipped — price math updated");
									} else {
										clipPromo(promo.id);
										toast.success(`Clipped ${promo.label}`);
									}
								},
								children: isClipped ? "Clipped" : "Clip coupon"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									addToList(promo.productId, promo.kind === "bogo" || promo.kind === "bogo50" ? 2 : 1);
									toast.success("Added to list");
								},
								children: "Add to list"
							})]
						})]
					}) }, promo.id);
				})
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
export { DealsPage as component };
