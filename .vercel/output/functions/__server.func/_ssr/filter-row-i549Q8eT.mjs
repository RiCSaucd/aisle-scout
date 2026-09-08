import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as cn } from "./router-C-tyNfJu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/filter-row-i549Q8eT.js
var import_jsx_runtime = require_jsx_runtime();
function FilterRow({ options, value, onChange, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0",
		role: "toolbar",
		"aria-label": label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex w-max gap-2 pb-1",
			children: options.map((opt) => {
				const active = opt.id === value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(opt.id),
					className: cn("h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-[background-color,color] duration-150", active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"),
					children: opt.label
				}, opt.id);
			})
		})
	});
}
//#endregion
export { FilterRow as t };
