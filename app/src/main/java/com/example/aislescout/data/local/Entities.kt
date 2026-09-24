package com.example.aislescout.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "list_items")
data class ListItemEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val productId: String,
    val name: String,
    val quantity: Int = 1,
    val unit: String = "ea",
    val checked: Boolean = false,
    val preferredStoreId: String? = null,
    val note: String = "",
    val addedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "inventory_items")
data class InventoryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val productId: String,
    val name: String,
    val location: String, // FRIDGE, FREEZER, PANTRY, OTHER
    val quantity: Double,
    val unit: String,
    val purchasedDate: Long,
    val expiryDate: Long,
    val lowStockThreshold: Double = 1.0,
    val notes: String = "",
    val barcode: String = ""
)

@Entity(tableName = "price_logs")
data class PriceLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val productId: String,
    val productName: String,
    val storeId: String,
    val shelfPrice: Double,
    val dateLogged: Long = System.currentTimeMillis(),
    val notes: String = "",
    val userBarcode: String = ""
)

@Entity(tableName = "clipped_deals")
data class ClippedDealEntity(
    @PrimaryKey val promoId: String,
    val clippedAt: Long = System.currentTimeMillis()
)
