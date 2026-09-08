import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as Minus, i as Trash2, l as Plus, r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as PRODUCT_MAP, O as LOCATIONS, i as useGroceryStore } from "./router-C-tyNfJu.mjs";
import { t as Badge } from "./store-mark-DPi0u4Bz.mjs";
import { n as Input, r as usePriceContext, t as Button } from "./input-09shE_px.mjs";
import { n as CardContent, t as Card } from "./card-gOPQnf4z.mjs";
import { t as FilterRow } from "./filter-row-i549Q8eT.mjs";
import { n as Label } from "./barcode-mark-D13A3TzG.mjs";
import { t as ProductSheet } from "./product-sheet-BGDwcXNE.mjs";
import { t as ProductSearch } from "./product-search-BuTtYMzv.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CjZaosCi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pantry-DejwoWYb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LOCATION_LABEL = {
	fridge: "Fridge",
	freezer: "Freezer",
	pantry: "Pantry",
	other: "Other"
};
function statusOf(item) {
	return {
		expiring: !!(item.expiresOn && item.expiresOn <= "2026-09-10"),
		expired: !!(item.expiresOn && item.expiresOn < "2026-09-07"),
		low: item.qty <= item.lowAt
	};
}
function PantryPage() {
	const ctx = usePriceContext();
	const inventory = useGroceryStore((s) => s.inventory);
	const addInventory = useGroceryStore((s) => s.addInventory);
	const updateInventory = useGroceryStore((s) => s.updateInventory);
	const removeInventory = useGroceryStore((s) => s.removeInventory);
	const addToList = useGroceryStore((s) => s.addToList);
	const resetDemo = useGroceryStore((s) => s.resetDemo);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [pendingId, setPendingId] = (0, import_react.useState)(null);
	const [pendingQty, setPendingQty] = (0, import_react.useState)("1");
	const [pendingLoc, setPendingLoc] = (0, import_react.useState)("pantry");
	const [pendingExp, setPendingExp] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => {
		return inventory.filter((i) => filter === "all" ? true : i.location === filter).slice().sort((a, b) => {
			const sa = statusOf(a);
			const sb = statusOf(b);
			const rank = (s) => s.expired ? 0 : s.expiring ? 1 : s.low ? 2 : 3;
			return rank(sa) - rank(sb);
		});
	}, [inventory, filter]);
	const alerts = inventory.filter((i) => {
		const s = statusOf(i);
		return s.expired || s.expiring || s.low;
	}).length;
	function commitPending(productId) {
		const product = PRODUCT_MAP[productId];
		addInventory({
			productId,
			qty: Math.max(0, Number(pendingQty) || 1),
			location: pendingLoc,
			expiresOn: pendingExp || void 0,
			lowAt: 1
		});
		toast.success(`Logged ${product?.name ?? "item"}`);
		setPendingId(null);
		setPendingQty("1");
		setPendingExp("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-medium tracking-tight",
						children: "Pantry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "max-w-xl text-muted-foreground",
						children: ["What you already have. ", alerts > 0 ? `${alerts} running low or close to the date.` : "Nothing waving for attention."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductSearch, {
						placeholder: "Log something you already have…",
						onPick: (id) => {
							const product = PRODUCT_MAP[id];
							const loc = product?.category === "frozen" ? "freezer" : product?.category === "produce" || product?.category === "dairy" || product?.category === "meat" ? "fridge" : "pantry";
							setPendingLoc(loc);
							setPendingId(id);
						}
					})
				]
			}),
			pendingId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium",
						children: ["Add ", PRODUCT_MAP[pendingId]?.name]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "inv-qty",
								children: "Quantity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "inv-qty",
								className: "mt-1.5",
								type: "number",
								min: 0,
								step: .1,
								value: pendingQty,
								onChange: (e) => setPendingQty(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Location" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: pendingLoc,
								onValueChange: (v) => setPendingLoc(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "mt-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LOCATIONS.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: loc,
									children: LOCATION_LABEL[loc]
								}, loc)) })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "inv-exp",
								children: "Use by"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "inv-exp",
								className: "mt-1.5",
								type: "date",
								value: pendingExp,
								onChange: (e) => setPendingExp(e.target.value)
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => commitPending(pendingId),
							children: "Save to pantry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setPendingId(null),
							children: "Cancel"
						})]
					})
				]
			}) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterRow, {
				label: "Location",
				value: filter,
				onChange: setFilter,
				options: [{
					id: "all",
					label: "All"
				}, ...LOCATIONS.map((loc) => ({
					id: loc,
					label: LOCATION_LABEL[loc]
				}))]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
				children: "Nothing in this spot yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: rows.map((item) => {
					const product = PRODUCT_MAP[item.productId];
					const s = statusOf(item);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "text-left",
								onClick: () => setOpenId(item.productId),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: product?.name
										}),
										s.expired ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "warn",
											children: "Expired"
										}) : null,
										!s.expired && s.expiring ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "warn",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mr-1 size-3" }), "Use soon"]
										}) : null,
										s.low && !s.expired ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											children: "Low"
										}) : null
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: [LOCATION_LABEL[item.location], item.expiresOn ? ` · use by ${item.expiresOn}` : ""]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Remove from pantry",
								onClick: () => removeInventory(item.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center rounded-md border border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon-sm",
										"aria-label": "Decrease quantity",
										onClick: () => updateInventory(item.id, { qty: Math.max(0, Math.round((item.qty - 1) * 10) / 10) }),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-8 text-center text-sm tabular-nums",
										children: item.qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon-sm",
										"aria-label": "Increase quantity",
										onClick: () => updateInventory(item.id, { qty: Math.round((item.qty + 1) * 10) / 10 }),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
									})
								]
							}), (s.low || s.expired) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									addToList(item.productId, 1);
									toast.success("Added to list");
								},
								children: "Add to list"
							})]
						})]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-xs text-muted-foreground underline-offset-4 hover:underline",
				onClick: () => {
					resetDemo();
					toast("Sample pantry and list restored");
				},
				children: "Reset sample data"
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
export { PantryPage as component };
