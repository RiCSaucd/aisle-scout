import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as ScanBarcode, d as Minus, i as Trash2, l as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as PRODUCT_MAP, i as useGroceryStore, j as STORE_IDS, o as cheapestStore, r as cn, w as CATALOG, y as STORE_MAP } from "./router-C-tyNfJu.mjs";
import { a as formatMoney, i as StoreMark, t as Badge } from "./store-mark-DPi0u4Bz.mjs";
import { n as Input, r as usePriceContext, t as Button } from "./input-09shE_px.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-gOPQnf4z.mjs";
import { n as Label } from "./barcode-mark-D13A3TzG.mjs";
import { t as ProductSheet } from "./product-sheet-BGDwcXNE.mjs";
import { t as allPlans } from "./optimizer-DuUrk5E5.mjs";
import { t as ProductSearch } from "./product-search-BuTtYMzv.mjs";
import { t as Checkbox } from "./checkbox-OVQMIwk8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CjZaosCi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/list-DwAHqZ8S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ALIAS_BY_LENGTH = [...[
	["chicken broth", "chicken-broth"],
	["chicken breast", "chicken-breast"],
	["rotisserie chicken", "rotisserie"],
	["ground turkey", "ground-turkey"],
	["ground beef", "ground-beef"],
	["peanut butter", "peanut-butter"],
	["pasta sauce", "marinara"],
	["spaghetti sauce", "marinara"],
	["tomato sauce", "marinara"],
	["toilet paper", "toilet-paper"],
	["paper towels", "paper-towels"],
	["paper towel", "paper-towels"],
	["laundry detergent", "detergent"],
	["dish soap", "dish-soap"],
	["trash bags", "trash-bags"],
	["almond milk", "almond-milk"],
	["whole milk", "whole-milk"],
	["2% milk", "2pct-milk"],
	["2 percent milk", "2pct-milk"],
	["greek yogurt", "greek-yogurt"],
	["cream cheese", "cream-cheese"],
	["cottage cheese", "cottage-cheese"],
	["string cheese", "string-cheese"],
	["sour cream", "sour-cream"],
	["half and half", "half-half"],
	["half & half", "half-half"],
	["olive oil", "olive-oil"],
	["orange juice", "oj"],
	["coca cola", "coke-12"],
	["coca-cola", "coke-12"],
	["sparkling water", "sparkling"],
	["bottled water", "water-24"],
	["sweet tea", "sweet-tea"],
	["hot dogs", "hot-dogs"],
	["deli turkey", "deli-turkey"],
	["pork chops", "pork-chops"],
	["wheat bread", "wheat-bread"],
	["white bread", "white-bread"],
	["hamburger buns", "hamburger-buns"],
	["frozen pizza", "frozen-pizza"],
	["ice cream", "ice-cream"],
	["frozen berries", "frozen-berries"],
	["mixed berries", "frozen-berries"],
	["baby spinach", "spinach"],
	["bell peppers", "bell-peppers"],
	["bell pepper", "bell-peppers"],
	["grape tomatoes", "grape-tomatoes"],
	["roma tomatoes", "roma-tomatoes"],
	["sweet potatoes", "sweet-potatoes"],
	["red onions", "red-onions"],
	["yellow onions", "yellow-onions"],
	["green onions", "green-onions"],
	["black beans", "black-beans"],
	["potato chips", "chips"],
	["chicken nuggets", "nuggets"],
	["milk", "whole-milk"],
	["eggs", "eggs"],
	["egg", "eggs"],
	["chicken", "chicken-breast"],
	["beef", "ground-beef"],
	["hamburger", "ground-beef"],
	["turkey", "deli-turkey"],
	["bacon", "bacon"],
	["pasta", "spaghetti"],
	["spaghetti", "spaghetti"],
	["sauce", "marinara"],
	["marinara", "marinara"],
	["prego", "marinara"],
	["tp", "toilet-paper"],
	["tide", "detergent"],
	["laundry", "detergent"],
	["detergent", "detergent"],
	["bounty", "paper-towels"],
	["charmin", "toilet-paper"],
	["dawn", "dish-soap"],
	["coke", "coke-12"],
	["soda", "coke-12"],
	["oj", "oj"],
	["bread", "white-bread"],
	["yogurt", "greek-yogurt"],
	["chobani", "greek-yogurt"],
	["avocado", "avocados"],
	["avocados", "avocados"],
	["tomato", "roma-tomatoes"],
	["tomatoes", "roma-tomatoes"],
	["lettuce", "iceberg"],
	["apples", "gala-apples"],
	["potatoes", "russets"],
	["onion", "yellow-onions"],
	["onions", "yellow-onions"],
	["pb", "peanut-butter"],
	["jelly", "grape-jelly"],
	["rice", "white-rice"],
	["oats", "oatmeal"],
	["oatmeal", "oatmeal"],
	["oil", "olive-oil"],
	["coffee", "coffee"],
	["folgers", "coffee"],
	["cheerios", "cheerios"],
	["cereal", "cheerios"],
	["tuna", "tuna"],
	["beans", "black-beans"],
	["broth", "chicken-broth"],
	["chips", "chips"],
	["lays", "chips"],
	["salsa", "salsa"],
	["ketchup", "ketchup"],
	["heinz", "ketchup"],
	["mayo", "mayo"],
	["mayonnaise", "mayo"],
	["flour", "flour"],
	["sugar", "sugar"],
	["tortillas", "tortillas"],
	["buns", "hamburger-buns"],
	["bagels", "bagels"],
	["pizza", "frozen-pizza"],
	["nuggets", "nuggets"],
	["water", "water-24"],
	["lacroix", "sparkling"],
	["tea", "sweet-tea"],
	["cheese", "cheddar"],
	["butter", "butter"],
	["shrimp", "shrimp"],
	["salmon", "salmon"],
	["bananas", "bananas"],
	["banana", "bananas"],
	["strawberries", "strawberries"],
	["berries", "strawberries"],
	["shampoo", "shampoo"],
	["conditioner", "conditioner"],
	["body wash", "body-wash"],
	["dove soap", "bar-soap"],
	["soap", "bar-soap"],
	["toothpaste", "toothpaste"],
	["crest", "toothpaste"],
	["deodorant", "deodorant"],
	["lotion", "lotion"],
	["razors", "razors"],
	["salt", "salt"],
	["black pepper", "black-pepper"],
	["pepper", "black-pepper"],
	["garlic powder", "garlic-powder"],
	["italian seasoning", "italian-seasoning"],
	["cinnamon", "cinnamon"],
	["taco seasoning", "taco-seasoning"],
	["beer", "beer-12"],
	["miller", "beer-12"],
	["white claw", "seltzer-12"],
	["seltzer", "seltzer-12"],
	["wine", "wine-chard"],
	["chardonnay", "wine-chard"],
	["vodka", "vodka-175"],
	["titos", "vodka-175"],
	["bourbon", "whiskey-175"],
	["whiskey", "whiskey-175"]
]].sort((a, b) => b[0].length - a[0].length);
var STOP = /* @__PURE__ */ new Set([
	"a",
	"an",
	"the",
	"some",
	"of",
	"and",
	"or",
	"for",
	"with",
	"fresh",
	"organic",
	"need",
	"get",
	"buy",
	"grab",
	"please"
]);
function norm(s) {
	return s.toLowerCase().normalize("NFKD").replace(/[^\w\s%+]/g, " ").replace(/\s+/g, " ").trim();
}
function tokens(s) {
	return norm(s).split(" ").filter((t) => t.length > 1 && !STOP.has(t));
}
function splitListText(text) {
	const lines = text.split(/\n|;/).map((s) => s.replace(/^[-*•]+\s+/, "").replace(/^\d+[.)]\s+/, "").trim()).filter(Boolean);
	if (lines.length === 1 && (lines[0].match(/,/g) ?? []).length >= 2) return lines[0].split(",").map((s) => s.trim()).filter(Boolean);
	return lines;
}
function parseLine(raw) {
	let rest = raw.trim().replace(/^[-*•]+\s+/, "").replace(/^\d+[.)]\s+/, "");
	let qty = 1;
	const leading = rest.match(/^(\d+(?:\.\d+)?)\s*(x|×)?\s+/i);
	if (leading) {
		qty = Number(leading[1]);
		rest = rest.slice(leading[0].length);
	} else if (/^dozens?\b/i.test(rest)) rest = rest.replace(/^dozens?\s+/i, "");
	rest = rest.replace(/^(lbs?|pounds?|oz|ounces?|gallons?|gals?|bags?|packs?|bunches?|loaves|loaf|heads?)\s+(of\s+)?/i, "");
	rest = rest.replace(/\s+(lbs?|pounds?|oz|ounces?|gallons?|gals?|bags?|packs?|dozen|dozens)$/i, "");
	return {
		raw,
		qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
		query: rest.trim()
	};
}
function haystack(p) {
	return norm(`${p.id.replace(/-/g, " ")} ${p.name} ${p.brand ?? ""}`);
}
function scoreProduct(query, p) {
	const q = norm(query);
	if (!q) return 0;
	const hay = haystack(p);
	if (hay === q || norm(p.name) === q || p.id === q.replace(/\s+/g, "-")) return 1;
	if (hay.startsWith(q) || norm(p.name).startsWith(q)) return .92;
	if (new RegExp(`(?:^| )${q}(?:$| )`).test(hay)) return .88;
	const qt = tokens(q);
	const ht = new Set(tokens(hay));
	if (qt.length === 0) return 0;
	return qt.filter((t) => ht.has(t) || [...ht].some((h) => h.startsWith(t) || t.startsWith(h))).length / qt.length;
}
function aliasId(query) {
	const q = norm(query);
	for (const [alias, id] of ALIAS_BY_LENGTH) if (q === alias || q.startsWith(`${alias} `) || q.endsWith(` ${alias}`)) return id;
}
function matchLine(line) {
	const aliased = aliasId(line.query);
	const scored = CATALOG.map((p) => ({
		p,
		s: (aliased === p.id ? 1 : 0) * .15 + scoreProduct(line.query, p)
	})).sort((a, b) => b.s - a.s).slice(0, 4);
	const top = scored[0];
	const product = (top && top.s >= .55 ? top.p : null) ?? (aliased ? CATALOG.find((p) => p.id === aliased) ?? null : null);
	const alternatives = scored.filter((x) => x.s >= .45 && x.p.id !== product?.id).map((x) => x.p).slice(0, 3);
	return {
		raw: line.raw,
		qty: line.qty,
		query: line.query,
		product,
		score: product ? Math.max(top?.s ?? 0, aliased ? .95 : 0) : top?.s ?? 0,
		alternatives
	};
}
function blendList(text) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const raw of splitListText(text)) {
		const parsed = parseLine(raw);
		if (!parsed.query) continue;
		const match = matchLine(parsed);
		const key = match.product?.id ?? `raw:${norm(parsed.query)}`;
		if (seen.has(key) && match.product) {
			const existing = out.find((m) => m.product?.id === match.product?.id);
			if (existing) existing.qty += match.qty;
			continue;
		}
		seen.add(key);
		out.push(match);
	}
	return out;
}
var SAMPLE_LIST = `gallon of milk
dozen eggs
2 lb chicken breast
strawberries
bananas
spaghetti
pasta sauce
tide
toilet paper
coffee
bacon
paper towels`;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function pantryNoteFor(productId, qtyNeeded, inventory) {
	const item = inventory.find((i) => i.productId === productId);
	if (!item) return { stocked: false };
	if (!!(item.expiresOn && item.expiresOn <= "2026-09-10")) return {
		note: `In pantry · use by ${item.expiresOn}`,
		stocked: false
	};
	if (item.qty < qtyNeeded) return {
		note: `In pantry · ${item.qty} on hand`,
		stocked: false
	};
	if (item.qty <= item.lowAt) return {
		note: `In pantry · only ${item.qty} left`,
		stocked: false
	};
	return {
		note: `Already have ${item.qty}`,
		stocked: true
	};
}
function BlendPanel({ ctx }) {
	const inventory = useGroceryStore((s) => s.inventory);
	const blendIntoList = useGroceryStore((s) => s.blendIntoList);
	const [text, setText] = (0, import_react.useState)("");
	const [skipStocked, setSkipStocked] = (0, import_react.useState)(true);
	const [mode, setMode] = (0, import_react.useState)("replace");
	const [overrides, setOverrides] = (0, import_react.useState)({});
	const rows = (0, import_react.useMemo)(() => {
		return blendList(text).map((m, i) => {
			const extra = overrides[i] ?? {};
			const product = extra.product !== void 0 ? extra.product : m.product;
			const pantry = product ? pantryNoteFor(product.id, extra.qty ?? m.qty, inventory ?? []) : { stocked: false };
			const include = extra.include ?? (product ? !(skipStocked && pantry.stocked) : false);
			return {
				...m,
				...extra,
				product,
				include,
				pantryNote: pantry.note
			};
		});
	}, [
		text,
		inventory,
		skipStocked,
		overrides
	]);
	const selected = rows.filter((r) => r.include && r.product);
	const unmatched = rows.filter((r) => !r.product);
	function setRow(i, patch) {
		setOverrides((prev) => ({
			...prev,
			[i]: {
				...prev[i],
				...patch
			}
		}));
	}
	function commit() {
		if (selected.length === 0) {
			toast.error("Match at least one item, or paste a list first");
			return;
		}
		blendIntoList(selected.map((r) => ({
			productId: r.product.id,
			qty: r.qty
		})), mode);
		toast.success(mode === "replace" ? `Your list is ${selected.length} item${selected.length === 1 ? "" : "s"} — trip plan updated` : `Blended ${selected.length} item${selected.length === 1 ? "" : "s"} into the list`);
		setText("");
		setOverrides({});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "blend",
		className: "space-y-4 scroll-mt-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-medium",
				children: "Blend your list"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Paste what you actually need — a note, a text, a recipe dump. We match it to the St. Augustine book, skip a full pantry, and rebuild the trip around it."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: text,
				onChange: (e) => {
					setText(e.target.value);
					setOverrides({});
				},
				placeholder: "milk\neggs\nchicken\nstrawberries\ntide",
				"aria-label": "Paste or type your grocery list",
				className: "min-h-36"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => {
						setText(SAMPLE_LIST);
						setOverrides({});
					},
					children: "Try a sample list"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => {
						setText("");
						setOverrides({});
					},
					children: "Clear"
				})]
			}),
			rows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4 pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								selected.length,
								" going on the list",
								unmatched.length ? ` · ${unmatched.length} unmatched` : ""
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: skipStocked,
								onCheckedChange: (v) => setSkipStocked(v === true)
							}), "Skip a full pantry"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: rows.map((row, i) => {
							const best = row.product ? cheapestStore(row.product.id, row.qty, ctx) : null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-lg border border-border bg-background p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										className: "mt-1",
										checked: row.include,
										disabled: !row.product,
										onCheckedChange: (v) => setRow(i, { include: v === true }),
										"aria-label": `Include ${row.product?.name ?? row.raw}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													"You wrote “",
													row.raw,
													"”"
												]
											}),
											row.product ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-0.5 font-medium",
												children: [row.qty === 1 ? "" : `${row.qty} × `, row.product.name]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
												children: [best ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreMark, {
														storeId: best.storeId,
														size: "sm"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "tabular-nums",
														children: formatMoney(best.quote.cost)
													}),
													best.quote.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "deal",
														children: best.quote.note
													}) : null
												] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [STORE_MAP.aldi.short, " book"] }), row.pantryNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: row.pantryNote.startsWith("Already") ? "secondary" : "warn",
													children: row.pantryNote
												}) : null]
											})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-0.5 text-sm",
												children: ["No match in the book.", row.alternatives.length > 0 ? " Closest:" : ""]
											}),
											row.alternatives.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 flex flex-wrap gap-1.5",
												children: row.alternatives.map((alt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "h-9 rounded-full bg-secondary px-3 text-xs font-medium text-secondary-foreground hover:bg-muted",
													onClick: () => setRow(i, {
														product: alt,
														include: true,
														score: 1
													}),
													children: alt.name
												}, alt.id))
											}) : null
										]
									})]
								})
							}, `${row.raw}-${i}`);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: commit,
							disabled: selected.length === 0,
							children: mode === "replace" ? "Use this as my list" : "Add these to the list"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setMode(mode === "replace" ? "add" : "replace"),
							children: mode === "replace" ? "Or add on top" : "Or replace the list"
						})]
					})
				]
			}) }) : null
		]
	});
}
function TripPlanPicker({ plans, selected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-3",
		children: plans.map((plan, i) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(i),
				className: cn("rounded-xl border p-4 text-left shadow-[var(--shadow-card)] transition-[border-color,background-color] duration-150", i === selected ? "border-primary bg-best-fill/60" : "border-border bg-card hover:bg-muted/40"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
							children: i === 0 ? "Recommended" : plan.mode === "one-store" ? "One stop" : "Multi-stop"
						}), i === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "best",
							children: "Best"
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 font-display text-2xl font-medium tabular-nums",
						children: formatMoney(plan.total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-sm text-foreground",
						children: plan.label
					}),
					plan.vsMostExpensive > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-xs text-best",
						children: ["Saves ", formatMoney(plan.vsMostExpensive)]
					}) : null
				]
			}, `${plan.mode}-${plan.label}`);
		})
	});
}
function TripPlanDetail({ plan }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [plan.stops.map((stop) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2 text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreMark, { storeId: stop.storeId }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-normal text-muted-foreground",
					children: STORE_MAP[stop.storeId].locations[0]?.name
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium tabular-nums",
				children: formatMoney(stop.total)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "space-y-2",
			children: stop.items.map((item) => {
				const product = PRODUCT_MAP[item.productId];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: product?.name ?? item.productId
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [
							" ",
							"× ",
							item.qty,
							item.note ? ` · ${item.note}` : ""
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatMoney(item.cost)
					})]
				}, item.productId);
			})
		})] }, stop.storeId)), plan.receivedExtra > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				"BOGO extras on this run: ",
				plan.receivedExtra,
				" free units if you take them."
			]
		}) : null]
	});
}
function ListPage() {
	const ctx = usePriceContext();
	const list = useGroceryStore((s) => s.list);
	const addToList = useGroceryStore((s) => s.addToList);
	const updateListItem = useGroceryStore((s) => s.updateListItem);
	const removeListItem = useGroceryStore((s) => s.removeListItem);
	const toggleChecked = useGroceryStore((s) => s.toggleChecked);
	const clearChecked = useGroceryStore((s) => s.clearChecked);
	const restockFromList = useGroceryStore((s) => s.restockFromList);
	const includeFar = useGroceryStore((s) => s.includeFar);
	const setIncludeFar = useGroceryStore((s) => s.setIncludeFar);
	const lastStoreId = useGroceryStore((s) => s.lastStoreId);
	const setLastStoreId = useGroceryStore((s) => s.setLastStoreId);
	const addMissingStaples = useGroceryStore((s) => s.addMissingStaples);
	const budget = useGroceryStore((s) => s.budget);
	const setBudget = useGroceryStore((s) => s.setBudget);
	const [shopOnly, setShopOnly] = (0, import_react.useState)(false);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [planIndex, setPlanIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (window.location.hash !== "#blend") return;
		document.getElementById("blend")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, []);
	const plans = (0, import_react.useMemo)(() => allPlans(list, ctx), [list, ctx]);
	const selected = plans[Math.min(planIndex, Math.max(0, plans.length - 1))];
	const active = list.filter((i) => !i.checked);
	const checked = list.filter((i) => i.checked);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-medium tracking-tight",
						children: "Shopping list"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-muted-foreground",
						children: "Paste the list you already made, or add one item at a time. Scan in the aisle to check prices and check items off."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductSearch, {
						onPick: (id) => {
							addToList(id, 1);
							toast.success(`Added ${PRODUCT_MAP[id]?.name ?? "item"}`);
						},
						placeholder: "Add milk, strawberries, Tide…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/scan",
								search: { store: lastStoreId },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanBarcode, { className: "size-4" }),
									"Scan at ",
									STORE_MAP[lastStoreId].short
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								const n = addMissingStaples();
								toast.success(n === 0 ? "Staples are already on the list or in the pantry" : `Added ${n} staple${n === 1 ? "" : "s"}`);
							},
							children: "Add missing staples"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlendPanel, { ctx }),
			active.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
				children: "List is empty. Paste one above, search a staple, or open Deals and add a BOGO."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-medium",
						children: "Trip plan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: selected.vsMostExpensive > 0 ? `${formatMoney(selected.vsMostExpensive)} under full-price at the most expensive nearby store.` : "Prices are close this week."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: includeFar,
							onCheckedChange: (v) => setIncludeFar(v === true)
						}), "Include Costco (19 mi) and Sam’s (38 mi)"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
									children: "Shopping at"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: lastStoreId,
									onValueChange: (v) => {
										setLastStoreId(v);
										setShopOnly(true);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-11 w-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STORE_IDS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: id,
										children: [STORE_MAP[id].short, STORE_MAP[id].far ? ` · ${STORE_MAP[id].miles} mi` : ""]
									}, id)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex h-11 items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: shopOnly,
										onCheckedChange: (v) => setShopOnly(v === true)
									}), "Only this stop"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "budget",
							children: "Trip budget"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "budget",
							inputMode: "decimal",
							className: "mt-1.5 h-11 tabular-nums",
							value: budget || "",
							onChange: (e) => setBudget(Number(e.target.value) || 0),
							placeholder: "Off"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripPlanPicker, {
						plans,
						selected: Math.min(planIndex, plans.length - 1),
						onSelect: setPlanIndex
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripPlanDetail, { plan: selected }),
					budget > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: selected.total > budget ? "text-sm font-medium text-destructive" : "text-sm text-muted-foreground",
						children: selected.total > budget ? `${formatMoney(selected.total - budget)} over a ${formatMoney(budget)} budget.` : `${formatMoney(budget - selected.total)} left under ${formatMoney(budget)}.`
					}) : null
				]
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-medium",
					children: "Items"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: active.map((item) => {
						const product = PRODUCT_MAP[item.productId];
						const best = cheapestStore(item.productId, item.qty, ctx);
						return {
							item,
							product,
							best,
							assigned: item.preferredStore === "cheapest" ? best?.storeId : item.preferredStore
						};
					}).filter((row) => !shopOnly || row.assigned === lastStoreId).sort((a, b) => {
						return (a.assigned === lastStoreId ? 0 : 1) - (b.assigned === lastStoreId ? 0 : 1);
					}).map(({ item, product, best, assigned }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-card)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: item.checked,
								onCheckedChange: () => toggleChecked(item.id),
								className: "mt-1",
								"aria-label": `Check off ${product?.name}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-left font-medium",
										onClick: () => setOpenId(item.productId),
										children: product?.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: [
											product?.size,
											assigned ? ` · ${STORE_MAP[assigned].short}` : "",
											best ? ` · ${formatMoney(best.quote.cost)}` : "",
											best?.quote.note ? ` · ${best.quote.note}` : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center rounded-md border border-border",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon-sm",
														"aria-label": "Decrease quantity",
														onClick: () => updateListItem(item.id, { qty: Math.max(1, item.qty - 1) }),
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
														onClick: () => updateListItem(item.id, { qty: item.qty + 1 }),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: item.preferredStore,
												onValueChange: (v) => updateListItem(item.id, { preferredStore: v }),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-11 w-[11rem]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "cheapest",
													children: "Cheapest nearby"
												}), STORE_IDS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
													value: id,
													children: [STORE_MAP[id].short, STORE_MAP[id].far ? ` · ${STORE_MAP[id].miles} mi` : ""]
												}, id))] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												"aria-label": "Remove item",
												onClick: () => removeListItem(item.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
											})
										]
									})
								]
							})]
						})
					}, item.id))
				})]
			})] }),
			checked.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-medium",
							children: "Checked off"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: checked.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: checked.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: true,
								onCheckedChange: () => toggleChecked(item.id)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "line-through",
								children: PRODUCT_MAP[item.productId]?.name
							})]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								restockFromList();
								toast.success("Moved checked items into the pantry");
							},
							children: "Restock pantry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: clearChecked,
							children: "Clear checked"
						})]
					})
				]
			}) : null,
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
export { ListPage as component };
