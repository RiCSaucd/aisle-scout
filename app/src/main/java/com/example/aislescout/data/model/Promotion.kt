package com.example.aislescout.data.model

enum class PromotionKind(val badgeText: String) {
    BOGO("BOGO FREE"),
    BOGO50("BOGO 50% OFF"),
    SALE("ON SALE"),
    ROLLBACK("ROLLBACK"),
    CIRCLE("TARGET CIRCLE"),
    ALDI_FINDS("ALDI FIND"),
    COUPON("DIGITAL COUPON")
}

data class Promotion(
    val id: String,
    val storeId: String,
    val productId: String,
    val kind: PromotionKind,
    val promoPrice: Double? = null,
    val regularPrice: Double? = null,
    val title: String,
    val description: String = "",
    val validUntil: String = "",
    val active: Boolean = true
)
