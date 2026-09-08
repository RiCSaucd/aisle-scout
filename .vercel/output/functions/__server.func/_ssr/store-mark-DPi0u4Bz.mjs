import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn, y as STORE_MAP } from "./router-C-tyNfJu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-mark-DPi0u4Bz.js
var import_jsx_runtime = require_jsx_runtime();
var money = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD"
});
function formatMoney(n) {
	return money.format(n);
}
var STORE_DOT = {
	aldi: "bg-aldi",
	walmart: "bg-walmart",
	target: "bg-target",
	publix: "bg-publix",
	winndixie: "bg-publix",
	cvs: "bg-target",
	walgreens: "bg-target",
	dollargeneral: "bg-warn",
	dollartree: "bg-aldi",
	abc: "bg-target",
	cstore: "bg-warn",
	costco: "bg-aldi",
	sams: "bg-walmart"
};
var KIND_LABEL = {
	bogo: "BOGO",
	bogo50: "BOGO 50%",
	sale: "Sale",
	coupon: "Coupon",
	rollback: "Rollback",
	circle: "Circle",
	"aldi-finds": "Aldi Finds"
};
var CATEGORY_ORDER = [
	"produce",
	"dairy",
	"meat",
	"bakery",
	"pantry",
	"frozen",
	"beverages",
	"household",
	"personal",
	"alcohol"
];
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground",
		secondary: "border-transparent bg-secondary text-secondary-foreground",
		outline: "border-border text-foreground",
		best: "border-transparent bg-best-fill text-best",
		warn: "border-transparent bg-warn-fill text-warn",
		deal: "border-transparent bg-accent text-accent-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function StoreMark({ storeId, size = "md", showName = true }) {
	const store = STORE_MAP[storeId];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5", size === "sm" ? "text-xs" : "text-sm"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("rounded-full", STORE_DOT[storeId], size === "sm" ? "size-1.5" : "size-2") }), showName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: store.short
		}) : null]
	});
}
//#endregion
export { formatMoney as a, StoreMark as i, CATEGORY_ORDER as n, KIND_LABEL as r, Badge as t };
