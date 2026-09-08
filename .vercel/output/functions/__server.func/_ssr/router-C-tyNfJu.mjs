import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createRootRoute, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as Ticket, c as ScanBarcode, f as MapPin, g as House, n as Warehouse, o as Table2, p as ListChecks, r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C-tyNfJu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var SEED_INVENTORY = [
	{
		id: "inv-milk",
		productId: "whole-milk",
		qty: .4,
		location: "fridge",
		expiresOn: "2026-09-09",
		lowAt: .5
	},
	{
		id: "inv-eggs",
		productId: "eggs",
		qty: 4,
		location: "fridge",
		expiresOn: "2026-09-18",
		lowAt: 6
	},
	{
		id: "inv-spinach",
		productId: "spinach",
		qty: 1,
		location: "fridge",
		expiresOn: "2026-09-08",
		lowAt: 1
	},
	{
		id: "inv-butter",
		productId: "butter",
		qty: 1,
		location: "fridge",
		expiresOn: "2026-10-02",
		lowAt: 1
	},
	{
		id: "inv-chicken",
		productId: "chicken-breast",
		qty: 1.2,
		location: "freezer",
		expiresOn: "2026-10-20",
		lowAt: 1
	},
	{
		id: "inv-rice",
		productId: "white-rice",
		qty: 1,
		location: "pantry",
		lowAt: 1
	},
	{
		id: "inv-tp",
		productId: "toilet-paper",
		qty: 1,
		location: "other",
		lowAt: 1
	},
	{
		id: "inv-coffee",
		productId: "coffee",
		qty: .2,
		location: "pantry",
		lowAt: .4
	},
	{
		id: "inv-bananas",
		productId: "bananas",
		qty: 3,
		location: "other",
		expiresOn: "2026-09-10",
		lowAt: 4
	},
	{
		id: "inv-shampoo",
		productId: "shampoo",
		qty: .2,
		location: "other",
		lowAt: .4
	}
];
var SEED_LIST = [
	{
		id: "li-straw",
		productId: "strawberries",
		qty: 2,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-milk",
		productId: "whole-milk",
		qty: 1,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-eggs",
		productId: "eggs",
		qty: 1,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-chicken",
		productId: "chicken-breast",
		qty: 2,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-pasta",
		productId: "spaghetti",
		qty: 2,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-sauce",
		productId: "marinara",
		qty: 2,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-bacon",
		productId: "bacon",
		qty: 2,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-bananas",
		productId: "bananas",
		qty: 3,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-tp",
		productId: "toilet-paper",
		qty: 1,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-coffee",
		productId: "coffee",
		qty: 1,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-towels",
		productId: "paper-towels",
		qty: 2,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-shampoo",
		productId: "shampoo",
		qty: 1,
		preferredStore: "cheapest",
		checked: false
	},
	{
		id: "li-beer",
		productId: "beer-12",
		qty: 1,
		preferredStore: "cheapest",
		checked: false
	}
];
var SEED_STAPLES = [
	"whole-milk",
	"eggs",
	"bananas",
	"white-bread",
	"coffee",
	"toilet-paper",
	"shampoo"
];
var SEED_WATCHED = [
	"chicken-breast",
	"strawberries",
	"paper-towels",
	"vodka-175"
];
var STORE_IDS = [
	"aldi",
	"walmart",
	"target",
	"publix",
	"winndixie",
	"cvs",
	"walgreens",
	"dollargeneral",
	"dollartree",
	"abc",
	"cstore",
	"costco",
	"sams"
];
var STORE_KINDS = [
	"grocery",
	"pharmacy",
	"dollar",
	"liquor",
	"convenience",
	"club"
];
var CATEGORIES = [
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
var LOCATIONS = [
	"fridge",
	"freezer",
	"pantry",
	"other"
];
var MARKET_ZIP = "32080";
var MARKET_CITY = "St. Augustine Beach";
function r2(n) {
	return Math.round(n * 100) / 100;
}
var GROCERS = [
	"aldi",
	"walmart",
	"target",
	"publix",
	"winndixie"
];
var CLUBS = ["costco", "sams"];
function carryFor(category) {
	switch (category) {
		case "produce": return [...GROCERS, ...CLUBS];
		case "dairy": return [
			...GROCERS,
			"cvs",
			"walgreens",
			"cstore",
			...CLUBS
		];
		case "meat": return [...GROCERS, ...CLUBS];
		case "bakery": return [
			...GROCERS,
			"cstore",
			"costco"
		];
		case "pantry": return [
			...GROCERS,
			"dollargeneral",
			"dollartree",
			...CLUBS
		];
		case "frozen": return [...GROCERS, ...CLUBS];
		case "beverages": return [
			...GROCERS,
			"cvs",
			"walgreens",
			"dollargeneral",
			"cstore",
			...CLUBS
		];
		case "household": return [
			...GROCERS,
			"cvs",
			"walgreens",
			"dollargeneral",
			...CLUBS
		];
		case "personal": return [
			...GROCERS,
			"cvs",
			"walgreens",
			"dollargeneral",
			"cstore",
			...CLUBS
		];
		case "alcohol": return [
			"aldi",
			"walmart",
			"target",
			"publix",
			"winndixie",
			"abc",
			"cstore",
			...CLUBS
		];
	}
}
var MARKUP = {
	winndixie: 1.2,
	cvs: 1.55,
	walgreens: 1.58,
	dollargeneral: 1.08,
	dollartree: .5,
	cstore: 1.9,
	abc: 1.05,
	costco: .78,
	sams: .83
};
function expand(category, base, only) {
	if (only) {
		const out = {};
		for (const id of only) if (base[id] != null) out[id] = base[id];
		return out;
	}
	const walmart = base.walmart ?? base.aldi ?? 1;
	const out = { ...base };
	if (out.winndixie == null && base.target != null && base.publix != null) out.winndixie = r2((base.target + base.publix) / 2);
	for (const id of carryFor(category)) {
		if (out[id] != null) continue;
		if (id === "dollartree") {
			if (walmart > 4) continue;
			out[id] = 1.25;
			continue;
		}
		const m = MARKUP[id];
		if (m == null) continue;
		out[id] = r2(walmart * m);
	}
	return out;
}
function item(id, name, category, size, unit, aldi, walmart, target, publix, brand, extra) {
	return {
		id,
		name,
		brand,
		category,
		size,
		unit,
		regular: expand(category, {
			aldi,
			walmart,
			target,
			publix,
			...extra
		})
	};
}
function limited(id, name, category, size, unit, prices, brand) {
	return {
		id,
		name,
		brand,
		category,
		size,
		unit,
		regular: expand(category, prices, STORE_IDS.filter((s) => prices[s] != null))
	};
}
/** St. Augustine market book — week of Sep 4, 2026. Everyday shelf prices before promos. */
var CATALOG = [
	item("bananas", "Bananas", "produce", "per lb", "lb", .44, .54, .59, .69),
	item("strawberries", "Strawberries", "produce", "1 lb clamshell", "each", 2.79, 3.48, 3.99, 5.99),
	item("blueberries", "Blueberries", "produce", "18 oz", "each", 3.49, 3.98, 4.49, 5.99),
	item("raspberries", "Raspberries", "produce", "6 oz", "each", 2.49, 2.98, 3.29, 3.99),
	item("avocados", "Hass Avocados", "produce", "each", "each", .79, .98, 1.29, 1.49),
	item("roma-tomatoes", "Roma Tomatoes", "produce", "per lb", "lb", 1.19, 1.38, 1.69, 1.99),
	item("grape-tomatoes", "Grape Tomatoes", "produce", "10 oz", "each", 1.49, 1.98, 2.29, 2.79),
	item("iceberg", "Iceberg Lettuce", "produce", "head", "each", 1.29, 1.48, 1.79, 1.99),
	item("romaine", "Romaine Hearts", "produce", "3-pack", "pack", 2.49, 2.98, 3.29, 3.99),
	item("spinach", "Baby Spinach", "produce", "5 oz", "each", 1.79, 2.28, 2.49, 2.99),
	item("broccoli", "Broccoli Crowns", "produce", "per lb", "lb", 1.49, 1.78, 1.99, 2.49),
	item("cauliflower", "Cauliflower", "produce", "head", "each", 2.29, 2.68, 2.99, 3.49),
	item("carrots", "Baby Carrots", "produce", "1 lb bag", "bag", 1.19, 1.28, 1.49, 1.79),
	item("yellow-onions", "Yellow Onions", "produce", "3 lb bag", "bag", 1.99, 2.48, 2.79, 3.29),
	item("red-onions", "Red Onions", "produce", "per lb", "lb", 1.09, 1.28, 1.49, 1.69),
	item("russets", "Russet Potatoes", "produce", "5 lb bag", "bag", 2.49, 2.98, 3.49, 3.99),
	item("sweet-potatoes", "Sweet Potatoes", "produce", "per lb", "lb", .89, .98, 1.19, 1.49),
	item("garlic", "Garlic", "produce", "3-count", "pack", .99, 1.18, 1.49, 1.79),
	item("lemons", "Lemons", "produce", "2 lb bag", "bag", 2.49, 2.98, 3.49, 3.99),
	item("limes", "Limes", "produce", "1 lb bag", "bag", 1.49, 1.78, 1.99, 2.49),
	item("bell-peppers", "Green Bell Peppers", "produce", "each", "each", .59, .78, .89, .99),
	item("cucumbers", "Cucumbers", "produce", "each", "each", .59, .68, .79, .89),
	item("zucchini", "Zucchini", "produce", "per lb", "lb", 1.19, 1.38, 1.59, 1.89),
	item("corn", "Sweet Corn", "produce", "each", "each", .33, .48, .59, .69),
	item("gala-apples", "Gala Apples", "produce", "3 lb bag", "bag", 2.99, 3.48, 3.99, 4.49),
	item("granny-smith", "Granny Smith Apples", "produce", "per lb", "lb", 1.19, 1.38, 1.59, 1.99),
	item("oranges", "Navel Oranges", "produce", "4 lb bag", "bag", 3.49, 3.98, 4.49, 4.99),
	item("grapes", "Red Seedless Grapes", "produce", "per lb", "lb", 1.49, 1.98, 2.29, 2.99),
	item("watermelon", "Seedless Watermelon", "produce", "each", "each", 3.99, 4.98, 5.99, 6.99),
	item("cilantro", "Cilantro", "produce", "bunch", "bunch", .69, .78, .99, 1.29),
	item("mushrooms", "White Mushrooms", "produce", "8 oz", "each", 1.49, 1.78, 1.99, 2.49),
	item("celery", "Celery", "produce", "bunch", "bunch", 1.29, 1.48, 1.79, 1.99),
	item("asparagus", "Asparagus", "produce", "per lb", "lb", 2.49, 2.98, 3.49, 3.99),
	item("mini-peppers", "Mini Sweet Peppers", "produce", "1 lb", "bag", 2.99, 3.48, 3.99, 4.49),
	item("salad-mix", "Garden Salad Mix", "produce", "12 oz", "each", 1.99, 2.28, 2.49, 2.99),
	item("jalapenos", "Jalapeños", "produce", "per lb", "lb", 1.29, 1.48, 1.69, 1.99),
	item("mango", "Mango", "produce", "each", "each", .79, .98, 1.29, 1.49),
	item("pineapple", "Pineapple", "produce", "each", "each", 1.99, 2.48, 2.99, 3.49),
	item("green-beans", "Green Beans", "produce", "per lb", "lb", 1.49, 1.78, 1.99, 2.49),
	item("cabbage", "Green Cabbage", "produce", "head", "each", 1.49, 1.78, 1.99, 2.29),
	item("kale", "Kale", "produce", "bunch", "bunch", 1.49, 1.78, 1.99, 2.49),
	item("green-onions", "Green Onions", "produce", "bunch", "bunch", .69, .78, .99, 1.29),
	item("ginger", "Ginger Root", "produce", "per lb", "lb", 2.99, 3.48, 3.99, 4.49),
	item("peaches", "Peaches", "produce", "per lb", "lb", 1.49, 1.78, 1.99, 2.49),
	item("okra", "Okra", "produce", "per lb", "lb", 1.99, 2.28, 2.49, 2.99),
	item("yellow-squash", "Yellow Squash", "produce", "per lb", "lb", 1.19, 1.38, 1.59, 1.89),
	item("honeydew", "Honeydew", "produce", "each", "each", 2.99, 3.48, 3.99, 4.49),
	item("cantaloupe", "Cantaloupe", "produce", "each", "each", 2.49, 2.98, 3.49, 3.99),
	item("parsley", "Flat-Leaf Parsley", "produce", "bunch", "bunch", .69, .89, .99, 1.29),
	item("whole-milk", "Whole Milk", "dairy", "1 gallon", "gal", 2.89, 3.24, 3.59, 4.29, "store brand"),
	item("2pct-milk", "2% Milk", "dairy", "1 gallon", "gal", 2.89, 3.24, 3.59, 4.29, "store brand"),
	item("almond-milk", "Almond Milk", "dairy", "half gallon", "each", 2.19, 2.48, 2.79, 3.29, "Almond Breeze"),
	item("eggs", "Large Eggs", "dairy", "dozen", "dozen", 2.65, 2.98, 3.49, 3.99),
	item("butter", "Salted Butter", "dairy", "1 lb", "each", 3.29, 3.68, 4.29, 4.99, "store brand"),
	item("cream-cheese", "Cream Cheese", "dairy", "8 oz", "each", 1.49, 1.98, 2.29, 2.99, "Philadelphia"),
	item("cheddar", "Shredded Cheddar", "dairy", "8 oz", "each", 1.79, 2.18, 2.49, 2.99, "store brand"),
	item("greek-yogurt", "Greek Yogurt", "dairy", "32 oz", "each", 3.49, 3.98, 4.49, 5.49, "Chobani"),
	item("sour-cream", "Sour Cream", "dairy", "16 oz", "each", 1.49, 1.78, 1.99, 2.49),
	item("half-half", "Half & Half", "dairy", "pint", "each", 1.79, 2.18, 2.49, 2.99),
	item("string-cheese", "String Cheese", "dairy", "12-pack", "pack", 3.49, 3.98, 4.29, 4.99),
	item("cottage-cheese", "Cottage Cheese", "dairy", "24 oz", "each", 2.49, 2.78, 3.19, 3.69),
	item("chicken-breast", "Boneless Chicken Breast", "meat", "per lb", "lb", 2.89, 2.97, 3.49, 4.99),
	item("ground-beef", "Ground Beef 80/20", "meat", "per lb", "lb", 3.99, 4.47, 4.99, 5.99),
	item("ground-turkey", "Ground Turkey 93%", "meat", "per lb", "lb", 3.49, 3.98, 4.49, 5.49),
	item("bacon", "Bacon", "meat", "12 oz", "each", 3.49, 3.98, 4.49, 6.99, "Oscar Mayer"),
	item("pork-chops", "Bone-in Pork Chops", "meat", "per lb", "lb", 2.49, 2.78, 3.29, 3.99),
	item("salmon", "Atlantic Salmon Fillet", "meat", "per lb", "lb", 6.99, 7.48, 8.99, 9.99),
	item("shrimp", "Large Shrimp", "meat", "1 lb bag", "bag", 6.99, 7.98, 8.99, 10.99),
	item("rotisserie", "Rotisserie Chicken", "meat", "each", "each", 5.99, 6.98, 7.99, 8.99),
	item("hot-dogs", "Beef Hot Dogs", "meat", "15 oz", "pack", 2.49, 2.98, 3.29, 4.99, "Ball Park"),
	item("deli-turkey", "Oven Roasted Turkey", "meat", "per lb", "lb", 4.99, 5.48, 6.49, 7.99),
	item("white-bread", "White Bread", "bakery", "20 oz loaf", "loaf", 1.09, 1.28, 1.49, 2.49, "store brand"),
	item("wheat-bread", "Wheat Bread", "bakery", "20 oz loaf", "loaf", 1.29, 1.48, 1.79, 2.79, "store brand"),
	item("bagels", "Plain Bagels", "bakery", "6-count", "pack", 2.19, 2.68, 2.99, 3.99, "Thomas"),
	item("tortillas", "Flour Tortillas", "bakery", "10-count", "pack", 1.79, 1.98, 2.29, 2.79),
	item("hamburger-buns", "Hamburger Buns", "bakery", "8-count", "pack", 1.29, 1.48, 1.79, 2.49),
	item("peanut-butter", "Peanut Butter", "pantry", "16 oz", "each", 1.79, 2.18, 2.49, 2.99, "Jif"),
	item("grape-jelly", "Grape Jelly", "pantry", "18 oz", "each", 1.49, 1.78, 1.99, 2.49, "Smucker's"),
	item("spaghetti", "Spaghetti", "pantry", "16 oz", "each", .89, 1, 1.19, 1.79, "Barilla"),
	item("marinara", "Marinara Sauce", "pantry", "24 oz", "each", 1.29, 1.48, 1.79, 2.49, "Prego"),
	item("white-rice", "Long Grain Rice", "pantry", "2 lb", "bag", 1.49, 1.68, 1.99, 2.29),
	item("cheerios", "Cheerios", "pantry", "18 oz", "each", 3.49, 3.68, 3.99, 4.99, "General Mills"),
	item("oatmeal", "Old Fashioned Oats", "pantry", "42 oz", "each", 2.99, 3.48, 3.79, 4.29, "Quaker"),
	item("olive-oil", "Extra Virgin Olive Oil", "pantry", "16.9 oz", "each", 4.49, 4.98, 5.99, 7.49),
	item("flour", "All-Purpose Flour", "pantry", "5 lb", "bag", 2.19, 2.38, 2.79, 3.29),
	item("sugar", "Granulated Sugar", "pantry", "4 lb", "bag", 2.49, 2.68, 2.99, 3.49),
	item("coffee", "Ground Coffee", "pantry", "30.5 oz", "each", 6.99, 7.48, 8.49, 9.99, "Folgers"),
	item("tuna", "Chunk Light Tuna", "pantry", "5 oz", "each", .79, .88, .99, 1.29, "StarKist"),
	item("black-beans", "Black Beans", "pantry", "15 oz", "each", .79, .82, .99, 1.19),
	item("chicken-broth", "Chicken Broth", "pantry", "32 oz", "each", 1.19, 1.28, 1.49, 1.79),
	item("chips", "Potato Chips", "pantry", "7.75 oz", "each", 1.79, 2.48, 2.79, 4.49, "Lay's"),
	item("salsa", "Medium Salsa", "pantry", "16 oz", "each", 1.49, 1.78, 1.99, 2.49),
	item("ketchup", "Ketchup", "pantry", "20 oz", "each", 1.49, 1.68, 1.89, 2.49, "Heinz"),
	item("mayo", "Mayonnaise", "pantry", "30 oz", "each", 2.99, 3.48, 3.79, 4.49, "Hellmann's"),
	item("frozen-pizza", "Rising Crust Pizza", "frozen", "each", "each", 3.99, 4.48, 4.99, 6.99, "DiGiorno"),
	item("frozen-broccoli", "Frozen Broccoli", "frozen", "12 oz", "each", .99, 1.08, 1.29, 1.49),
	item("ice-cream", "Ice Cream", "frozen", "48 oz", "each", 3.49, 3.98, 4.49, 5.99, "store brand"),
	item("waffles", "Frozen Waffles", "frozen", "10-count", "pack", 1.79, 2.18, 2.49, 3.29, "Eggo"),
	item("nuggets", "Chicken Nuggets", "frozen", "25 oz", "each", 4.99, 5.48, 5.99, 6.99),
	item("frozen-berries", "Frozen Mixed Berries", "frozen", "12 oz", "each", 2.49, 2.78, 3.19, 3.99),
	item("oj", "Orange Juice", "beverages", "52 oz", "each", 2.79, 3.18, 3.49, 3.99, "Simply"),
	item("coke-12", "Coca-Cola 12-pack", "beverages", "12 × 12 oz", "pack", 5.49, 5.98, 6.49, 7.99, "Coca-Cola"),
	item("water-24", "Bottled Water", "beverages", "24-pack", "pack", 2.99, 3.48, 3.99, 4.99),
	item("sparkling", "Sparkling Water", "beverages", "12-pack", "pack", 3.49, 3.98, 4.29, 4.99, "LaCroix"),
	item("sweet-tea", "Sweet Tea", "beverages", "1 gallon", "gal", 1.99, 2.28, 2.49, 2.99),
	item("paper-towels", "Paper Towels", "household", "6 mega rolls", "pack", 7.99, 8.97, 9.99, 14.99, "Bounty"),
	item("toilet-paper", "Toilet Paper", "household", "12 mega rolls", "pack", 8.99, 9.97, 11.49, 15.99, "Charmin"),
	item("dish-soap", "Dish Soap", "household", "22 oz", "each", 1.49, 1.68, 1.99, 2.49, "Dawn"),
	item("detergent", "Laundry Detergent", "household", "92 oz", "each", 8.49, 8.97, 9.99, 12.99, "Tide"),
	item("trash-bags", "Kitchen Trash Bags", "household", "40-count", "pack", 6.49, 6.98, 7.49, 8.99),
	item("shampoo", "Shampoo", "personal", "12.6 oz", "each", 3.29, 3.97, 4.49, 5.99, "Pantene"),
	item("conditioner", "Conditioner", "personal", "12.6 oz", "each", 3.29, 3.97, 4.49, 5.99, "Pantene"),
	item("body-wash", "Body Wash", "personal", "22 oz", "each", 4.49, 5.47, 5.99, 7.49, "Dove"),
	item("bar-soap", "Bar Soap 2-pack", "personal", "2 bars", "pack", 1.29, 1.48, 1.79, 2.49, "Dove", { dollartree: 1.25 }),
	item("toothpaste", "Toothpaste", "personal", "5.8 oz", "each", 2.49, 2.97, 3.29, 4.49, "Crest"),
	item("deodorant", "Deodorant", "personal", "2.6 oz", "each", 3.49, 4.27, 4.79, 5.99, "Old Spice"),
	item("lotion", "Body Lotion", "personal", "16.9 oz", "each", 3.99, 4.48, 4.99, 6.49, "Lubriderm"),
	item("razors", "Disposable Razors", "personal", "10-count", "pack", 5.99, 6.97, 7.49, 9.99, "Gillette"),
	item("salt", "Iodized Salt", "pantry", "26 oz", "each", .49, .62, .79, .99),
	item("black-pepper", "Black Pepper", "pantry", "3 oz", "each", 1.49, 1.88, 2.29, 2.99),
	item("garlic-powder", "Garlic Powder", "pantry", "3.25 oz", "each", 1.29, 1.58, 1.99, 2.49),
	item("italian-seasoning", "Italian Seasoning", "pantry", "0.75 oz", "each", 1.19, 1.38, 1.69, 2.29),
	item("cinnamon", "Ground Cinnamon", "pantry", "2.37 oz", "each", 1.29, 1.48, 1.79, 2.49),
	item("taco-seasoning", "Taco Seasoning", "pantry", "1 oz", "each", .59, .68, .89, 1.19),
	item("beer-12", "Domestic Beer 12-pack", "alcohol", "12 × 12 oz", "pack", 11.99, 12.48, 13.99, 15.99, "Miller Lite"),
	item("seltzer-12", "Hard Seltzer 12-pack", "alcohol", "12 × 12 oz", "pack", 14.99, 15.98, 16.99, 18.99, "White Claw"),
	item("wine-chard", "Chardonnay", "alcohol", "750 ml", "each", 7.99, 8.48, 9.99, 11.99, "Kendall-Jackson"),
	limited("vodka-175", "Vodka 1.75 L", "alcohol", "1.75 L", "each", {
		abc: 24.99,
		publix: 28.99,
		winndixie: 27.99,
		costco: 21.99,
		sams: 22.98
	}, "Tito's"),
	limited("whiskey-175", "Bourbon 1.75 L", "alcohol", "1.75 L", "each", {
		abc: 29.99,
		publix: 34.99,
		winndixie: 33.99,
		costco: 26.99,
		sams: 27.98
	}, "Evan Williams")
];
var PRODUCT_MAP = Object.fromEntries(CATALOG.map((p) => [p.id, p]));
var CATEGORY_LABEL = {
	produce: "Produce",
	dairy: "Dairy & eggs",
	meat: "Meat & seafood",
	bakery: "Bakery",
	pantry: "Pantry & spices",
	frozen: "Frozen",
	beverages: "Drinks",
	household: "Household",
	personal: "Personal care",
	alcohol: "Beer, wine & spirits"
};
/** Circular week: Thursday Sep 3 – Wednesday Sep 9, 2026 (today is Mon Sep 7). */
var WEEK_START = "2026-09-03";
var WEEK_END = "2026-09-09";
var WEEK_LABEL = "Sep 3–9, 2026";
var PROMOTIONS = [
	{
		id: "pub-straw-bogo",
		productId: "strawberries",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 5.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Buy one 1 lb clamshell, get one free. Effective $3.00 each when you take both."
	},
	{
		id: "pub-blue-bogo",
		productId: "blueberries",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 5.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "18 oz blueberries BOGO. Best if you actually need two."
	},
	{
		id: "pub-pasta-bogo",
		productId: "spaghetti",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 1.79,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Barilla 16 oz pasta, BOGO."
	},
	{
		id: "pub-prego-bogo",
		productId: "marinara",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 2.49,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Prego 24 oz, BOGO."
	},
	{
		id: "pub-bacon-bogo",
		productId: "bacon",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 6.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Oscar Mayer 12 oz bacon, BOGO. Beats everyday Walmart if you freeze the extra."
	},
	{
		id: "pub-dogs-bogo",
		productId: "hot-dogs",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 4.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Ball Park beef franks, BOGO."
	},
	{
		id: "pub-chips-bogo",
		productId: "chips",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 4.49,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Lay's 7.75 oz, BOGO."
	},
	{
		id: "pub-coke-bogo",
		productId: "coke-12",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 7.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Coca-Cola 12-pack cans, BOGO. Limit 2 offers."
	},
	{
		id: "pub-bounty-bogo",
		productId: "paper-towels",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 14.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Bounty 6 mega rolls, BOGO. Huge if you have storage."
	},
	{
		id: "pub-charmin-bogo",
		productId: "toilet-paper",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 15.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Charmin 12 mega rolls, BOGO."
	},
	{
		id: "pub-philly-bogo",
		productId: "cream-cheese",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 2.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Philadelphia 8 oz, BOGO."
	},
	{
		id: "pub-chobani-bogo",
		productId: "greek-yogurt",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 5.49,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Chobani 32 oz, BOGO."
	},
	{
		id: "pub-bagels-bogo",
		productId: "bagels",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 3.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Thomas' bagels, BOGO."
	},
	{
		id: "pub-pizza-bogo",
		productId: "frozen-pizza",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 6.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "DiGiorno rising crust, BOGO."
	},
	{
		id: "pub-cheerios-bogo",
		productId: "cheerios",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 4.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Cheerios 18 oz, BOGO."
	},
	{
		id: "pub-folgers-bogo",
		productId: "coffee",
		storeId: "publix",
		kind: "bogo",
		label: "BOGO",
		salePrice: 9.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Folgers 30.5 oz, BOGO."
	},
	{
		id: "pub-chicken-sale",
		productId: "chicken-breast",
		storeId: "publix",
		kind: "sale",
		label: "This week",
		salePrice: 1.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Pub Sub week adjacent: boneless breast $1.99/lb. Rare Publix meat win."
	},
	{
		id: "wmt-eggs",
		productId: "eggs",
		storeId: "walmart",
		kind: "rollback",
		label: "Rollback",
		salePrice: 2.22,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Large eggs dozen rollback at the US-1 Supercenter."
	},
	{
		id: "wmt-beef",
		productId: "ground-beef",
		storeId: "walmart",
		kind: "rollback",
		label: "Rollback",
		salePrice: 3.97,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "80/20 ground beef rollback, per lb."
	},
	{
		id: "wmt-chicken",
		productId: "chicken-breast",
		storeId: "walmart",
		kind: "rollback",
		label: "Rollback",
		salePrice: 1.97,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Boneless skinless breast rollback. Watch package dates."
	},
	{
		id: "wmt-milk",
		productId: "whole-milk",
		storeId: "walmart",
		kind: "rollback",
		label: "Rollback",
		salePrice: 2.92,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Great Value whole gallon."
	},
	{
		id: "wmt-detergent",
		productId: "detergent",
		storeId: "walmart",
		kind: "rollback",
		label: "Rollback",
		salePrice: 7.94,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Tide 92 oz liquid rollback."
	},
	{
		id: "wmt-water",
		productId: "water-24",
		storeId: "walmart",
		kind: "sale",
		label: "Rollback",
		salePrice: 2.88,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "24-pack purified water."
	},
	{
		id: "tgt-avocado-circle",
		productId: "avocados",
		storeId: "target",
		kind: "circle",
		label: "Circle 30% off",
		salePrice: .9,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Good & Gather avocados, 30% off with Circle. Clip in the Target app.",
		requiresClip: true
	},
	{
		id: "tgt-yogurt-dotw",
		productId: "greek-yogurt",
		storeId: "target",
		kind: "circle",
		label: "Deal of the week",
		salePrice: 3.49,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Good & Gather 32 oz Greek yogurt. Circle members.",
		requiresClip: true
	},
	{
		id: "tgt-berries",
		productId: "frozen-berries",
		storeId: "target",
		kind: "bogo50",
		label: "BOGO 50% off",
		salePrice: 3.19,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Good & Gather frozen mixed berries, second bag half off."
	},
	{
		id: "tgt-cheerios-coupon",
		productId: "cheerios",
		storeId: "target",
		kind: "coupon",
		label: "$1 Circle coupon",
		couponValue: 1,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "$1 off Cheerios 18 oz, clip once.",
		requiresClip: true
	},
	{
		id: "tgt-laundry",
		productId: "detergent",
		storeId: "target",
		kind: "circle",
		label: "Circle $3 off",
		couponValue: 3,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "$3 off Tide 92 oz with Circle.",
		requiresClip: true
	},
	{
		id: "tgt-pizza",
		productId: "frozen-pizza",
		storeId: "target",
		kind: "sale",
		label: "Weekly",
		salePrice: 3.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "DiGiorno rising crust weekly ad."
	},
	{
		id: "aldi-straw",
		productId: "strawberries",
		storeId: "aldi",
		kind: "sale",
		label: "Produce special",
		salePrice: 1.69,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "1 lb strawberries. Best produce buy in St. Augustine this week."
	},
	{
		id: "aldi-avo",
		productId: "avocados",
		storeId: "aldi",
		kind: "sale",
		label: "2 for $1.50",
		salePrice: .75,
		minQty: 2,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Hass avocados 2 for $1.50. Single still $0.79."
	},
	{
		id: "aldi-grapes",
		productId: "grapes",
		storeId: "aldi",
		kind: "sale",
		label: "Produce special",
		salePrice: 1.29,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Red seedless grapes per lb."
	},
	{
		id: "aldi-blue",
		productId: "blueberries",
		storeId: "aldi",
		kind: "sale",
		label: "Produce special",
		salePrice: 2.89,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "18 oz blueberries."
	},
	{
		id: "aldi-chicken",
		productId: "chicken-breast",
		storeId: "aldi",
		kind: "aldi-finds",
		label: "Fresh special",
		salePrice: 2.19,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Never Frozen chicken breast per lb. Check the case early."
	},
	{
		id: "aldi-eggs",
		productId: "eggs",
		storeId: "aldi",
		kind: "sale",
		label: "Weekly",
		salePrice: 1.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Dozen large eggs."
	},
	{
		id: "aldi-rotisserie",
		productId: "rotisserie",
		storeId: "aldi",
		kind: "aldi-finds",
		label: "Fresh",
		salePrice: 4.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Seasoned rotisserie chicken, while they last."
	},
	{
		id: "aldi-bananas",
		productId: "bananas",
		storeId: "aldi",
		kind: "sale",
		label: "Everyday low",
		salePrice: .39,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Bananas per lb. Bring a bag."
	},
	{
		id: "pub-pb-coupon",
		productId: "peanut-butter",
		storeId: "publix",
		kind: "coupon",
		label: "Digital $1 off",
		couponValue: 1,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Publix app coupon on Jif 16 oz. Clip before checkout.",
		requiresClip: true
	},
	{
		id: "pub-deli-sale",
		productId: "deli-turkey",
		storeId: "publix",
		kind: "sale",
		label: "Deli special",
		salePrice: 5.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Boar's Head-style oven roasted turkey, this week only."
	},
	{
		id: "wmt-bananas",
		productId: "bananas",
		storeId: "walmart",
		kind: "rollback",
		label: "Unadvertised",
		salePrice: .48,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "US-1 Supercenter produce wall. Still behind Aldi."
	},
	{
		id: "tgt-bounty",
		productId: "paper-towels",
		storeId: "target",
		kind: "circle",
		label: "Circle $4 off",
		couponValue: 4,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "$4 off Bounty 6 mega with Circle. Publix BOGO still wins if you take two.",
		requiresClip: true
	},
	{
		id: "aldi-peaches",
		productId: "peaches",
		storeId: "aldi",
		kind: "sale",
		label: "Produce special",
		salePrice: .99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Yellow peaches per lb. Seasonal Florida window."
	},
	{
		id: "aldi-kale",
		productId: "kale",
		storeId: "aldi",
		kind: "sale",
		label: "Produce special",
		salePrice: 1.29,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Bunch kale."
	},
	{
		id: "wd-straw",
		productId: "strawberries",
		storeId: "winndixie",
		kind: "sale",
		label: "Weekly",
		salePrice: 2.49,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "1 lb strawberries on the A1A ad. Still behind Aldi."
	},
	{
		id: "wd-chicken",
		productId: "chicken-breast",
		storeId: "winndixie",
		kind: "sale",
		label: "Meat special",
		salePrice: 2.29,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Boneless breast per lb. Beats everyday Publix, loses to Walmart rollback."
	},
	{
		id: "wd-beer",
		productId: "beer-12",
		storeId: "winndixie",
		kind: "sale",
		label: "12-pack special",
		salePrice: 11.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Miller Lite 12-pack at the island Winn-Dixie."
	},
	{
		id: "cvs-toothpaste",
		productId: "toothpaste",
		storeId: "cvs",
		kind: "bogo",
		label: "BOGO",
		salePrice: 4.79,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Crest 5.8 oz BOGO. ExtraBucks after if you spend $20 on beauty."
	},
	{
		id: "cvs-shampoo",
		productId: "shampoo",
		storeId: "cvs",
		kind: "coupon",
		label: "$3 ExtraBucks",
		couponValue: 3,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "$3 ExtraBucks on Pantene 12.6 oz. Clip in the CVS app.",
		requiresClip: true
	},
	{
		id: "cvs-body",
		productId: "body-wash",
		storeId: "cvs",
		kind: "sale",
		label: "Weekly",
		salePrice: 5.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Dove body wash weekly."
	},
	{
		id: "wg-deo",
		productId: "deodorant",
		storeId: "walgreens",
		kind: "bogo",
		label: "BOGO",
		salePrice: 6.49,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Old Spice BOGO at the A1A Walgreens."
	},
	{
		id: "wg-toothpaste",
		productId: "toothpaste",
		storeId: "walgreens",
		kind: "bogo50",
		label: "BOGO 50% off",
		salePrice: 4.49,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Crest second tube half off."
	},
	{
		id: "wg-lotion",
		productId: "lotion",
		storeId: "walgreens",
		kind: "sale",
		label: "Rewards",
		salePrice: 4.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Lubriderm 16.9 oz with myWalgreens."
	},
	{
		id: "abc-vodka",
		productId: "vodka-175",
		storeId: "abc",
		kind: "sale",
		label: "Spirits special",
		salePrice: 22.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Tito's 1.75 L at ABC on A1A. Best nearby spirit price unless you drive to Costco."
	},
	{
		id: "abc-wine",
		productId: "wine-chard",
		storeId: "abc",
		kind: "sale",
		label: "Wine sale",
		salePrice: 8.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Kendall-Jackson Chardonnay 750 ml."
	},
	{
		id: "abc-seltzer",
		productId: "seltzer-12",
		storeId: "abc",
		kind: "sale",
		label: "12-pack",
		salePrice: 13.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "White Claw 12-pack."
	},
	{
		id: "costco-chicken",
		productId: "chicken-breast",
		storeId: "costco",
		kind: "sale",
		label: "Kirkland tray",
		salePrice: 2.49,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Kirkland boneless tray, per lb equivalent. 19 miles from 32080."
	},
	{
		id: "costco-paper",
		productId: "paper-towels",
		storeId: "costco",
		kind: "sale",
		label: "Kirkland 12-pack",
		salePrice: 5.89,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Warehouse pack priced per 6-roll equivalent. Storage required."
	},
	{
		id: "costco-vodka",
		productId: "vodka-175",
		storeId: "costco",
		kind: "sale",
		label: "Kirkland / Tito's",
		salePrice: 19.99,
		startsOn: WEEK_START,
		endsOn: WEEK_END,
		details: "Cheapest 1.75 in the market if you already have a membership and the drive."
	}
];
Object.fromEntries(PROMOTIONS.map((p) => [p.id, p]));
function isPromoActive(promo, on = /* @__PURE__ */ new Date()) {
	const t = on.toISOString().slice(0, 10);
	return t >= promo.startsOn && t <= promo.endsOn;
}
var STORE_KIND_LABEL = {
	grocery: "Grocery",
	pharmacy: "Pharmacy",
	dollar: "Dollar",
	liquor: "Wine & spirits",
	convenience: "C-store",
	club: "Warehouse club"
};
var STORES = [
	{
		id: "publix",
		name: "Publix",
		short: "Publix",
		kind: "grocery",
		tagline: "The 32080 store is Anastasia Plaza — BOGO week is where the math flips.",
		hours: "Daily 7:00am–10:00pm · Liquors 9am–9pm (Sun 1–8pm)",
		miles: 1,
		zip: "32080",
		sells: "Full grocery, pharmacy, beer & wine, attached Publix Liquors for spirits",
		locations: [
			{
				name: "Anastasia Plaza",
				address: "1033 A1A Beach Blvd",
				city: "St. Augustine Beach",
				zip: "32080"
			},
			{
				name: "Publix Liquors",
				address: "1031 A1A Beach Blvd",
				city: "St. Augustine Beach",
				zip: "32080"
			},
			{
				name: "Cobblestone Village",
				address: "125 Jenkins St",
				city: "St. Augustine",
				zip: "32086"
			},
			{
				name: "US-1 South",
				address: "4255 US Highway 1 S",
				city: "St. Augustine",
				zip: "32086"
			},
			{
				name: "Shoppes at Mission Trace",
				address: "955 State Road 16",
				city: "St. Augustine",
				zip: "32084"
			}
		]
	},
	{
		id: "winndixie",
		name: "Winn-Dixie",
		short: "Winn-Dixie",
		kind: "grocery",
		tagline: "Right on A1A South — the other full grocer on the island, with a liquor store next door.",
		hours: "Daily 7:00am–10:00pm",
		miles: 3,
		zip: "32080",
		sells: "Full grocery, pharmacy, beer & wine, Winn-Dixie Liquor for spirits",
		locations: [
			{
				name: "A1A South",
				address: "3905 A1A S",
				city: "St. Augustine Beach",
				zip: "32080"
			},
			{
				name: "Winn-Dixie Liquor",
				address: "3907 A1A S",
				city: "St. Augustine Beach",
				zip: "32080"
			},
			{
				name: "Ponce South",
				address: "1010 S Ponce De Leon Blvd",
				city: "St. Augustine",
				zip: "32084"
			},
			{
				name: "Ponce North",
				address: "3551 N Ponce De Leon Blvd",
				city: "St. Augustine",
				zip: "32084"
			}
		]
	},
	{
		id: "aldi",
		name: "Aldi",
		short: "Aldi",
		kind: "grocery",
		tagline: "Produce and staples, lowest everyday prices — a short hop over the bridge.",
		hours: "Daily 8:30am–8:00pm (Blackford Way 9am–8pm)",
		miles: 7,
		zip: "32084",
		sells: "Grocery, produce, household, personal care, beer & wine. Bring a quarter for the cart.",
		locations: [{
			name: "US-1 South",
			address: "1773 US Hwy 1 S",
			city: "St. Augustine",
			zip: "32084"
		}, {
			name: "Shores Village",
			address: "181 Blackford Way",
			city: "St. Augustine",
			zip: "32086"
		}]
	},
	{
		id: "walmart",
		name: "Walmart Supercenter",
		short: "Walmart",
		kind: "grocery",
		tagline: "The one Supercenter in town — rollbacks on meat, dairy, household, and bulk.",
		hours: "Daily 6:00am–11:00pm",
		miles: 8,
		zip: "32086",
		sells: "Full grocery, pharmacy, household, personal care, beer & wine",
		locations: [{
			name: "US-1 Supercenter",
			address: "2355 US Highway 1 S",
			city: "St. Augustine",
			zip: "32086"
		}]
	},
	{
		id: "target",
		name: "Target",
		short: "Target",
		kind: "grocery",
		tagline: "Circle offers on grocery, household, and personal care.",
		hours: "Daily 8:00am–10:00pm",
		miles: 6,
		zip: "32084",
		sells: "Grocery, household, personal care, pharmacy, beer & wine",
		locations: [{
			name: "US-1 South",
			address: "1440 US Hwy 1 S",
			city: "St. Augustine",
			zip: "32084"
		}]
	},
	{
		id: "cvs",
		name: "CVS",
		short: "CVS",
		kind: "pharmacy",
		tagline: "Two on the island — ExtraBucks on soap, shampoo, and toothpaste.",
		hours: "Daily 8:00am–10:00pm (pharmacy hours shorter)",
		miles: 2,
		zip: "32080",
		sells: "Pharmacy, personal care, household, snacks, drinks, limited dairy",
		locations: [{
			name: "A1A South",
			address: "1920 A1A S",
			city: "St. Augustine Beach",
			zip: "32080"
		}, {
			name: "SR 312",
			address: "175 SR 312 W",
			city: "St. Augustine",
			zip: "32080"
		}]
	},
	{
		id: "walgreens",
		name: "Walgreens",
		short: "Walgreens",
		kind: "pharmacy",
		tagline: "On A1A South past Winn-Dixie — BOGOs on personal care beat grocery some weeks.",
		hours: "Daily 8:00am–10:00pm",
		miles: 3.5,
		zip: "32080",
		sells: "Pharmacy, personal care, household, snacks, drinks, limited dairy",
		locations: [{
			name: "A1A South",
			address: "3975 A1A S",
			city: "St. Augustine Beach",
			zip: "32080"
		}, {
			name: "US-1 South",
			address: "2075 US Hwy 1 S",
			city: "St. Augustine",
			zip: "32086"
		}]
	},
	{
		id: "dollargeneral",
		name: "Dollar General",
		short: "DG",
		kind: "dollar",
		tagline: "Two on Anastasia Island. Spices, soap, and pantry fillers without crossing the bridge.",
		hours: "Daily 8:00am–10:00pm",
		miles: 2,
		zip: "32080",
		sells: "Pantry, spices, personal care, household, snacks, drinks",
		locations: [{
			name: "A1A South",
			address: "1953 A1A S",
			city: "St. Augustine Beach",
			zip: "32080"
		}, {
			name: "Crescent Beach",
			address: "5575 A1A S Ste 105",
			city: "St. Augustine",
			zip: "32080"
		}]
	},
	{
		id: "dollartree",
		name: "Dollar Tree",
		short: "Dollar Tree",
		kind: "dollar",
		tagline: "Everything $1.25 — spices, soap, pasta, and party snacks. The big one is on US-1.",
		hours: "Daily 9:00am–9:00pm",
		miles: 8,
		zip: "32086",
		sells: "Spices, personal care, small pantry, household odds",
		locations: [{
			name: "US-1 South",
			address: "1938 US-1",
			city: "St. Augustine",
			zip: "32086"
		}, {
			name: "SR 16",
			address: "500 FL-16",
			city: "St. Augustine",
			zip: "32084"
		}]
	},
	{
		id: "abc",
		name: "ABC Fine Wine & Spirits",
		short: "ABC",
		kind: "liquor",
		tagline: "Best everyday spirits price on A1A — beer, wine, and the 1.75s.",
		hours: "Mon–Sat 9:00am–10:00pm · Sun 11:00am–8:00pm",
		miles: 1.5,
		zip: "32080",
		sells: "Beer, wine, liquor, mixers — Florida package store",
		locations: [{
			name: "A1A South",
			address: "1830 A1A S",
			city: "St. Augustine Beach",
			zip: "32080"
		}]
	},
	{
		id: "cstore",
		name: "7-Eleven / Circle K",
		short: "C-store",
		kind: "convenience",
		tagline: "Open when everything else is dark. Milk, beer, bread — you pay for being close.",
		hours: "Open 24 hours",
		miles: 1,
		zip: "32080",
		sells: "Drinks, beer & wine, snacks, milk, eggs, bread, emergency soap",
		locations: [{
			name: "7-Eleven A1A South",
			address: "2010 A1A S",
			city: "St. Augustine Beach",
			zip: "32080"
		}, {
			name: "Circle K Beach Blvd",
			address: "351 A1A Beach Blvd",
			city: "St. Augustine Beach",
			zip: "32080"
		}]
	},
	{
		id: "costco",
		name: "Costco",
		short: "Costco",
		kind: "club",
		tagline: "World Golf Village warehouse. Bulk wins on paper, detergent, and meat — 19 miles from the beach.",
		hours: "Mon–Fri 10:00am–8:30pm · Sat 9:30am–7:00pm · Sun 10:00am–6:00pm",
		miles: 19,
		far: true,
		membership: true,
		bulk: true,
		zip: "32092",
		sells: "Bulk grocery, household, personal care, Kirkland spirits, pharmacy, gas",
		locations: [{
			name: "St. Augustine warehouse",
			address: "215 World Commerce Pkwy",
			city: "St. Augustine",
			zip: "32092"
		}]
	},
	{
		id: "sams",
		name: "Sam's Club",
		short: "Sam's",
		kind: "club",
		tagline: "Nearest club is Jacksonville Beach Blvd — a haul from 32080. Worth it only on a bulk stock-up.",
		hours: "Mon–Sat 10:00am–8:00pm · Sun 10:00am–6:00pm",
		miles: 38,
		far: true,
		membership: true,
		bulk: true,
		zip: "32246",
		sells: "Bulk grocery, household, personal care, Member's Mark spirits",
		locations: [{
			name: "Jacksonville Beach Blvd",
			address: "10690 Beach Blvd",
			city: "Jacksonville",
			zip: "32246"
		}]
	}
];
var STORE_MAP = Object.fromEntries(STORES.map((s) => [s.id, s]));
var LOCALS = [
	{
		name: "Discount Groceries and More",
		kind: "Local grocer",
		address: "2185 A1A S",
		city: `St. Augustine Beach, ${MARKET_ZIP}`,
		note: "Independent discount grocer on the island. Not on the chain price book — still worth a look."
	},
	{
		name: "Hagan Ace Hardware of Anastasia",
		kind: "Hardware",
		address: "3033 A1A S",
		city: `St. Augustine, ${MARKET_ZIP}`,
		note: "Home supplies, cleaners, and outdoor — not food."
	},
	{
		name: "Family Dollar",
		kind: "Dollar",
		address: "2485 S US Highway 1",
		city: "St. Augustine, 32086",
		note: "Mainland dollar store. Island coverage is Dollar General."
	}
];
function compareStoreIds(ctx) {
	return STORE_IDS.filter((id) => {
		const store = STORE_MAP[id];
		if (store.kind === "convenience") return false;
		if (store.far && !ctx.includeFar) return false;
		return true;
	});
}
function overrideKey(storeId, productId) {
	return `${storeId}:${productId}`;
}
function regularPrice(productId, storeId) {
	const p = PRODUCT_MAP[productId];
	if (!p) return null;
	const n = p.regular[storeId];
	return typeof n === "number" ? n : null;
}
function activePromo(productId, storeId, ctx) {
	const now = ctx.now ?? /* @__PURE__ */ new Date();
	return PROMOTIONS.find((promo) => {
		if (promo.productId !== productId || promo.storeId !== storeId) return false;
		if (!isPromoActive(promo, now)) return false;
		if (promo.requiresClip && !ctx.clippedPromoIds.includes(promo.id)) return false;
		return true;
	});
}
function shelfPrice(productId, storeId, ctx) {
	const key = overrideKey(storeId, productId);
	if (key in ctx.overrides) return ctx.overrides[key];
	const promo = activePromo(productId, storeId, ctx);
	if (promo?.salePrice != null) return promo.salePrice;
	return regularPrice(productId, storeId);
}
function quoteLine(productId, storeId, qty, ctx) {
	const unit = shelfPrice(productId, storeId, ctx);
	const regular = regularPrice(productId, storeId);
	if (unit == null || regular == null || qty <= 0) return null;
	const promo = activePromo(productId, storeId, ctx);
	let cost = unit * qty;
	let receivedQty = qty;
	let note = "";
	if (promo?.kind === "bogo") {
		const paid = Math.ceil(qty / 2);
		receivedQty = paid * 2;
		cost = paid * unit;
		note = qty % 2 === 1 ? "BOGO — take the free extra" : "BOGO";
	} else if (promo?.kind === "bogo50") {
		const pairs = Math.floor(qty / 2);
		const rem = qty % 2;
		cost = pairs * (unit + unit * .5) + rem * unit;
		note = "BOGO 50% off";
	} else if (promo?.kind === "coupon" && promo.couponValue) {
		const times = promo.minQty ? Math.floor(qty / promo.minQty) : 1;
		cost = Math.max(0, unit * qty - promo.couponValue * times);
		note = `${promo.label} applied`;
	} else if (promo?.couponValue) {
		cost = Math.max(0, unit * qty - promo.couponValue);
		note = `${promo.label} applied`;
	} else if (promo?.minQty && qty < promo.minQty) {
		cost = (regularPrice(productId, storeId) ?? unit) * qty;
		note = `Need ${promo.minQty}+ for ${promo.label}`;
	} else if (promo) note = promo.label;
	const saved = Math.max(0, regular * qty - cost);
	return {
		productId,
		storeId,
		qty,
		unitPrice: unit,
		cost,
		receivedQty,
		regular,
		saved,
		promo,
		note
	};
}
function cheapestStore(productId, qty, ctx) {
	let best = null;
	for (const storeId of compareStoreIds(ctx)) {
		const quote = quoteLine(productId, storeId, qty, ctx);
		if (!quote) continue;
		if (!best || quote.cost < best.quote.cost - 1e-4) best = {
			storeId,
			quote
		};
	}
	return best;
}
function allQuotes(productId, qty, ctx) {
	return STORE_IDS.map((storeId) => quoteLine(productId, storeId, qty, ctx)).filter((q) => q != null);
}
function winCounts(ctx) {
	const counts = Object.fromEntries(STORE_IDS.map((id) => [id, 0]));
	for (const product of CATALOG) {
		const best = cheapestStore(product.id, 1, ctx);
		if (best) counts[best.storeId] += 1;
	}
	return counts;
}
function withPromoClipped(ctx, promoId) {
	if (ctx.clippedPromoIds.includes(promoId)) return ctx;
	return {
		...ctx,
		clippedPromoIds: [...ctx.clippedPromoIds, promoId]
	};
}
function dealQty(promo) {
	if (promo.kind === "bogo" || promo.kind === "bogo50") return 2;
	return Math.max(1, promo.minQty ?? 1);
}
function dealComparison(promo, ctx) {
	const qty = dealQty(promo);
	const preview = withPromoClipped(ctx, promo.id);
	const self = quoteLine(promo.productId, promo.storeId, qty, preview);
	let nextBest = null;
	for (const storeId of compareStoreIds(ctx)) {
		if (storeId === promo.storeId) continue;
		const q = quoteLine(promo.productId, storeId, qty, ctx);
		if (!q) continue;
		if (!nextBest || q.cost < nextBest.cost) nextBest = q;
	}
	const beats = !!(self && nextBest && self.cost + .004 < nextBest.cost);
	const saveVsNext = self && nextBest ? Math.max(0, nextBest.cost - self.cost) : 0;
	return {
		self,
		nextBest,
		beats,
		saveVsNext
	};
}
function hashId(s) {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
	return Math.abs(h);
}
function priceHistory(productId, storeId, ctx) {
	const regular = regularPrice(productId, storeId);
	if (regular == null) return [];
	const jitter = hashId(`${productId}:${storeId}`) % 9 / 100;
	const current = shelfPrice(productId, storeId, ctx) ?? regular;
	return [
		"Aug 13",
		"Aug 20",
		"Aug 27",
		"Sep 3"
	].map((week, i) => {
		if (i === 3) return {
			week,
			price: current
		};
		const wave = 1 + (i % 2 === 0 ? 1 : -1) * jitter + (3 - i) * .012;
		return {
			week,
			price: Math.round(regular * wave * 100) / 100
		};
	});
}
function nid(prefix) {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
var initialClipped = [
	"tgt-avocado-circle",
	"tgt-yogurt-dotw",
	"tgt-cheerios-coupon",
	"tgt-laundry"
];
var useGroceryStore = create()(persist((set, get) => ({
	overrides: {},
	logs: [],
	inventory: SEED_INVENTORY,
	list: SEED_LIST,
	clippedPromoIds: initialClipped,
	includeFar: false,
	setIncludeFar: (v) => set({ includeFar: v }),
	lastStoreId: "publix",
	setLastStoreId: (id) => set({ lastStoreId: id }),
	staples: SEED_STAPLES,
	toggleStaple: (productId) => {
		set({ staples: get().staples.includes(productId) ? get().staples.filter((id) => id !== productId) : [...get().staples, productId] });
	},
	addMissingStaples: () => {
		const list = get().list;
		const inv = get().inventory;
		let added = 0;
		for (const productId of get().staples) {
			if (list.some((i) => i.productId === productId && !i.checked)) continue;
			const stock = inv.find((i) => i.productId === productId);
			if (stock && stock.qty > stock.lowAt) continue;
			get().addToList(productId, 1);
			added += 1;
		}
		return added;
	},
	watched: SEED_WATCHED,
	toggleWatched: (productId) => {
		set({ watched: get().watched.includes(productId) ? get().watched.filter((id) => id !== productId) : [...get().watched, productId] });
	},
	budget: 85,
	setBudget: (n) => set({ budget: Math.max(0, n) }),
	logPrices: (entries) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const next = { ...get().overrides };
		const logs = [...get().logs];
		for (const e of entries) {
			next[overrideKey(e.storeId, e.productId)] = e.price;
			logs.unshift({
				id: nid("log"),
				productId: e.productId,
				storeId: e.storeId,
				price: e.price,
				observedAt: now,
				note: e.note
			});
		}
		set({
			overrides: next,
			logs: logs.slice(0, 400)
		});
	},
	clearOverride: (storeId, productId) => {
		const next = { ...get().overrides };
		delete next[overrideKey(storeId, productId)];
		set({ overrides: next });
	},
	clipPromo: (id) => {
		if (get().clippedPromoIds.includes(id)) return;
		set({ clippedPromoIds: [...get().clippedPromoIds, id] });
	},
	unclipPromo: (id) => {
		set({ clippedPromoIds: get().clippedPromoIds.filter((x) => x !== id) });
	},
	addToList: (productId, qty = 1, store = "cheapest") => {
		const existing = get().list.find((i) => i.productId === productId && !i.checked);
		if (existing) {
			set({ list: get().list.map((i) => i.id === existing.id ? {
				...i,
				qty: i.qty + qty
			} : i) });
			return;
		}
		set({ list: [...get().list, {
			id: nid("li"),
			productId,
			qty,
			preferredStore: store,
			checked: false
		}] });
	},
	blendIntoList: (items, mode) => {
		const merged = /* @__PURE__ */ new Map();
		for (const item of items) merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.qty);
		if (mode === "replace") {
			set({ list: [...get().list.filter((i) => i.checked), ...[...merged.entries()].map(([productId, qty]) => ({
				id: nid("li"),
				productId,
				qty,
				preferredStore: "cheapest",
				checked: false
			}))] });
			return;
		}
		for (const [productId, qty] of merged) get().addToList(productId, qty);
	},
	updateListItem: (id, patch) => {
		set({ list: get().list.map((i) => i.id === id ? {
			...i,
			...patch
		} : i) });
	},
	removeListItem: (id) => {
		set({ list: get().list.filter((i) => i.id !== id) });
	},
	toggleChecked: (id) => {
		set({ list: get().list.map((i) => i.id === id ? {
			...i,
			checked: !i.checked
		} : i) });
	},
	clearChecked: () => {
		set({ list: get().list.filter((i) => !i.checked) });
	},
	addInventory: (item) => {
		set({ inventory: [...get().inventory, {
			...item,
			id: nid("inv")
		}] });
	},
	updateInventory: (id, patch) => {
		set({ inventory: get().inventory.map((i) => i.id === id ? {
			...i,
			...patch
		} : i) });
	},
	removeInventory: (id) => {
		set({ inventory: get().inventory.filter((i) => i.id !== id) });
	},
	restockFromList: () => {
		const checked = get().list.filter((i) => i.checked);
		const inv = [...get().inventory];
		for (const item of checked) {
			const existing = inv.find((x) => x.productId === item.productId);
			if (existing) existing.qty += item.qty;
			else inv.push({
				id: nid("inv"),
				productId: item.productId,
				qty: item.qty,
				location: "pantry",
				lowAt: 1
			});
		}
		set({
			inventory: inv,
			list: get().list.filter((i) => !i.checked)
		});
	},
	resetDemo: () => {
		set({
			overrides: {},
			logs: [],
			inventory: SEED_INVENTORY,
			list: SEED_LIST,
			clippedPromoIds: initialClipped,
			includeFar: false,
			lastStoreId: "publix",
			staples: SEED_STAPLES,
			watched: SEED_WATCHED,
			budget: 85
		});
	}
}), {
	name: "aisle-scout-v1",
	skipHydration: true,
	merge: (persisted, current) => {
		const p = persisted ?? {};
		return {
			...current,
			...p,
			lastStoreId: p.lastStoreId ?? current.lastStoreId,
			staples: p.staples ?? current.staples,
			watched: p.watched ?? current.watched,
			budget: p.budget ?? current.budget
		};
	}
}));
function rehydrateGrocery() {
	useGroceryStore.persist.rehydrate();
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var NAV = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/deals",
		label: "Deals",
		icon: Ticket
	},
	{
		to: "/list",
		label: "List",
		icon: ListChecks
	},
	{
		to: "/scan",
		label: "Scan",
		icon: ScanBarcode
	},
	{
		to: "/pantry",
		label: "Pantry",
		icon: Warehouse
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const listCount = useGroceryStore((s) => s.list.filter((i) => !i.checked).length);
	(0, import_react.useEffect)(() => {
		rehydrateGrocery();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-card px-4 py-6 lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-xl font-semibold tracking-tight",
							children: "Aisle Scout"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								MARKET_ZIP,
								" · ",
								WEEK_LABEL
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-8 flex flex-1 flex-col gap-1",
						children: NAV.map((item) => {
							const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors duration-150", active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
									item.label,
									item.to === "/list" && listCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground tabular-nums",
										children: listCount
									}) : null
								]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/prices",
						className: "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table2, { className: "size-4" }), "Prices"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/stores",
						className: "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), "Stores"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/log",
						className: "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanBarcode, { className: "size-4" }), "Log a trip"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-56",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur-sm lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-display text-lg font-semibold tracking-tight",
						children: "Aisle Scout"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/stores",
							className: "inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), "Stores"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/prices",
							className: "inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table2, { className: "size-4" }), "Prices"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full max-w-5xl px-4 pb-28 pt-5 lg:px-8 lg:pb-12 lg:pt-8",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-5",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-primary" : "text-muted-foreground"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }),
								item.label,
								item.to === "/list" && listCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-[18%] top-1.5 size-1.5 rounded-full bg-primary" }) : null
							]
						}) }, item.to);
					})
				})
			})
		]
	});
}
function Toaster$1(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "light",
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast bg-card text-card-foreground border-border",
			description: "text-muted-foreground"
		} },
		...props
	});
}
var styles_default = "/assets/styles-CIyismc6.css";
var APP_NAME = "Aisle Scout";
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Scan shelf tags and compare grocery, pharmacy, dollar, liquor, and club prices for 32080 St. Augustine Beach."
			},
			{
				name: "theme-color",
				content: "#2f5540"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$7 = () => import("./routes-DvZAEbqm.mjs");
var Route$7 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./deals-CER4WUF0.mjs");
var Route$6 = createFileRoute("/deals")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: () => ({ meta: [{ title: "Deals · Aisle Scout" }] })
});
var $$splitComponentImporter$5 = () => import("./list-DwAHqZ8S.mjs");
var Route$5 = createFileRoute("/list")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "List · Aisle Scout" }] })
});
var $$splitComponentImporter$4 = () => import("./log-cuBgdLp_.mjs");
var Route$4 = createFileRoute("/log")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Log prices · Aisle Scout" }] })
});
var $$splitComponentImporter$3 = () => import("./pantry-DejwoWYb.mjs");
var Route$3 = createFileRoute("/pantry")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "Pantry · Aisle Scout" }] })
});
var $$splitComponentImporter$2 = () => import("./prices-CZsgvYxu.mjs");
var Route$2 = createFileRoute("/prices")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Prices · Aisle Scout" }] })
});
var $$splitComponentImporter$1 = () => import("./scan-DcahzXT9.mjs");
var Route$1 = createFileRoute("/scan")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	validateSearch: (s) => ({ store: typeof s.store === "string" ? s.store : void 0 }),
	head: () => ({ meta: [{ title: "Scan · Aisle Scout" }] })
});
var $$splitComponentImporter = () => import("./stores-CW9WDJ5K.mjs");
var Route = createFileRoute("/stores")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Stores · Aisle Scout" }] })
});
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	DealsRoute: Route$6.update({
		id: "/deals",
		path: "/deals",
		getParentRoute: () => Route$8
	}),
	ListRoute: Route$5.update({
		id: "/list",
		path: "/list",
		getParentRoute: () => Route$8
	}),
	LogRoute: Route$4.update({
		id: "/log",
		path: "/log",
		getParentRoute: () => Route$8
	}),
	PantryRoute: Route$3.update({
		id: "/pantry",
		path: "/pantry",
		getParentRoute: () => Route$8
	}),
	PricesRoute: Route$2.update({
		id: "/prices",
		path: "/prices",
		getParentRoute: () => Route$8
	}),
	ScanRoute: Route$1.update({
		id: "/scan",
		path: "/scan",
		getParentRoute: () => Route$8
	}),
	StoresRoute: Route.update({
		id: "/stores",
		path: "/stores",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { MARKET_ZIP as A, WEEK_LABEL as C, CATEGORIES as D, PRODUCT_MAP as E, STORE_KINDS as M, LOCATIONS as O, CATEGORY_LABEL as T, STORES as _, allQuotes as a, dealComparison as c, priceHistory as d, quoteLine as f, LOCALS as g, winCounts as h, useGroceryStore as i, STORE_IDS as j, MARKET_CITY as k, hashId as l, shelfPrice as m, Route$1 as n, cheapestStore as o, regularPrice as p, cn as r, compareStoreIds as s, router_exports as t, overrideKey as u, STORE_KIND_LABEL as v, CATALOG as w, PROMOTIONS as x, STORE_MAP as y };
