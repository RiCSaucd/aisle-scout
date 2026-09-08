import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { A as MARKET_ZIP, _ as STORES, v as STORE_KIND_LABEL } from "./router-C-tyNfJu.mjs";
import { i as StoreMark, t as Badge } from "./store-mark-DPi0u4Bz.mjs";
import { t as Button } from "./input-09shE_px.mjs";
import { n as CardContent, t as Card } from "./card-gOPQnf4z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-strip-BVMwSTZP.js
var import_jsx_runtime = require_jsx_runtime();
function StoreStrip() {
	const nearby = STORES.filter((s) => !s.far);
	const far = STORES.filter((s) => s.far);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-2xl font-medium",
					children: [MARKET_ZIP, " stores"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Island grocers, pharmacies, dollar stores, ABC, and late-night c-stores — plus the warehouse clubs a drive away."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/stores",
						children: "Directory"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: nearby.map((store) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreMark, { storeId: store.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: STORE_KIND_LABEL[store.kind]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: store.tagline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								store.miles,
								" mi from ",
								MARKET_ZIP,
								" · ",
								store.locations[0]?.address
							]
						})
					]
				}) }, store.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: far.map((store) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-dashed",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreMark, { storeId: store.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "warn",
								children: [store.miles, " mi · bulk"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: store.tagline
						})]
					})
				}, store.id))
			})
		]
	});
}
//#endregion
export { StoreStrip as t };
