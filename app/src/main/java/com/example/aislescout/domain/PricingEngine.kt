package com.example.aislescout.domain

import com.example.aislescout.data.model.Product
import com.example.aislescout.data.model.Promotion
import com.example.aislescout.data.model.PromotionKind
import com.example.aislescout.data.model.QuoteLineItem
import com.example.aislescout.data.repository.CatalogData
import com.example.aislescout.data.repository.PromotionData
import com.example.aislescout.data.repository.StoreData

object PricingEngine {

    fun getRegularPrice(productId: String, storeId: String): Double? {
        val product = CatalogData.getById(productId) ?: return null
        return product.prices[storeId]
    }

    fun getActivePromotion(productId: String, storeId: String): Promotion? {
        return PromotionData.getForProductAndStore(productId, storeId)
    }

    fun getEffectiveUnitPrice(productId: String, storeId: String, quantity: Int = 1): Double? {
        val regular = getRegularPrice(productId, storeId) ?: return null
        val promo = getActivePromotion(productId, storeId) ?: return regular

        return when (promo.kind) {
            PromotionKind.BOGO -> {
                // If buying 1, effective cost is regular / 2 if store allows true BOGO split, or for paired units
                regular / 2.0
            }
            PromotionKind.BOGO50 -> {
                regular * 0.75
            }
            PromotionKind.SALE,
            PromotionKind.ROLLBACK,
            PromotionKind.CIRCLE,
            PromotionKind.ALDI_FINDS -> {
                promo.promoPrice ?: regular
            }
            PromotionKind.COUPON -> {
                promo.promoPrice ?: regular
            }
        }
    }

    fun quoteLine(productId: String, storeId: String, quantity: Int = 1): QuoteLineItem? {
        val product = CatalogData.getById(productId) ?: return null
        val regular = getRegularPrice(productId, storeId) ?: return null
        val promo = getActivePromotion(productId, storeId)

        val unitPrice = getEffectiveUnitPrice(productId, storeId, quantity) ?: regular
        val totalPrice = unitPrice * quantity
        val isPromo = promo != null

        return QuoteLineItem(
            productId = productId,
            productName = product.name,
            quantity = quantity,
            unitPrice = Math.round(unitPrice * 100.0) / 100.0,
            totalPrice = Math.round(totalPrice * 100.0) / 100.0,
            isPromo = isPromo,
            promoLabel = promo?.kind?.badgeText
        )
    }

    data class StoreWin(
        val storeId: String,
        val storeName: String,
        val winCount: Int,
        val totalCompared: Int,
        val winPercentage: Int
    )

    fun getStoreWinCounts(): List<StoreWin> {
        val primaryStores = StoreData.primaryStores
        val winCounts = primaryStores.associate { it.id to 0 }.toMutableMap()
        var totalCompared = 0

        for (product in CatalogData.products) {
            val validPrices = primaryStores.mapNotNull { store ->
                val price = getEffectiveUnitPrice(product.id, store.id)
                if (price != null) store.id to price else null
            }
            if (validPrices.size >= 2) {
                totalCompared++
                val minPrice = validPrices.minOf { it.second }
                val winners = validPrices.filter { Math.abs(it.second - minPrice) < 0.001 }
                for (winner in winners) {
                    winCounts[winner.first] = (winCounts[winner.first] ?: 0) + 1
                }
            }
        }

        return primaryStores.map { store ->
            val wins = winCounts[store.id] ?: 0
            val pct = if (totalCompared > 0) ((wins.toDouble() / totalCompared) * 100).toInt() else 0
            StoreWin(
                storeId = store.id,
                storeName = store.shortName,
                winCount = wins,
                totalCompared = totalCompared,
                winPercentage = pct
            )
        }.sortedByDescending { it.winCount }
    }

    fun getCheapestStoreForProduct(productId: String): Pair<String, Double>? {
        val primaryStores = StoreData.primaryStores
        var lowestStore: String? = null
        var lowestPrice = Double.MAX_VALUE

        for (store in primaryStores) {
            val price = getEffectiveUnitPrice(productId, store.id) ?: continue
            if (price < lowestPrice) {
                lowestPrice = price
                lowestStore = store.id
            }
        }

        return if (lowestStore != null) lowestStore to (Math.round(lowestPrice * 100.0) / 100.0) else null
    }
}
