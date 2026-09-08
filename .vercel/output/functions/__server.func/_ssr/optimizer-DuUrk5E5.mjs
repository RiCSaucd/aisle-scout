import { f as quoteLine, o as cheapestStore, s as compareStoreIds, y as STORE_MAP } from "./router-C-tyNfJu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/optimizer-DuUrk5E5.js
function stopsFromAssignments(assignments, ctx) {
	const byStore = /* @__PURE__ */ new Map();
	let receivedExtra = 0;
	for (const row of assignments) {
		const quote = quoteLine(row.productId, row.storeId, row.qty, ctx);
		if (!quote) continue;
		receivedExtra += Math.max(0, quote.receivedQty - row.qty);
		let stop = byStore.get(row.storeId);
		if (!stop) {
			stop = {
				storeId: row.storeId,
				items: [],
				total: 0
			};
			byStore.set(row.storeId, stop);
		}
		stop.items.push({
			productId: row.productId,
			qty: row.qty,
			cost: quote.cost,
			note: quote.note
		});
		stop.total += quote.cost;
	}
	const order = compareStoreIds(ctx);
	const stops = [...byStore.values()].sort((a, b) => order.indexOf(a.storeId) - order.indexOf(b.storeId));
	return {
		stops,
		total: stops.reduce((sum, s) => sum + s.total, 0),
		receivedExtra
	};
}
function expensiveBaseline(items, ctx) {
	let total = 0;
	const ids = compareStoreIds(ctx);
	for (const item of items) {
		if (item.checked) continue;
		let worst = 0;
		for (const storeId of ids) {
			const q = quoteLine(item.productId, storeId, item.qty, ctx);
			if (q && q.regular * item.qty > worst) worst = q.regular * item.qty;
		}
		total += worst;
	}
	return total;
}
function canFill(storeId, items, ctx) {
	return items.every((i) => quoteLine(i.productId, storeId, i.qty, ctx) != null);
}
function planOneStore(items, ctx) {
	const active = items.filter((i) => !i.checked);
	const ids = compareStoreIds(ctx);
	let best = null;
	for (const storeId of ids) {
		if (active.length && !canFill(storeId, active, ctx)) continue;
		const built = stopsFromAssignments(active.map((i) => ({
			storeId,
			productId: i.productId,
			qty: i.qty
		})), ctx);
		const miles = STORE_MAP[storeId].miles;
		const farNote = STORE_MAP[storeId].far ? ` · ${miles} mi` : "";
		const plan = {
			mode: "one-store",
			label: `All at ${STORE_MAP[storeId].short}${farNote}`,
			...built,
			vsMostExpensive: expensiveBaseline(active, ctx) - built.total
		};
		if (!best || plan.total < best.total) best = plan;
	}
	return best ?? {
		mode: "one-store",
		label: "Empty list",
		stops: [],
		total: 0,
		receivedExtra: 0,
		vsMostExpensive: 0
	};
}
function planSplit(items, ctx) {
	const active = items.filter((i) => !i.checked);
	const assignments = [];
	for (const item of active) {
		if (item.preferredStore !== "cheapest") {
			assignments.push({
				storeId: item.preferredStore,
				productId: item.productId,
				qty: item.qty
			});
			continue;
		}
		const best = cheapestStore(item.productId, item.qty, ctx);
		if (best) assignments.push({
			storeId: best.storeId,
			productId: item.productId,
			qty: item.qty
		});
	}
	const built = stopsFromAssignments(assignments, ctx);
	const storeNames = built.stops.map((s) => STORE_MAP[s.storeId].short).join(" + ");
	return {
		mode: "split",
		label: built.stops.length <= 1 ? storeNames || "Split trip" : `Split · ${storeNames}`,
		...built,
		vsMostExpensive: expensiveBaseline(active, ctx) - built.total
	};
}
function planTwoStop(items, ctx) {
	const active = items.filter((i) => !i.checked);
	const ids = compareStoreIds(ctx);
	let best = null;
	for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
		const a = ids[i];
		const b = ids[j];
		const assignments = [];
		for (const item of active) {
			const qa = quoteLine(item.productId, a, item.qty, ctx);
			const qb = quoteLine(item.productId, b, item.qty, ctx);
			if (!qa && !qb) continue;
			const pick = qa && qb ? qa.cost <= qb.cost ? a : b : qa ? a : b;
			assignments.push({
				storeId: pick,
				productId: item.productId,
				qty: item.qty
			});
		}
		if (assignments.length < active.length) continue;
		const built = stopsFromAssignments(assignments, ctx);
		const plan = {
			mode: "two-stop",
			label: `${STORE_MAP[a].short} + ${STORE_MAP[b].short}`,
			...built,
			vsMostExpensive: expensiveBaseline(active, ctx) - built.total
		};
		if (!best || plan.total < best.total) best = plan;
	}
	return best ?? planSplit(items, ctx);
}
function allPlans(items, ctx) {
	const one = planOneStore(items, ctx);
	const two = planTwoStop(items, ctx);
	const split = planSplit(items, ctx);
	const unique = [one];
	if (two.stops.length > 1 && Math.abs(two.total - one.total) > .04) unique.push(two);
	if (split.stops.length > 2 && Math.abs(split.total - two.total) > .04 && Math.abs(split.total - one.total) > .04) unique.push(split);
	return unique.sort((a, b) => a.total - b.total);
}
//#endregion
export { allPlans as t };
