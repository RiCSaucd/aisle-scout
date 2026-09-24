package com.example.aislescout.data.model

enum class ProductCategory(val displayName: String) {
    PRODUCE("Produce"),
    DAIRY("Dairy & Eggs"),
    MEAT("Meat & Seafood"),
    BAKERY("Bakery"),
    PANTRY("Pantry"),
    FROZEN("Frozen"),
    BEVERAGES("Beverages"),
    HOUSEHOLD("Household"),
    PERSONAL("Personal Care"),
    ALCOHOL("Beer & Wine")
}

enum class UnitType(val label: String) {
    EACH("ea"),
    LB("lb"),
    OZ("oz"),
    GAL("gal"),
    HALF_GAL("half gal"),
    PACK("pk"),
    DOZEN("doz"),
    COUNT("ct"),
    BOTTLE("btl")
}

data class Product(
    val id: String,
    val name: String,
    val category: ProductCategory,
    val unit: UnitType,
    val sizeLabel: String = "",
    val barcode: String = "",
    val isOrganic: Boolean = false,
    val shelfLifeDays: Int = 7,
    val prices: Map<String, Double> = emptyMap(), // storeId -> regular price
    val notes: String = "",
    val imageResName: String = ""
)
