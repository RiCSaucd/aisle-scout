package com.example.aislescout.domain

import com.example.aislescout.data.model.ListItem
import com.example.aislescout.data.model.QuoteLineItem
import com.example.aislescout.data.model.SplitStopPlan
import com.example.aislescout.data.model.StoreTripQuote
import com.example.aislescout.data.model.TripPlan
import com.example.aislescout.data.repository.StoreData

object Optimizer {

    fun planOneStore(items: List<ListItem>, storeId: String): StoreTripQuote {
        val store = StoreData.getById(storeId) ?: StoreData.primaryStores.first()
        val lineItems = mutableListOf<QuoteLineItem>()
        var missingCount = 0
        var totalCost = 0.0
        var regularTotal = 0.0

        for (item in items) {
            val regular = PricingEngine.getRegularPrice(item.productId, storeId)
            val quote = PricingEngine.quoteLine(item.productId, storeId, item.quantity)
            if (quote != null) {
                lineItems.add(quote)
                totalCost += quote.totalPrice
                regularTotal += (regular ?: quote.unitPrice) * item.quantity
            } else {
                missingCount++
            }
        }

        val promoSavings = Math.max(0.0, regularTotal - totalCost)

        return StoreTripQuote(
            storeId = store.id,
            storeName = store.name,
            totalCost = Math.round(totalCost * 100.0) / 100.0,
            itemsAvailableCount = lineItems.size,
            missingItemsCount = missingCount,
            promoSavings = Math.round(promoSavings * 100.0) / 100.0,
            lineItems = lineItems
        )
    }

    fun buildTripPlan(items: List<ListItem>): TripPlan {
        if (items.isEmpty()) {
            return TripPlan(
                singleStoreQuotes = emptyList(),
                bestSingleStore = null,
                splitStops = emptyList(),
                splitTotal = 0.0,
                splitSavingsVsBestSingle = 0.0,
                baselineCost = 0.0
            )
        }

        val primaryStores = StoreData.primaryStores
        val quotes = primaryStores.map { planOneStore(items, it.id) }
        val baselineQuote = quotes.find { it.storeId == "publix_beach" } ?: quotes.maxByOrNull { it.totalCost }
        val baselineCost = baselineQuote?.totalCost ?: 0.0

        val quotesWithSavings = quotes.map { quote ->
            val savings = Math.max(0.0, baselineCost - quote.totalCost)
            quote.copy(savingsVsBaseline = Math.round(savings * 100.0) / 100.0)
        }.sortedBy { it.totalCost }

        val bestSingle = quotesWithSavings.firstOrNull()

        // Build absolute split plan: each item at its cheapest store
        val splitByStore = mutableMapOf<String, MutableList<QuoteLineItem>>()
        var splitTotal = 0.0

        for (item in items) {
            var bestStoreId = primaryStores.first().id
            var bestPrice = Double.MAX_VALUE
            var bestQuote: QuoteLineItem? = null

            for (store in primaryStores) {
                val quote = PricingEngine.quoteLine(item.productId, store.id, item.quantity) ?: continue
                if (quote.totalPrice < bestPrice) {
                    bestPrice = quote.totalPrice
                    bestStoreId = store.id
                    bestQuote = quote
                }
            }

            if (bestQuote != null) {
                val list = splitByStore.getOrPut(bestStoreId) { mutableListOf() }
                list.add(bestQuote)
                splitTotal += bestQuote.totalPrice
            }
        }

        val splitStops = splitByStore.map { (storeId, itemsInStop) ->
            val store = StoreData.getById(storeId)
            val subtotal = itemsInStop.sumOf { it.totalPrice }
            SplitStopPlan(
                storeId = storeId,
                storeName = store?.name ?: storeId,
                items = itemsInStop,
                subtotal = Math.round(subtotal * 100.0) / 100.0
            )
        }.filter { it.items.isNotEmpty() }.sortedByDescending { it.subtotal }

        val splitSavings = Math.max(0.0, (bestSingle?.totalCost ?: 0.0) - splitTotal)

        return TripPlan(
            singleStoreQuotes = quotesWithSavings,
            bestSingleStore = bestSingle,
            splitStops = splitStops,
            splitTotal = Math.round(splitTotal * 100.0) / 100.0,
            splitSavingsVsBestSingle = Math.round(splitSavings * 100.0) / 100.0,
            baselineCost = Math.round(baselineCost * 100.0) / 100.0
        )
    }
}
