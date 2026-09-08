import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as CheckboxIndicator, p as require_jsx_runtime, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { y as Check } from "../_libs/lucide-react.mjs";
import { r as cn } from "./router-C-tyNfJu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkbox-OVQMIwk8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("peer size-5 shrink-0 rounded-xs border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: "flex items-center justify-center text-current",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-3.5",
			strokeWidth: 2.5
		})
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
//#endregion
export { Checkbox as t };
