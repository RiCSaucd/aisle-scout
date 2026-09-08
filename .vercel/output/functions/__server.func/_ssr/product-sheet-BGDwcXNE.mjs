import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { S as Bell, c as ScanBarcode, t as X, u as Pin } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as PRODUCT_MAP, T as CATEGORY_LABEL, a as allQuotes, d as priceHistory, i as useGroceryStore, r as cn, y as STORE_MAP } from "./router-C-tyNfJu.mjs";
import { a as formatMoney, i as StoreMark, t as Badge } from "./store-mark-DPi0u4Bz.mjs";
import { n as Input, t as Button } from "./input-09shE_px.mjs";
import { n as Label, o as upcFor, r as PriceGrid, t as BarcodeMark } from "./barcode-mark-D13A3TzG.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-sheet-BGDwcXNE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-foreground/40", className),
	...props
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-card p-6 text-card-foreground shadow-lg transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b border-border",
		bottom: "inset-x-0 bottom-0 border-t border-border rounded-t-xl",
		left: "inset-y-0 left-0 h-full w-3/4 border-r border-border sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l border-border sm:max-w-md"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
SheetContent.displayName = DialogContent.displayName;
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 text-left", className),
		...props
	});
}
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("font-display text-lg font-medium text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function ProductSheet({ productId, ctx, open, onOpenChange }) {
	const product = productId ? PRODUCT_MAP[productId] : void 0;
	const addToList = useGroceryStore((s) => s.addToList);
	const addInventory = useGroceryStore((s) => s.addInventory);
	const lastStoreId = useGroceryStore((s) => s.lastStoreId);
	const watched = useGroceryStore((s) => s.watched);
	const staples = useGroceryStore((s) => s.staples);
	const toggleWatched = useGroceryStore((s) => s.toggleWatched);
	const toggleStaple = useGroceryStore((s) => s.toggleStaple);
	const [qty, setQty] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		setQty(1);
	}, [productId]);
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {})
	});
	const quotes = allQuotes(product.id, qty, ctx);
	const history = priceHistory(product.id, quotes[0]?.storeId ?? "aldi", ctx);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: product.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, { children: [
				product.brand ? `${product.brand} · ` : "",
				product.size,
				" · ",
				CATEGORY_LABEL[product.category],
				" · ",
				upcFor(product.id)
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceGrid, {
						productId: product.id,
						qty,
						ctx
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: quotes.map((q) => q.promo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-muted/60 px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreMark, {
								storeId: q.storeId,
								size: "sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted-foreground",
								children: q.promo.details
							})]
						}, q.storeId) : null)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
						children: "Four-week price at cheapest store"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end gap-2",
						children: history.map((h) => {
							const max = Math.max(...history.map((x) => x.price));
							const min = Math.min(...history.map((x) => x.price));
							const span = Math.max(.01, max - min);
							const height = 24 + (h.price - min) / span * 40;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full rounded-sm bg-primary/70",
									style: { height },
									title: formatMoney(h.price)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: h.week
								})]
							}, h.week);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-24",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "sheet-qty",
								children: "Qty"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "sheet-qty",
								type: "number",
								min: 1,
								step: 1,
								className: "mt-1.5",
								value: qty,
								onChange: (e) => setQty(Math.max(1, Number(e.target.value) || 1))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1",
							onClick: () => {
								addToList(product.id, qty);
								toast.success(`Added ${product.name} to the list`);
								onOpenChange(false);
							},
							children: "Add to list"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full",
						onClick: () => {
							addInventory({
								productId: product.id,
								qty,
								location: product.category === "produce" || product.category === "dairy" || product.category === "meat" ? "fridge" : product.category === "frozen" ? "freezer" : "pantry",
								lowAt: 1
							});
							toast.success(`Logged ${product.name} in pantry`);
						},
						children: "Add to pantry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: watched.includes(product.id) ? "secondary" : "outline",
							className: "flex-1",
							onClick: () => toggleWatched(product.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), watched.includes(product.id) ? "Watching" : "Watch"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: staples.includes(product.id) ? "secondary" : "outline",
							className: "flex-1",
							onClick: () => toggleStaple(product.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-4" }), "Staple"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/scan",
							search: { store: lastStoreId },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanBarcode, { className: "size-4" }),
								"Scan this at ",
								STORE_MAP[lastStoreId].short
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeMark, { productId: product.id }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: quotes.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: q.cost === Math.min(...quotes.map((x) => x.cost)) ? "best" : "secondary",
							children: [
								STORE_MAP[q.storeId].short,
								" ",
								formatMoney(q.cost),
								q.note ? ` · ${q.note}` : ""
							]
						}, q.storeId))
					})
				]
			})]
		})
	});
}
//#endregion
export { ProductSheet as t };
