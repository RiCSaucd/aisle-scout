package com.example.aislescout.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.aislescout.data.model.InventoryItem
import com.example.aislescout.data.model.StorageLocation
import com.example.aislescout.ui.AisleScoutViewModel
import com.example.aislescout.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

enum class PantryQuickFilter(val label: String) {
    ALL("All Items"),
    SCANNED("📷 Scanned"),
    EXPIRING_SOON("⚠️ Expiring Soon"),
    LOW_STOCK("📉 Out / Low Stock")
}

enum class PantrySortOrder(val label: String) {
    EXPIRY_DATE("Expiration Date"),
    NAME("Name (A-Z)"),
    QUANTITY_LOW("Quantity (Low to High)"),
    QUANTITY_HIGH("Quantity (High to Low)")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PantryScreen(
    viewModel: AisleScoutViewModel,
    onNavigateToList: () -> Unit = {},
    onNavigateToScan: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val inventoryItems by viewModel.inventoryItems.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedLocation by remember { mutableStateOf<StorageLocation?>(null) }
    var quickFilter by remember { mutableStateOf(PantryQuickFilter.ALL) }
    var sortOrder by remember { mutableStateOf(PantrySortOrder.EXPIRY_DATE) }
    var showSortMenu by remember { mutableStateOf(false) }

    // Dialog States
    var showAddDialog by remember { mutableStateOf(false) }
    var editingItemForQuantity by remember { mutableStateOf<InventoryItem?>(null) }
    var editingItemDetails by remember { mutableStateOf<InventoryItem?>(null) }
    var snackbarMessage by remember { mutableStateOf<String?>(null) }

    val now = System.currentTimeMillis()

    // Calculated metrics
    val totalCount = inventoryItems.size
    val scannedCount = inventoryItems.count { it.barcode.isNotBlank() || it.notes.contains("Scanned", ignoreCase = true) }
    val expiringSoonItems = inventoryItems.filter {
        val days = (it.expiryDate - now) / (1000 * 60 * 60 * 24)
        days in 0..3
    }
    val outOrLowStockItems = inventoryItems.filter { it.quantity <= it.lowStockThreshold }

    // Filter & Sort Logic
    val filteredItems = remember(inventoryItems, selectedLocation, quickFilter, searchQuery, sortOrder) {
        inventoryItems
            .filter { item ->
                // Location filter
                (selectedLocation == null || item.location == selectedLocation)
            }
            .filter { item ->
                // Quick filter
                when (quickFilter) {
                    PantryQuickFilter.ALL -> true
                    PantryQuickFilter.SCANNED -> item.barcode.isNotBlank() || item.notes.contains("Scanned", ignoreCase = true)
                    PantryQuickFilter.EXPIRING_SOON -> {
                        val days = (item.expiryDate - now) / (1000 * 60 * 60 * 24)
                        days in 0..3
                    }
                    PantryQuickFilter.LOW_STOCK -> item.quantity <= item.lowStockThreshold
                }
            }
            .filter { item ->
                // Search query
                if (searchQuery.isBlank()) true
                else item.name.contains(searchQuery, ignoreCase = true) ||
                        item.location.label.contains(searchQuery, ignoreCase = true) ||
                        item.barcode.contains(searchQuery, ignoreCase = true) ||
                        item.notes.contains(searchQuery, ignoreCase = true)
            }
            .let { list ->
                // Sort
                when (sortOrder) {
                    PantrySortOrder.EXPIRY_DATE -> list.sortedBy { it.expiryDate }
                    PantrySortOrder.NAME -> list.sortedBy { it.name.lowercase() }
                    PantrySortOrder.QUANTITY_LOW -> list.sortedBy { it.quantity }
                    PantrySortOrder.QUANTITY_HIGH -> list.sortedByDescending { it.quantity }
                }
            }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "My Pantry",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.ExtraBold
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(OceanBlueLight)
                                    .padding(horizontal = 7.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "$totalCount items",
                                    color = OceanBlue,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        Text(
                            text = "Track home items, scanned barcodes & quantities",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                actions = {
                    // Scan Barcode Button
                    FilledTonalButton(
                        onClick = onNavigateToScan,
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        colors = ButtonDefaults.filledTonalButtonColors(
                            containerColor = OceanBlueLight,
                            contentColor = OceanBlue
                        ),
                        modifier = Modifier
                            .padding(end = 4.dp)
                            .testTag("pantry_scan_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.QrCodeScanner,
                            contentDescription = "Scan to Pantry",
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Scan", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }

                    // Add Item Manually
                    IconButton(
                        onClick = { showAddDialog = true },
                        modifier = Modifier
                            .testTag("pantry_add_button")
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(OceanBlueLight)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Add Item",
                            tint = OceanBlue,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = onNavigateToScan,
                icon = { Icon(Icons.Default.QrCodeScanner, contentDescription = null) },
                text = { Text("Scan Barcode", fontWeight = FontWeight.Bold) },
                containerColor = OceanBlue,
                contentColor = Color.White,
                shape = RoundedCornerShape(16.dp),
                elevation = FloatingActionButtonDefaults.elevation(defaultElevation = 3.dp),
                modifier = Modifier
                    .padding(bottom = 16.dp)
                    .testTag("pantry_fab_scan")
            )
        },
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Search & Sort Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search pantry or UPC...", fontSize = 13.sp) },
                    singleLine = true,
                    leadingIcon = {
                        Icon(
                            Icons.Default.Search,
                            contentDescription = null,
                            tint = OceanBlue,
                            modifier = Modifier.size(18.dp)
                        )
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Default.Clear, contentDescription = "Clear", modifier = Modifier.size(16.dp))
                            }
                        }
                    },
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = OceanBlue,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                        focusedContainerColor = MaterialTheme.colorScheme.surface
                    ),
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp)
                        .testTag("pantry_search_input")
                )

                // Sort Button
                Box {
                    IconButton(
                        onClick = { showSortMenu = true },
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(MaterialTheme.colorScheme.surface)
                            .border(BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant), RoundedCornerShape(12.dp))
                            .testTag("pantry_sort_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Sort,
                            contentDescription = "Sort",
                            tint = OceanBlue
                        )
                    }

                    DropdownMenu(
                        expanded = showSortMenu,
                        onDismissRequest = { showSortMenu = false }
                    ) {
                        PantrySortOrder.values().forEach { order ->
                            DropdownMenuItem(
                                text = {
                                    Text(
                                        text = order.label,
                                        fontWeight = if (sortOrder == order) FontWeight.Bold else FontWeight.Normal
                                    )
                                },
                                onClick = {
                                    sortOrder = order
                                    showSortMenu = false
                                },
                                leadingIcon = {
                                    if (sortOrder == order) {
                                        Icon(Icons.Default.Check, contentDescription = null, tint = OceanBlue)
                                    }
                                }
                            )
                        }
                    }
                }
            }

            // Quick Stats Banner
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    PantryStatPill(
                        label = "Total Items",
                        value = "$totalCount",
                        color = OceanBlue
                    )
                    Box(modifier = Modifier.width(1.dp).height(24.dp).background(MaterialTheme.colorScheme.outlineVariant))
                    PantryStatPill(
                        label = "📷 Scanned",
                        value = "$scannedCount",
                        color = EmeraldGreen
                    )
                    Box(modifier = Modifier.width(1.dp).height(24.dp).background(MaterialTheme.colorScheme.outlineVariant))
                    PantryStatPill(
                        label = "Expiring <3d",
                        value = "${expiringSoonItems.size}",
                        color = if (expiringSoonItems.isNotEmpty()) CoralOrange else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Box(modifier = Modifier.width(1.dp).height(24.dp).background(MaterialTheme.colorScheme.outlineVariant))
                    PantryStatPill(
                        label = "Low/Out",
                        value = "${outOrLowStockItems.size}",
                        color = if (outOrLowStockItems.isNotEmpty()) CrimsonRed else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Storage Location Filter Pills
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    PantryFilterChip(
                        label = "All Locations (${inventoryItems.size})",
                        isSelected = selectedLocation == null,
                        onClick = { selectedLocation = null }
                    )
                }
                items(StorageLocation.values()) { loc ->
                    val count = inventoryItems.count { it.location == loc }
                    val icon = when (loc) {
                        StorageLocation.PANTRY -> "🥫"
                        StorageLocation.FRIDGE -> "🥛"
                        StorageLocation.FREEZER -> "❄️"
                        StorageLocation.OTHER -> "📦"
                    }
                    PantryFilterChip(
                        label = "$icon ${loc.label} ($count)",
                        isSelected = selectedLocation == loc,
                        onClick = { selectedLocation = loc }
                    )
                }
            }

            // Quick Status Filter Chips
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 2.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                items(PantryQuickFilter.values()) { filter ->
                    val isSelected = quickFilter == filter
                    FilterChip(
                        selected = isSelected,
                        onClick = { quickFilter = filter },
                        label = { Text(filter.label, fontSize = 11.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = if (filter == PantryQuickFilter.SCANNED) EmeraldLight else OceanBlueLight,
                            selectedLabelColor = if (filter == PantryQuickFilter.SCANNED) EmeraldGreen else OceanBlue
                        ),
                        modifier = Modifier.height(30.dp)
                    )
                }
            }

            // Expiring Soon Alert Card
            if (expiringSoonItems.isNotEmpty() && quickFilter != PantryQuickFilter.EXPIRING_SOON) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 4.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = CoralOrange.copy(alpha = 0.12f)),
                    border = BorderStroke(1.dp, CoralOrange.copy(alpha = 0.35f))
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.WarningAmber,
                            contentDescription = null,
                            tint = CoralOrange,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "${expiringSoonItems.size} item(s) expiring soon!",
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = Color(0xFF9A3412)
                            )
                            Text(
                                text = expiringSoonItems.take(2).joinToString { it.name } + if (expiringSoonItems.size > 2) "..." else "",
                                fontSize = 11.sp,
                                color = Color(0xFFC2410C)
                            )
                        }
                        TextButton(
                            onClick = { quickFilter = PantryQuickFilter.EXPIRING_SOON },
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text("View", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = CoralOrange)
                        }
                    }
                }
            }

            // Pantry Items List or Empty State
            if (filteredItems.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Box(
                            modifier = Modifier
                                .size(72.dp)
                                .clip(CircleShape)
                                .background(OceanBlueLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Kitchen,
                                contentDescription = null,
                                modifier = Modifier.size(36.dp),
                                tint = OceanBlue
                            )
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = if (searchQuery.isNotBlank()) "No matching pantry items" else "Your Pantry is Empty",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = if (searchQuery.isNotBlank()) {
                                "Try searching for a different product name, UPC barcode, or location."
                            } else {
                                "Scan items with your camera as you unpack groceries, or add them manually to track freshness & prevent food waste."
                            },
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center,
                            lineHeight = 20.sp
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Button(
                                onClick = onNavigateToScan,
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                                modifier = Modifier.testTag("pantry_empty_scan_button")
                            ) {
                                Icon(Icons.Default.QrCodeScanner, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Scan Barcode", fontWeight = FontWeight.Bold)
                            }
                            OutlinedButton(
                                onClick = { showAddDialog = true },
                                shape = RoundedCornerShape(12.dp),
                                border = BorderStroke(1.dp, OceanBlue)
                            ) {
                                Icon(Icons.Default.Add, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Add Manually", fontWeight = FontWeight.Bold, color = OceanBlue)
                            }
                        }
                    }
                }
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(bottom = 120.dp, top = 4.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(filteredItems, key = { it.id }) { item ->
                        PantryItemCard(
                            item = item,
                            onIncrement = { viewModel.incrementInventoryQuantity(item, 1.0) },
                            onDecrement = { viewModel.decrementInventoryQuantity(item, 1.0) },
                            onEditQuantity = { editingItemForQuantity = item },
                            onEditDetails = { editingItemDetails = item },
                            onRestockToList = {
                                viewModel.restockInventoryItemToList(item, 1)
                                snackbarMessage = "Added ${item.name} to shopping list!"
                            },
                            onDelete = { viewModel.deleteInventory(item) }
                        )
                    }
                }
            }
        }
    }

    // Direct Quantity Edit Dialog
    editingItemForQuantity?.let { item ->
        QuantityEditDialog(
            item = item,
            onDismiss = { editingItemForQuantity = null },
            onConfirm = { newQuantity ->
                viewModel.updateInventoryQuantity(item.id, newQuantity)
                editingItemForQuantity = null
            }
        )
    }

    // Edit Item Details Dialog
    editingItemDetails?.let { item ->
        EditPantryItemDialog(
            item = item,
            onDismiss = { editingItemDetails = null },
            onSave = { updatedItem ->
                viewModel.updateInventoryItem(updatedItem)
                editingItemDetails = null
            }
        )
    }

    // Add Item Dialog
    if (showAddDialog) {
        AddPantryItemDialog(
            onDismiss = { showAddDialog = false },
            onAdd = { name, location, quantity, unit, shelfLifeDays, notes, barcode ->
                viewModel.addToInventory(
                    productId = "user_" + name.lowercase().replace(" ", "_"),
                    name = name,
                    location = location,
                    quantity = quantity,
                    unit = unit,
                    shelfLifeDays = shelfLifeDays,
                    notes = notes,
                    barcode = barcode
                )
                showAddDialog = false
            }
        )
    }
}

@Composable
private fun PantryStatPill(
    label: String,
    value: String,
    color: Color
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            fontSize = 15.sp,
            fontWeight = FontWeight.ExtraBold,
            color = color
        )
        Text(
            text = label,
            fontSize = 10.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun PantryItemCard(
    item: InventoryItem,
    onIncrement: () -> Unit,
    onDecrement: () -> Unit,
    onEditQuantity: () -> Unit,
    onEditDetails: () -> Unit,
    onRestockToList: () -> Unit,
    onDelete: () -> Unit
) {
    val now = System.currentTimeMillis()
    val daysLeft = ((item.expiryDate - now) / (1000 * 60 * 60 * 24)).toInt()

    val (badgeBg, badgeText, badgeColor) = when {
        daysLeft < 0 -> Triple(CrimsonLight, "Expired", CrimsonRed)
        daysLeft == 0 -> Triple(CrimsonLight, "Expires Today", CrimsonRed)
        daysLeft in 1..3 -> Triple(CoralOrange.copy(alpha = 0.15f), "$daysLeft days left", CoralOrange)
        else -> Triple(EmeraldLight, "$daysLeft days fresh", EmeraldGreen)
    }

    val isOutOfStock = item.quantity <= 0.0
    val isLowStock = !isOutOfStock && item.quantity <= item.lowStockThreshold

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 5.dp)
            .testTag("pantry_item_${item.id}"),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isOutOfStock) MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
            else MaterialTheme.colorScheme.surface
        ),
        border = BorderStroke(
            1.dp,
            if (isOutOfStock) CrimsonRed.copy(alpha = 0.3f)
            else if (isLowStock) CoralOrange.copy(alpha = 0.4f)
            else MaterialTheme.colorScheme.outlineVariant
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            // Top Row: Name, Location, Badges
            Row(
                verticalAlignment = Alignment.Top,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = item.name,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        // Freshness Badge
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(badgeBg)
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = badgeText,
                                color = badgeColor,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        // Storage location badge
                        val locationBg = when (item.location) {
                            StorageLocation.PANTRY -> SunsetAmber.copy(alpha = 0.15f)
                            StorageLocation.FRIDGE -> OceanBlueLight
                            StorageLocation.FREEZER -> Color(0xFFE0F2FE)
                            StorageLocation.OTHER -> MaterialTheme.colorScheme.surfaceVariant
                        }
                        val locationColor = when (item.location) {
                            StorageLocation.PANTRY -> Color(0xFFB45309)
                            StorageLocation.FRIDGE -> OceanBlue
                            StorageLocation.FREEZER -> Color(0xFF0369A1)
                            StorageLocation.OTHER -> MaterialTheme.colorScheme.onSurfaceVariant
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(locationBg)
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = item.location.label,
                                color = locationColor,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        // Scanned Item Barcode indicator
                        if (item.barcode.isNotBlank()) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(EmeraldLight)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.QrCode,
                                        contentDescription = null,
                                        tint = EmeraldGreen,
                                        modifier = Modifier.size(10.dp)
                                    )
                                    Spacer(modifier = Modifier.width(3.dp))
                                    Text(
                                        text = item.barcode,
                                        color = EmeraldGreen,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        } else if (item.notes.contains("Scanned", ignoreCase = true)) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(EmeraldLight)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "📷 Scanned",
                                    color = EmeraldGreen,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        if (isOutOfStock) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(CrimsonLight)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "OUT OF STOCK",
                                    color = CrimsonRed,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }
                        } else if (isLowStock) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(CoralOrange.copy(alpha = 0.15f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "LOW STOCK",
                                    color = CoralOrange,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }
                        }
                    }
                }

                // Quick Item Action Buttons
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(2.dp)
                ) {
                    IconButton(
                        onClick = onRestockToList,
                        modifier = Modifier
                            .size(36.dp)
                            .testTag("pantry_restock_${item.id}")
                    ) {
                        Icon(
                            imageVector = Icons.Default.AddShoppingCart,
                            contentDescription = "Restock to List",
                            tint = OceanBlue,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    IconButton(
                        onClick = onEditDetails,
                        modifier = Modifier
                            .size(36.dp)
                            .testTag("pantry_edit_${item.id}")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Edit,
                            contentDescription = "Edit Item",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(17.dp)
                        )
                    }

                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier
                            .size(36.dp)
                            .testTag("pantry_delete_${item.id}")
                    ) {
                        Icon(
                            imageVector = Icons.Default.DeleteOutline,
                            contentDescription = "Delete",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Bottom Section: Manual Quantity Adjustment Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f))
                    .padding(horizontal = 10.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Quantity at home:",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                // Quantity Stepper with 48dp touch targets
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    // Decrement Button
                    IconButton(
                        onClick = onDecrement,
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.surface)
                            .border(BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant), CircleShape)
                            .testTag("pantry_decrement_${item.id}")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Remove,
                            contentDescription = "Decrease Quantity",
                            tint = if (item.quantity > 0) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f),
                            modifier = Modifier.size(16.dp)
                        )
                    }

                    // Tappable Quantity Display for direct manual entry
                    Surface(
                        onClick = onEditQuantity,
                        shape = RoundedCornerShape(8.dp),
                        color = MaterialTheme.colorScheme.surface,
                        border = BorderStroke(1.dp, OceanBlue.copy(alpha = 0.5f)),
                        modifier = Modifier
                            .height(36.dp)
                            .testTag("pantry_qty_display_${item.id}")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 12.dp)
                        ) {
                            Text(
                                text = if (item.quantity % 1.0 == 0.0) "${item.quantity.toInt()} ${item.unit}" else "${item.quantity} ${item.unit}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = if (isOutOfStock) CrimsonRed else MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                imageVector = Icons.Default.Edit,
                                contentDescription = "Edit quantity",
                                tint = OceanBlue,
                                modifier = Modifier.size(12.dp)
                            )
                        }
                    }

                    // Increment Button
                    IconButton(
                        onClick = onIncrement,
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(OceanBlueLight)
                            .border(BorderStroke(1.dp, OceanBlue.copy(alpha = 0.3f)), CircleShape)
                            .testTag("pantry_increment_${item.id}")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Increase Quantity",
                            tint = OceanBlue,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }

            // Quick restock button if item is out of stock
            if (isOutOfStock) {
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = onRestockToList,
                    colors = ButtonDefaults.buttonColors(containerColor = CoralOrange),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    modifier = Modifier.fillMaxWidth().testTag("pantry_restock_cta_${item.id}")
                ) {
                    Icon(Icons.Default.AddShoppingCart, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Out of Stock • Restock to Shopping List", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun QuantityEditDialog(
    item: InventoryItem,
    onDismiss: () -> Unit,
    onConfirm: (Double) -> Unit
) {
    var quantityText by remember { mutableStateOf(if (item.quantity % 1.0 == 0.0) item.quantity.toInt().toString() else item.quantity.toString()) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Scale, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Update Quantity", fontWeight = FontWeight.Bold)
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "${item.name} (${item.unit})",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )

                OutlinedTextField(
                    value = quantityText,
                    onValueChange = { quantityText = it },
                    label = { Text("Exact Quantity") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("pantry_quantity_input")
                )

                // Quick Increment Presets
                Text("Quick Adjustments:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    val currentVal = quantityText.toDoubleOrNull() ?: item.quantity
                    listOf(0.0, 1.0, 2.0, 3.0, 5.0).forEach { presetVal ->
                        OutlinedButton(
                            onClick = { quantityText = if (presetVal % 1.0 == 0.0) presetVal.toInt().toString() else presetVal.toString() },
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(
                                text = if (presetVal == 0.0) "Out" else "${presetVal.toInt()}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val parsed = quantityText.toDoubleOrNull() ?: item.quantity
                    onConfirm(parsed.coerceAtLeast(0.0))
                },
                colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.testTag("pantry_quantity_save_button")
            ) {
                Text("Update", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@Composable
fun EditPantryItemDialog(
    item: InventoryItem,
    onDismiss: () -> Unit,
    onSave: (InventoryItem) -> Unit
) {
    var name by remember { mutableStateOf(item.name) }
    var location by remember { mutableStateOf(item.location) }
    var quantityStr by remember { mutableStateOf(if (item.quantity % 1.0 == 0.0) item.quantity.toInt().toString() else item.quantity.toString()) }
    var unit by remember { mutableStateOf(item.unit) }
    var barcode by remember { mutableStateOf(item.barcode) }
    var notes by remember { mutableStateOf(item.notes) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Edit, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Edit Pantry Item", fontWeight = FontWeight.Bold)
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Item Name") },
                    singleLine = true,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                Text("Storage Location", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    StorageLocation.values().forEach { loc ->
                        FilterChip(
                            selected = location == loc,
                            onClick = { location = loc },
                            label = { Text(loc.label, fontSize = 11.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = OceanBlueLight,
                                selectedLabelColor = OceanBlue
                            )
                        )
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = quantityStr,
                        onValueChange = { quantityStr = it },
                        label = { Text("Quantity") },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = unit,
                        onValueChange = { unit = it },
                        label = { Text("Unit") },
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    )
                }

                OutlinedTextField(
                    value = barcode,
                    onValueChange = { barcode = it },
                    label = { Text("UPC Barcode (Optional)") },
                    singleLine = true,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    label = { Text("Notes") },
                    singleLine = true,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        val parsedQty = quantityStr.toDoubleOrNull() ?: item.quantity
                        onSave(
                            item.copy(
                                name = name,
                                location = location,
                                quantity = parsedQty.coerceAtLeast(0.0),
                                unit = unit.ifBlank { "ea" },
                                barcode = barcode,
                                notes = notes
                            )
                        )
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text("Save Changes", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@Composable
fun AddPantryItemDialog(
    onDismiss: () -> Unit,
    onAdd: (name: String, location: StorageLocation, quantity: Double, unit: String, shelfLifeDays: Int, notes: String, barcode: String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var location by remember { mutableStateOf(StorageLocation.PANTRY) }
    var quantityStr by remember { mutableStateOf("1") }
    var unit by remember { mutableStateOf("ea") }
    var daysShelfLife by remember { mutableStateOf("7") }
    var barcode by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(OceanBlueLight),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Kitchen, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(18.dp))
                }
                Spacer(modifier = Modifier.width(10.dp))
                Text("Add to My Pantry", fontWeight = FontWeight.Bold)
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                // Quick Food Presets
                Text("Quick Add Preset:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    item {
                        PresetChip("🥛 Whole Milk") {
                            name = "Whole Milk"; location = StorageLocation.FRIDGE; unit = "gal"; daysShelfLife = "7"
                        }
                    }
                    item {
                        PresetChip("🥚 Grade A Eggs") {
                            name = "Grade A Eggs"; location = StorageLocation.FRIDGE; unit = "doz"; daysShelfLife = "21"
                        }
                    }
                    item {
                        PresetChip("🍞 Sourdough") {
                            name = "Sourdough Bread"; location = StorageLocation.PANTRY; unit = "loaf"; daysShelfLife = "5"
                        }
                    }
                    item {
                        PresetChip("🥑 Hass Avocados") {
                            name = "Hass Avocados"; location = StorageLocation.PANTRY; unit = "ea"; daysShelfLife = "4"
                        }
                    }
                    item {
                        PresetChip("🍗 Chicken Breast") {
                            name = "Chicken Breast"; location = StorageLocation.FREEZER; unit = "lbs"; daysShelfLife = "60"
                        }
                    }
                    item {
                        PresetChip("🍝 Rao's Marinara") {
                            name = "Rao's Marinara"; location = StorageLocation.PANTRY; unit = "jar"; daysShelfLife = "180"
                        }
                    }
                }

                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Item Name *") },
                    placeholder = { Text("e.g. Greek Yogurt, Oats, Pasta") },
                    singleLine = true,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("pantry_add_name_input")
                )

                Text("Storage Location", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    StorageLocation.values().forEach { loc ->
                        FilterChip(
                            selected = location == loc,
                            onClick = { location = loc },
                            label = { Text(loc.label, fontSize = 11.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = OceanBlueLight,
                                selectedLabelColor = OceanBlue
                            )
                        )
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = quantityStr,
                        onValueChange = { quantityStr = it },
                        label = { Text("Quantity") },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = unit,
                        onValueChange = { unit = it },
                        label = { Text("Unit") },
                        singleLine = true,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = daysShelfLife,
                        onValueChange = { daysShelfLife = it },
                        label = { Text("Fresh Days") },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    )
                }

                OutlinedTextField(
                    value = barcode,
                    onValueChange = { barcode = it },
                    label = { Text("Barcode / UPC (Optional)") },
                    singleLine = true,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        val qty = quantityStr.toDoubleOrNull() ?: 1.0
                        val days = daysShelfLife.toIntOrNull() ?: 7
                        onAdd(name, location, qty, unit.ifBlank { "ea" }, days, notes, barcode)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.testTag("pantry_add_confirm_button")
            ) {
                Text("Add to Pantry", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@Composable
private fun PantryFilterChip(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(20.dp),
        color = if (isSelected) OceanBlue else MaterialTheme.colorScheme.surface,
        border = BorderStroke(
            1.dp,
            if (isSelected) OceanBlue else MaterialTheme.colorScheme.outlineVariant
        ),
        modifier = Modifier.height(34.dp)
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.padding(horizontal = 12.dp)
        ) {
            Text(
                text = label,
                fontSize = 12.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

@Composable
private fun PresetChip(
    label: String,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        modifier = Modifier.height(30.dp)
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.padding(horizontal = 10.dp)
        ) {
            Text(
                text = label,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}
