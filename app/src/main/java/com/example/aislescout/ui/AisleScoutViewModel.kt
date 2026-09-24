package com.example.aislescout.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.aislescout.data.local.AisleScoutDatabase
import com.example.aislescout.data.model.*
import com.example.aislescout.data.repository.*
import com.example.aislescout.domain.ListBlender
import com.example.aislescout.domain.Optimizer
import com.example.aislescout.domain.PricingEngine
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class AisleScoutViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: AisleScoutRepository

    val searchQuery = MutableStateFlow("")
    val selectedCategory = MutableStateFlow<ProductCategory?>(null)
    val organicOnly = MutableStateFlow(false)

    val listItems: StateFlow<List<ListItem>>
    val inventoryItems: StateFlow<List<InventoryItem>>
    val priceLogs: StateFlow<List<PriceLog>>
    val clippedDeals: StateFlow<Set<String>>

    val tripPlan: StateFlow<TripPlan>
    val storeWins: StateFlow<List<PricingEngine.StoreWin>>

    init {
        val db = AisleScoutDatabase.getDatabase(application)
        repository = AisleScoutRepository(db.dao())

        listItems = repository.listItems.stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            emptyList()
        )

        inventoryItems = repository.inventoryItems.stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            emptyList()
        )

        priceLogs = repository.priceLogs.stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            emptyList()
        )

        clippedDeals = repository.clippedDealIds.stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            emptySet()
        )

        tripPlan = listItems.map { items ->
            Optimizer.buildTripPlan(items)
        }.stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            Optimizer.buildTripPlan(emptyList())
        )

        storeWins = MutableStateFlow(PricingEngine.getStoreWinCounts()).asStateFlow()
    }

    fun setSearch(q: String) {
        searchQuery.value = q
    }

    fun setCategory(cat: ProductCategory?) {
        selectedCategory.value = cat
    }

    fun toggleOrganicOnly() {
        organicOnly.value = !organicOnly.value
    }

    fun addToList(productId: String, name: String, storeId: String? = null, quantity: Int = 1, unit: String = "ea") {
        viewModelScope.launch {
            repository.addListItem(productId, name, quantity, unit, storeId)
        }
    }

    fun toggleListItem(item: ListItem) {
        viewModelScope.launch {
            repository.toggleListItemChecked(item)
        }
    }

    fun deleteListItem(item: ListItem) {
        viewModelScope.launch {
            repository.deleteListItem(item)
        }
    }

    fun clearCompletedList() {
        viewModelScope.launch {
            repository.clearCompletedListItems()
        }
    }

    fun blendRawText(text: String, onComplete: (Int) -> Unit) {
        viewModelScope.launch {
            val result = ListBlender.blend(text)
            for (item in result.matchedItems) {
                repository.addListItem(item.productId, item.name, item.quantity, item.unit)
            }
            onComplete(result.matchedItems.size)
        }
    }

    fun addToInventory(
        productId: String,
        name: String,
        location: StorageLocation,
        quantity: Double,
        unit: String,
        shelfLifeDays: Int = 7,
        notes: String = "",
        barcode: String = ""
    ) {
        viewModelScope.launch {
            val now = System.currentTimeMillis()
            val expiry = now + (shelfLifeDays.toLong() * 24 * 60 * 60 * 1000)
            repository.addInventoryItem(
                InventoryItem(
                    productId = productId,
                    name = name,
                    location = location,
                    quantity = quantity,
                    unit = unit,
                    purchasedDate = now,
                    expiryDate = expiry,
                    notes = notes,
                    barcode = barcode
                )
            )
        }
    }

    fun addProductToPantry(
        product: Product,
        quantity: Double = 1.0,
        customLocation: StorageLocation? = null,
        barcode: String = ""
    ) {
        val (defaultLocation, shelfLife) = when (product.category) {
            ProductCategory.DAIRY -> StorageLocation.FRIDGE to 10
            ProductCategory.MEAT_SEAFOOD -> StorageLocation.FRIDGE to 4
            ProductCategory.PRODUCE -> StorageLocation.FRIDGE to 7
            ProductCategory.BAKERY -> StorageLocation.PANTRY to 6
            ProductCategory.PANTRY_STAPLES,
            ProductCategory.SNACKS_BEVERAGES -> StorageLocation.PANTRY to 90
            ProductCategory.FROZEN -> StorageLocation.FREEZER to 90
        }
        val targetLocation = customLocation ?: defaultLocation
        addToInventory(
            productId = product.id,
            name = product.name,
            location = targetLocation,
            quantity = quantity,
            unit = product.sizeLabel,
            shelfLifeDays = shelfLife,
            notes = "Scanned item",
            barcode = if (barcode.isNotBlank()) barcode else product.barcode
        )
    }

    fun updateInventoryQuantity(id: Long, newQuantity: Double) {
        viewModelScope.launch {
            repository.updateInventoryQuantity(id, newQuantity.coerceAtLeast(0.0))
        }
    }

    fun incrementInventoryQuantity(item: InventoryItem, delta: Double = 1.0) {
        val newQty = (item.quantity + delta).coerceAtLeast(0.0)
        updateInventoryQuantity(item.id, newQty)
    }

    fun decrementInventoryQuantity(item: InventoryItem, delta: Double = 1.0) {
        val newQty = (item.quantity - delta).coerceAtLeast(0.0)
        updateInventoryQuantity(item.id, newQty)
    }

    fun updateInventoryItem(item: InventoryItem) {
        viewModelScope.launch {
            repository.updateInventoryItem(item)
        }
    }

    fun restockInventoryItemToList(item: InventoryItem, quantity: Int = 1) {
        viewModelScope.launch {
            repository.addListItem(
                productId = item.productId,
                name = item.name,
                quantity = quantity,
                unit = item.unit
            )
        }
    }

    fun deleteInventory(item: InventoryItem) {
        viewModelScope.launch {
            repository.deleteInventoryItem(item)
        }
    }

    fun logShelfPrice(productId: String, productName: String, storeId: String, price: Double, barcode: String = "", notes: String = "") {
        viewModelScope.launch {
            repository.logShelfPrice(productId, productName, storeId, price, barcode, notes)
        }
    }

    fun toggleDeal(promoId: String) {
        viewModelScope.launch {
            val isClipped = clippedDeals.value.contains(promoId)
            repository.toggleDealClipped(promoId, isClipped)
        }
    }
}
