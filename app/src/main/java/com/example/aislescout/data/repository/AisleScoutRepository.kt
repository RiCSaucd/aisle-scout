package com.example.aislescout.data.repository

import com.example.aislescout.data.local.*
import com.example.aislescout.data.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class AisleScoutRepository(private val dao: AisleScoutDao) {

    // Shopping list
    val listItems: Flow<List<ListItem>> = dao.getAllListItems().map { list ->
        list.map { entity ->
            ListItem(
                id = entity.id,
                productId = entity.productId,
                name = entity.name,
                quantity = entity.quantity,
                unit = entity.unit,
                checked = entity.checked,
                preferredStoreId = entity.preferredStoreId,
                note = entity.note,
                addedAt = entity.addedAt
            )
        }
    }

    suspend fun addListItem(productId: String, name: String, quantity: Int = 1, unit: String = "ea", storeId: String? = null) {
        dao.insertListItem(
            ListItemEntity(
                productId = productId,
                name = name,
                quantity = quantity,
                unit = unit,
                preferredStoreId = storeId
            )
        )
    }

    suspend fun toggleListItemChecked(item: ListItem) {
        dao.updateListItem(
            ListItemEntity(
                id = item.id,
                productId = item.productId,
                name = item.name,
                quantity = item.quantity,
                unit = item.unit,
                checked = !item.checked,
                preferredStoreId = item.preferredStoreId,
                note = item.note,
                addedAt = item.addedAt
            )
        )
    }

    suspend fun deleteListItem(item: ListItem) {
        dao.deleteListItem(
            ListItemEntity(
                id = item.id,
                productId = item.productId,
                name = item.name,
                quantity = item.quantity,
                unit = item.unit,
                checked = item.checked,
                preferredStoreId = item.preferredStoreId,
                note = item.note,
                addedAt = item.addedAt
            )
        )
    }

    suspend fun clearCompletedListItems() {
        dao.clearCheckedListItems()
    }

    // Pantry
    val inventoryItems: Flow<List<InventoryItem>> = dao.getAllInventory().map { list ->
        list.map { entity ->
            InventoryItem(
                id = entity.id,
                productId = entity.productId,
                name = entity.name,
                location = try { StorageLocation.valueOf(entity.location) } catch (e: Exception) { StorageLocation.PANTRY },
                quantity = entity.quantity,
                unit = entity.unit,
                purchasedDate = entity.purchasedDate,
                expiryDate = entity.expiryDate,
                lowStockThreshold = entity.lowStockThreshold,
                notes = entity.notes,
                barcode = entity.barcode
            )
        }
    }

    suspend fun addInventoryItem(item: InventoryItem) {
        dao.insertInventory(
            InventoryEntity(
                productId = item.productId,
                name = item.name,
                location = item.location.name,
                quantity = item.quantity,
                unit = item.unit,
                purchasedDate = item.purchasedDate,
                expiryDate = item.expiryDate,
                lowStockThreshold = item.lowStockThreshold,
                notes = item.notes,
                barcode = item.barcode
            )
        )
    }

    suspend fun updateInventoryQuantity(id: Long, quantity: Double) {
        dao.updateInventoryQuantity(id, quantity)
    }

    suspend fun updateInventoryItem(item: InventoryItem) {
        dao.updateInventory(
            InventoryEntity(
                id = item.id,
                productId = item.productId,
                name = item.name,
                location = item.location.name,
                quantity = item.quantity,
                unit = item.unit,
                purchasedDate = item.purchasedDate,
                expiryDate = item.expiryDate,
                lowStockThreshold = item.lowStockThreshold,
                notes = item.notes,
                barcode = item.barcode
            )
        )
    }

    suspend fun deleteInventoryItem(item: InventoryItem) {
        dao.deleteInventoryById(item.id)
    }

    // Price logs
    val priceLogs: Flow<List<PriceLog>> = dao.getAllPriceLogs().map { list ->
        list.map { entity ->
            PriceLog(
                id = entity.id,
                productId = entity.productId,
                productName = entity.productName,
                storeId = entity.storeId,
                shelfPrice = entity.shelfPrice,
                dateLogged = entity.dateLogged,
                notes = entity.notes,
                userBarcode = entity.userBarcode
            )
        }
    }

    suspend fun logShelfPrice(productId: String, productName: String, storeId: String, price: Double, barcode: String = "", notes: String = "") {
        dao.insertPriceLog(
            PriceLogEntity(
                productId = productId,
                productName = productName,
                storeId = storeId,
                shelfPrice = price,
                userBarcode = barcode,
                notes = notes
            )
        )
    }

    // Clipped Deals
    val clippedDealIds: Flow<Set<String>> = dao.getClippedDeals().map { list ->
        list.map { it.promoId }.toSet()
    }

    suspend fun toggleDealClipped(promoId: String, isCurrentlyClipped: Boolean) {
        if (isCurrentlyClipped) {
            dao.unclipDeal(promoId)
        } else {
            dao.clipDeal(ClippedDealEntity(promoId = promoId))
        }
    }
}
