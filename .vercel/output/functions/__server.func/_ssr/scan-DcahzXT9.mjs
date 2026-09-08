import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { S as Bell, _ as Delete, b as Camera, h as Keyboard, u as Pin, x as CameraOff, y as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as STORES, i as useGroceryStore, j as STORE_IDS, m as shelfPrice, n as Route$1, o as cheapestStore, p as regularPrice, r as cn, y as STORE_MAP } from "./router-C-tyNfJu.mjs";
import { a as formatMoney, i as StoreMark, t as Badge } from "./store-mark-DPi0u4Bz.mjs";
import { n as Input, r as usePriceContext, t as Button } from "./input-09shE_px.mjs";
import { n as CardContent, t as Card } from "./card-gOPQnf4z.mjs";
import { a as lookupUpc, i as SAMPLE_PRODUCTS, n as Label, o as upcFor, r as PriceGrid, t as BarcodeMark } from "./barcode-mark-D13A3TzG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-DcahzXT9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function scanVerdict(productId, storeId, scanned, ctx, logs) {
	const book = shelfPrice(productId, storeId, ctx) ?? regularPrice(productId, storeId);
	const best = cheapestStore(productId, 1, ctx);
	const last = logs.find((l) => l.productId === productId && l.storeId === storeId)?.price ?? null;
	const deltaBook = book != null ? Math.round((scanned - book) * 100) / 100 : null;
	const vsCheapest = best ? Math.round((scanned - best.quote.unitPrice) * 100) / 100 : null;
	const vsLast = last != null ? Math.round((scanned - last) * 100) / 100 : null;
	let label = "On the book";
	let tone = "neutral";
	let detail = "Shelf matches what we already have.";
	if (book == null) {
		label = "Not in this store's book";
		tone = "warn";
		detail = "This store may not carry it — log anyway if you saw it.";
	} else if (deltaBook != null && deltaBook <= -.1) {
		label = "Below the book";
		tone = "best";
		detail = `${formatDelta(-deltaBook)} cheaper than the listed price here. Log it.`;
	} else if (deltaBook != null && deltaBook >= .25) {
		label = "High vs the book";
		tone = "warn";
		detail = `${formatDelta(deltaBook)} more than we have listed. Double-check the tag.`;
	} else if (best && vsCheapest != null && vsCheapest >= .5 && best.storeId !== storeId) {
		label = "Cheaper nearby";
		tone = "warn";
		detail = `${formatDelta(vsCheapest)} more than ${STORE_MAP[best.storeId].short} at $${best.quote.unitPrice.toFixed(2)}.`;
	} else if (vsLast != null && vsLast <= -.15) {
		label = "New low here";
		tone = "best";
		detail = `Last time you logged ${last.toFixed(2)} at this store.`;
	} else if (vsLast != null && vsLast >= .25) {
		label = "Up since last trip";
		tone = "warn";
		detail = `You paid ${last.toFixed(2)} last time.`;
	}
	return {
		book,
		cheapest: best ? {
			storeId: best.storeId,
			price: best.quote.unitPrice
		} : null,
		lastPaid: last,
		deltaBook,
		vsCheapest,
		vsLast,
		label,
		tone,
		detail
	};
}
function formatDelta(n) {
	return `$${Math.abs(n).toFixed(2)}`;
}
function beep() {
	try {
		const ctx = new AudioContext();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.frequency.value = 880;
		osc.type = "square";
		gain.gain.value = .04;
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + .08);
		window.setTimeout(() => void ctx.close(), 200);
	} catch {}
}
function PriceScanner({ onHit }) {
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const [camera, setCamera] = (0, import_react.useState)("off");
	const [digits, setDigits] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const lastHit = (0, import_react.useRef)(0);
	const fire = (0, import_react.useCallback)((product, source) => {
		const now = Date.now();
		if (now - lastHit.current < 900) return;
		lastHit.current = now;
		beep();
		onHit(product, source);
	}, [onHit]);
	const stopCamera = (0, import_react.useCallback)(() => {
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		if (videoRef.current) videoRef.current.srcObject = null;
		setCamera("off");
	}, []);
	(0, import_react.useEffect)(() => () => stopCamera(), [stopCamera]);
	(0, import_react.useEffect)(() => {
		if (camera !== "live") return;
		const video = videoRef.current;
		if (!video) return;
		let cancelled = false;
		const DetectorCtor = window.BarcodeDetector;
		if (!DetectorCtor) {
			setError("This browser can't decode barcodes from video. Type the UPC or tap a sample.");
			return;
		}
		const detector = new DetectorCtor({ formats: [
			"ean_13",
			"ean_8",
			"upc_a",
			"upc_e",
			"code_128"
		] });
		let timer = 0;
		const tick = async () => {
			if (cancelled || video.readyState < 2) {
				timer = window.setTimeout(() => void tick(), 240);
				return;
			}
			try {
				const raw = (await detector.detect(video))[0]?.rawValue;
				if (raw) {
					const product = lookupUpc(raw);
					if (product) fire(product, "camera");
					else setError(`No book match for ${raw.replace(/\D/g, "")}`);
				}
			} catch {}
			timer = window.setTimeout(() => void tick(), 240);
		};
		tick();
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [camera, fire]);
	async function startCamera() {
		setError(null);
		if (!navigator.mediaDevices?.getUserMedia) {
			setCamera("blocked");
			setError("Camera isn't available here. Type a UPC or tap a sample barcode.");
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: { ideal: "environment" } },
				audio: false
			});
			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
			}
			setCamera("live");
		} catch {
			setCamera("blocked");
			setError("Camera permission was denied. Type the UPC under the barcode, or tap a sample.");
		}
	}
	function submitDigits() {
		const product = lookupUpc(digits);
		if (!product) {
			setError("Nothing in the 32080 book for that code. Try the last 4 digits or a sample.");
			return;
		}
		setError(null);
		setDigits("");
		fire(product, "keypad");
	}
	function pad(d) {
		if (d === "del") {
			setDigits((v) => v.slice(0, -1));
			return;
		}
		setDigits((v) => (v + d).slice(0, 13));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
					children: "Sample shelf — tap to scan"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
					children: SAMPLE_PRODUCTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => fire(p, "sample"),
						className: "h-full w-full rounded-xl border border-border bg-card p-3 text-left shadow-[var(--shadow-card)] transition-colors duration-150 hover:bg-muted/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: p.brand ?? p.size
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeMark, {
								productId: p.id,
								compact: true,
								className: "mt-2"
							})
						]
					}) }, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[4/3] bg-foreground/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						className: cn("size-full object-cover", camera === "live" ? "opacity-100" : "opacity-0"),
						playsInline: true,
						muted: true,
						autoPlay: true
					}), camera !== "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-background",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "size-8 opacity-80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-xs text-sm leading-relaxed",
							children: "Point at a shelf tag or the UPC on the package. If the camera isn't available here, tap a sample barcode above — same math."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-10 top-1/2 h-16 -translate-y-1/2 rounded-md border-2 border-background/80" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 p-3",
					children: camera === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "flex-1",
						onClick: stopCamera,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "size-4" }), "Stop camera"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "flex-1",
						onClick: () => void startCamera(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), "Open camera"]
					})
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg bg-warn-fill px-3 py-2 text-sm text-warn",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: "Type a UPC"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							pattern: "[0-9]*",
							value: digits,
							onChange: (e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 13)),
							onKeyDown: (e) => {
								if (e.key === "Enter") submitDigits();
							},
							placeholder: "Full code or last 4",
							"aria-label": "UPC",
							className: "h-12 font-mono tracking-widest"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: submitDigits,
							"aria-label": "Look up UPC",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "size-4" }), "Look up"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-1.5 sm:hidden",
						children: [
							"1",
							"2",
							"3",
							"4",
							"5",
							"6",
							"7",
							"8",
							"9",
							"0",
							"del"
						].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: d === "del" ? "outline" : "secondary",
							className: "h-12",
							onClick: () => pad(d),
							children: d === "del" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Delete, { className: "size-4" }) : d
						}, d))
					})
				]
			})
		]
	});
}
function isStoreId(v) {
	return !!v && STORE_IDS.includes(v);
}
function ScanPage() {
	const search = Route$1.useSearch();
	const ctx = usePriceContext();
	const lastStoreId = useGroceryStore((s) => s.lastStoreId);
	const setLastStoreId = useGroceryStore((s) => s.setLastStoreId);
	const logPrices = useGroceryStore((s) => s.logPrices);
	const addToList = useGroceryStore((s) => s.addToList);
	const list = useGroceryStore((s) => s.list);
	const toggleChecked = useGroceryStore((s) => s.toggleChecked);
	const logs = useGroceryStore((s) => s.logs);
	const watched = useGroceryStore((s) => s.watched);
	const staples = useGroceryStore((s) => s.staples);
	const toggleWatched = useGroceryStore((s) => s.toggleWatched);
	const toggleStaple = useGroceryStore((s) => s.toggleStaple);
	const storeId = lastStoreId;
	const [hit, setHit] = (0, import_react.useState)(null);
	const [price, setPrice] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (isStoreId(search.store) && search.store !== lastStoreId) setLastStoreId(search.store);
	}, [
		search.store,
		lastStoreId,
		setLastStoreId
	]);
	(0, import_react.useEffect)(() => {
		if (!hit) return;
		document.getElementById("scan-hit")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, [hit]);
	const book = hit ? shelfPrice(hit.id, storeId, ctx) ?? regularPrice(hit.id, storeId) : null;
	(0, import_react.useEffect)(() => {
		if (!hit) return;
		const listed = shelfPrice(hit.id, storeId, ctx) ?? regularPrice(hit.id, storeId);
		setPrice(listed != null ? listed.toFixed(2) : "");
	}, [
		hit,
		storeId,
		ctx
	]);
	const scanned = Number(price);
	const verdict = (0, import_react.useMemo)(() => {
		if (!hit || !Number.isFinite(scanned) || scanned <= 0) return null;
		return scanVerdict(hit.id, storeId, scanned, ctx, logs);
	}, [
		hit,
		storeId,
		scanned,
		ctx,
		logs
	]);
	const onList = hit ? list.find((i) => i.productId === hit.id && !i.checked) : void 0;
	const best = hit ? cheapestStore(hit.id, 1, ctx) : null;
	function logCurrent() {
		if (!hit || !Number.isFinite(scanned) || scanned <= 0) {
			toast.error("Enter the shelf price");
			return;
		}
		logPrices([{
			productId: hit.id,
			storeId,
			price: scanned,
			note: "scanned"
		}]);
		toast.success(`Logged ${hit.name} at ${STORE_MAP[storeId].short}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: "In the aisle"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-medium tracking-tight",
						children: "Price scanner"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-muted-foreground",
						children: "Scan the UPC, type the digits, or tap a sample barcode. We match the 32080 book, compare the tag to nearby stores, and log what you actually paid."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground",
					children: "I'm at"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: STORES.map((store) => {
						const active = store.id === storeId;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setLastStoreId(store.id),
							className: cn("h-11 rounded-full px-4 text-sm font-medium", active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"),
							children: [store.short, store.far ? ` · ${store.miles} mi` : ""]
						}, store.id);
					})
				})]
			}),
			hit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				id: "scan-hit",
				className: verdict?.tone === "best" ? "border-primary/30 bg-best-fill/40" : void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4 pt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-medium",
								children: hit.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									hit.brand ? `${hit.brand} · ` : "",
									hit.size,
									" · ",
									upcFor(hit.id)
								]
							})] }), verdict ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: verdict.tone === "best" ? "best" : verdict.tone === "warn" ? "warn" : "secondary",
								children: verdict.label
							}) : null]
						}),
						verdict ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: verdict.detail
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Book here",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "tabular-nums",
									children: book != null ? formatMoney(book) : "—"
								})
							] }), best ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									"Cheapest ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreMark, {
										storeId: best.storeId,
										size: "sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "tabular-nums",
										children: formatMoney(best.quote.unitPrice)
									})
								]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceGrid, {
							productId: hit.id,
							qty: 1,
							ctx,
							compact: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "scan-price",
									children: "Shelf price"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "scan-price",
									inputMode: "decimal",
									value: price,
									onChange: (e) => setPrice(e.target.value),
									className: "mt-1.5 h-12 font-mono text-lg tabular-nums"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "h-12",
								onClick: logCurrent,
								children: "Log price"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row",
							children: [
								onList ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "flex-1",
									onClick: () => {
										toggleChecked(onList.id);
										logCurrent();
										toast.success("Checked off the list");
										setHit(null);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Check off list"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									className: "flex-1",
									onClick: () => {
										addToList(hit.id, 1, storeId);
										toast.success("Added to the list");
									},
									children: "Add to list"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: watched.includes(hit.id) ? "secondary" : "outline",
									onClick: () => toggleWatched(hit.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), watched.includes(hit.id) ? "Watching" : "Watch"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: staples.includes(hit.id) ? "secondary" : "outline",
									onClick: () => toggleStaple(hit.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-4" }), staples.includes(hit.id) ? "Staple" : "Pin staple"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "w-full",
							onClick: () => setHit(null),
							children: "Scan next"
						})
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceScanner, { onHit: (product) => {
				setHit(product);
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Need the whole shelf typed in?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/log",
						className: "font-medium text-primary",
						children: "Log a trip"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/list",
						className: "font-medium text-primary",
						children: "Open the list"
					})
				]
			})
		]
	});
}
//#endregion
export { ScanPage as component };
