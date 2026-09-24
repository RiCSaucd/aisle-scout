package com.example.aislescout.data.model

enum class StoreKind {
    GROCER,
    PHARMACY,
    DOLLAR,
    LIQUOR,
    CONVENIENCE,
    CLUB,
    FARM
}

data class Store(
    val id: String,
    val name: String,
    val shortName: String,
    val kind: StoreKind,
    val address: String,
    val distanceMiles: Double,
    val typicalSavingsVsPublix: Double,
    val phone: String,
    val hours: String,
    val colorHex: String,
    val brandHex: String,
    val tags: List<String> = emptyList(),
    val isPrimaryComparison: Boolean = false,
    val onlineOrderingUrl: String = ""
)
