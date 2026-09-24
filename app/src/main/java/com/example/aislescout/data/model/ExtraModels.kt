package com.example.aislescout.data.model

data class PriceLog(
    val id: Long = 0,
    val productId: String,
    val productName: String,
    val storeId: String,
    val shelfPrice: Double,
    val dateLogged: Long = System.currentTimeMillis(),
    val notes: String = "",
    val userBarcode: String = ""
)

enum class StorageLocation(val label: String) {
    FRIDGE("Fridge"),
    FREEZER("Freezer"),
    PANTRY("Pantry"),
    OTHER("Other")
}

data class InventoryItem(
    val id: Long = 0,
    val productId: String,
    val name: String,
    val location: StorageLocation,
    val quantity: Double,
    val unit: String,
    val purchasedDate: Long = System.currentTimeMillis(),
    val expiryDate: Long = System.currentTimeMillis() + (7L * 24 * 60 * 60 * 1000),
    val lowStockThreshold: Double = 1.0,
    val notes: String = "",
    val barcode: String = ""
)

data class ListItem(
    val id: Long = 0,
    val productId: String,
    val name: String,
    val quantity: Int = 1,
    val unit: String = "ea",
    val checked: Boolean = false,
    val preferredStoreId: String? = null,
    val note: String = "",
    val addedAt: Long = System.currentTimeMillis()
)

data class StoreTripQuote(
    val storeId: String,
    val storeName: String,
    val totalCost: Double,
    val itemsAvailableCount: Int,
    val missingItemsCount: Int,
    val savingsVsBaseline: Double = 0.0,
    val promoSavings: Double = 0.0,
    val lineItems: List<QuoteLineItem> = emptyList()
)

data class QuoteLineItem(
    val productId: String,
    val productName: String,
    val quantity: Int,
    val unitPrice: Double,
    val totalPrice: Double,
    val isPromo: Boolean,
    val promoLabel: String? = null
)

data class SplitStopPlan(
    val storeId: String,
    val storeName: String,
    val items: List<QuoteLineItem>,
    val subtotal: Double
)

data class TripPlan(
    val singleStoreQuotes: List<StoreTripQuote>,
    val bestSingleStore: StoreTripQuote?,
    val splitStops: List<SplitStopPlan>,
    val splitTotal: Double,
    val splitSavingsVsBestSingle: Double,
    val baselineCost: Double // e.g. Publix full price
)

data class DeliveryOption(
    val serviceName: String,
    val provider: String,
    val monthlyFee: Double,
    val annualFee: Double,
    val minOrderForFreeDelivery: Double,
    val deliveryFeeUnderMin: Double,
    val itemMarkupPercent: Double,
    val estimatedServiceFeePercent: Double,
    val recommendedTipPercent: Double,
    val coverage32080: String,
    val perks: List<String>
)

data class FarmMarket(
    val id: String,
    val name: String,
    val dayOfWeek: String,
    val hours: String,
    val location: String,
    val address: String,
    val highlights: List<String>,
    val season: String,
    val isWeeklyRecurring: Boolean = true
)
