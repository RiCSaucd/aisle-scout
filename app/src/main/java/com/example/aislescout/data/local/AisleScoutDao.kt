package com.example.aislescout.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface AisleScoutDao {
    // Shopping List
    @Query("SELECT * FROM list_items ORDER BY checked ASC, addedAt DESC")
    fun getAllListItems(): Flow<List<ListItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertListItem(item: ListItemEntity): Long

    @Update
    suspend fun updateListItem(item: ListItemEntity)

    @Delete
    suspend fun deleteListItem(item: ListItemEntity)

    @Query("DELETE FROM list_items WHERE checked = 1")
    suspend fun clearCheckedListItems()

    // Inventory / Pantry
    @Query("SELECT * FROM inventory_items ORDER BY expiryDate ASC")
    fun getAllInventory(): Flow<List<InventoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertInventory(item: InventoryEntity): Long

    @Update
    suspend fun updateInventory(item: InventoryEntity)

    @Delete
    suspend fun deleteInventory(item: InventoryEntity)

    @Query("UPDATE inventory_items SET quantity = :quantity WHERE id = :id")
    suspend fun updateInventoryQuantity(id: Long, quantity: Double)

    @Query("SELECT * FROM inventory_items WHERE productId = :productId LIMIT 1")
    suspend fun getInventoryByProductId(productId: String): InventoryEntity?

    @Query("DELETE FROM inventory_items WHERE id = :id")
    suspend fun deleteInventoryById(id: Long)

    // Shelf Price Logs
    @Query("SELECT * FROM price_logs ORDER BY dateLogged DESC")
    fun getAllPriceLogs(): Flow<List<PriceLogEntity>>

    @Query("SELECT * FROM price_logs WHERE productId = :productId ORDER BY dateLogged DESC")
    fun getPriceLogsForProduct(productId: String): Flow<List<PriceLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPriceLog(log: PriceLogEntity): Long

    // Clipped Deals
    @Query("SELECT * FROM clipped_deals")
    fun getClippedDeals(): Flow<List<ClippedDealEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun clipDeal(deal: ClippedDealEntity)

    @Query("DELETE FROM clipped_deals WHERE promoId = :promoId")
    suspend fun unclipDeal(promoId: String)
}
