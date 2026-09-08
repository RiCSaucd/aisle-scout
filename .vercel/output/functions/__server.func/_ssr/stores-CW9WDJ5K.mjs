import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { A as MARKET_ZIP, M as STORE_KINDS, _ as STORES, g as LOCALS, i as useGroceryStore, k as MARKET_CITY, v as STORE_KIND_LABEL } from "./router-C-tyNfJu.mjs";
import { i as StoreMark, t as Badge } from "./store-mark-DPi0u4Bz.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-gOPQnf4z.mjs";
import { t as Checkbox } from "./checkbox-OVQMIwk8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stores-CW9WDJ5K.js
var import_jsx_runtime = require_jsx_runtime();
function StoresPage() {
	const includeFar = useGroceryStore((s) => s.includeFar);
	const setIncludeFar = useGroceryStore((s) => s.setIncludeFar);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: [
							"Market ",
							MARKET_ZIP,
							" · ",
							MARKET_CITY
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-medium tracking-tight",
						children: "Where 32080 actually shops."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-muted-foreground",
						children: "Groceries, pharmacies, dollar stores, wine and spirits, and the 24-hour c-stores on Anastasia Island — plus Costco and Sam’s Club as bulk trips. Other zips get their own book when someone uses Aisle Scout there. This one is yours."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex h-12 items-center gap-3 rounded-xl border border-border bg-card px-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					checked: includeFar,
					onCheckedChange: (v) => setIncludeFar(v === true)
				}), "Rank Costco (19 mi) and Sam’s (38 mi) in trip plans. They’re cheaper on bulk — not on a milk run."]
			}),
			STORE_KINDS.map((kind) => {
				const group = STORES.filter((s) => s.kind === kind);
				if (group.length === 0) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-medium",
						children: STORE_KIND_LABEL[kind]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3",
						children: group.map((store) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: store.far ? "border-dashed" : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
								className: "pb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "flex items-center gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreMark, { storeId: store.id })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												children: [store.miles, " mi"]
											}),
											store.membership ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "warn",
												children: "Membership"
											}) : null,
											store.bulk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												children: "Bulk"
											}) : null
										]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: store.tagline
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: store.sells
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: store.hours
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-1.5",
										children: store.locations.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: loc.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [
													" ",
													"· ",
													loc.address,
													", ",
													loc.city,
													" ",
													loc.zip
												]
											})]
										}, loc.address))
									})
								]
							})]
						}, store.id))
					})]
				}, kind);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-medium",
						children: "Also on the island"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "On the map, not on the chain price book."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: LOCALS.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "pt-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: loc.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: loc.kind
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										loc.address,
										" · ",
										loc.city
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm",
									children: loc.note
								})
							]
						}) }, loc.name))
					})
				]
			})
		]
	});
}
//#endregion
export { StoresPage as component };
