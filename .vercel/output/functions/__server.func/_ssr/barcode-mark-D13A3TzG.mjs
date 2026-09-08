import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { E as PRODUCT_MAP, a as allQuotes, l as hashId, r as cn, w as CATALOG, y as STORE_MAP } from "./router-C-tyNfJu.mjs";
import { a as formatMoney } from "./store-mark-DPi0u4Bz.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/barcode-mark-D13A3TzG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var L = [
	"0001101",
	"0011001",
	"0010011",
	"0111101",
	"0100011",
	"0110001",
	"0101111",
	"0111011",
	"0110111",
	"0001011"
];
var G = [
	"0100111",
	"0110011",
	"0011011",
	"0100001",
	"0011101",
	"0111001",
	"0000101",
	"0010001",
	"0001001",
	"0010111"
];
var R = [
	"1110010",
	"1100110",
	"1101100",
	"1000010",
	"1011100",
	"1001110",
	"1010000",
	"1000100",
	"1001000",
	"1110100"
];
var PARITY = [
	"AAAAAA",
	"AABABB",
	"AABBAB",
	"AABBBA",
	"ABAABB",
	"ABBAAB",
	"ABBBAA",
	"ABABAB",
	"ABABBA",
	"ABBABA"
];
function eanChecksum(body12) {
	let sum = 0;
	for (let i = 0; i < 12; i++) {
		const d = Number(body12[i]);
		sum += i % 2 === 0 ? d : d * 3;
	}
	return String((10 - sum % 10) % 10);
}
function upcFor(productId) {
	const body = `20${hashId(productId).toString().padStart(10, "0").slice(-10)}`;
	return body + eanChecksum(body);
}
function eanPattern(code) {
	const digits = code.split("").map(Number);
	const parity = PARITY[digits[0] ?? 0] ?? PARITY[0];
	let bits = "101";
	for (let i = 0; i < 6; i++) {
		const d = digits[i + 1] ?? 0;
		bits += (parity[i] === "A" ? L : G)[d];
	}
	bits += "01010";
	for (let i = 7; i < 13; i++) bits += R[digits[i] ?? 0];
	bits += "101";
	return bits;
}
function normalizeUpc(raw) {
	return raw.replace(/\D/g, "");
}
var BY_UPC = {};
for (const p of CATALOG) {
	const upc = upcFor(p.id);
	BY_UPC[upc] = p.id;
	BY_UPC[upc.slice(1)] = p.id;
}
function lookupUpc(raw) {
	const digits = normalizeUpc(raw);
	if (!digits) return null;
	if (BY_UPC[digits]) return PRODUCT_MAP[BY_UPC[digits]] ?? null;
	if (digits.length === 12 && BY_UPC[`0${digits}`]) return PRODUCT_MAP[BY_UPC[`0${digits}`]] ?? null;
	if (digits.length === 13 && BY_UPC[digits.slice(1)]) return PRODUCT_MAP[BY_UPC[digits.slice(1)]] ?? null;
	if (digits.length >= 4 && digits.length <= 8) {
		const hits = CATALOG.filter((p) => upcFor(p.id).endsWith(digits));
		if (hits.length === 1) return hits[0];
	}
	return null;
}
var SAMPLE_PRODUCTS = [
	"strawberries",
	"bananas",
	"eggs",
	"whole-milk",
	"chicken-breast",
	"shampoo",
	"toothpaste",
	"beer-12",
	"coffee",
	"paper-towels",
	"chips",
	"vodka-175"
].map((id) => PRODUCT_MAP[id]).filter((p) => !!p);
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-sm font-medium leading-none text-foreground peer-disabled:opacity-70", className),
	...props
}));
Label.displayName = Root.displayName;
function PriceGrid({ productId, qty = 1, ctx, compact = false }) {
	const quotes = allQuotes(productId, qty, ctx);
	if (quotes.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Not on the 32080 book."
	});
	const best = Math.min(...quotes.map((q) => q.cost));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-3 gap-1.5 sm:grid-cols-4",
		children: quotes.map((q) => {
			const store = STORE_MAP[q.storeId];
			const isBest = q.cost === best;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("rounded-md px-1.5 py-2 text-center", isBest ? "bg-best-fill text-best" : "bg-muted text-foreground"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("text-[10px] uppercase tracking-wide", isBest ? "text-best" : "text-muted-foreground"),
						children: store.short
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("font-medium tabular-nums", compact ? "text-xs" : "text-sm"),
						children: formatMoney(q.unitPrice)
					}),
					store.far ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 text-[10px] text-muted-foreground",
						children: [store.miles, " mi"]
					}) : null,
					q.promo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 truncate text-[10px] font-medium",
						children: q.promo.label
					}) : null
				]
			}, q.storeId);
		})
	});
}
function BarcodeMark({ productId, compact = false, className }) {
	const upc = upcFor(productId);
	const bits = eanPattern(upc);
	const barW = compact ? 1.1 : 1.4;
	const height = compact ? 36 : 56;
	const width = bits.length * barW;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("select-none", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			role: "img",
			"aria-label": `Barcode ${upc}`,
			width: width + 12,
			height: height + (compact ? 16 : 20),
			viewBox: `0 0 ${width + 12} ${height + (compact ? 16 : 20)}`,
			className: "text-foreground",
			children: bits.split("").map((b, i) => b === "1" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 6 + i * barW,
				y: 0,
				width: barW,
				height,
				fill: "currentColor"
			}, i) : null)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-center font-mono text-xs tracking-[0.18em] text-muted-foreground",
			children: upc
		})]
	});
}
//#endregion
export { lookupUpc as a, SAMPLE_PRODUCTS as i, Label as n, upcFor as o, PriceGrid as r, BarcodeMark as t };
