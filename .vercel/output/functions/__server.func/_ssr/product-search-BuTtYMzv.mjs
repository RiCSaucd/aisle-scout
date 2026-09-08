import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { s as Search } from "../_libs/lucide-react.mjs";
import { T as CATEGORY_LABEL, r as cn, w as CATALOG } from "./router-C-tyNfJu.mjs";
import { n as Input } from "./input-09shE_px.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-search-BuTtYMzv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductSearch({ onPick, placeholder = "Search bananas, bacon, Bounty…", autoFocus = false }) {
	const [q, setQ] = (0, import_react.useState)("");
	const results = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		if (needle.length < 1) return [];
		return CATALOG.filter((p) => {
			return `${p.name} ${p.brand ?? ""} ${p.category}`.toLowerCase().includes(needle);
		}).slice(0, 8);
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				autoFocus,
				onChange: (e) => setQ(e.target.value),
				placeholder,
				className: "h-12 rounded-lg pl-10",
				"aria-label": "Search products"
			}),
			results.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-md",
				children: results.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cn("flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm hover:bg-muted"),
					onClick: () => {
						onPick(p.id);
						setQ("");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-muted-foreground",
						children: p.size
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: CATEGORY_LABEL[p.category]
					})]
				}) }, p.id))
			}) : null
		]
	});
}
//#endregion
export { ProductSearch as t };
