package com.example.aislescout.ui.scanner

import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.aislescout.data.model.Product
import com.example.aislescout.data.repository.PromotionData
import com.example.aislescout.data.model.Product
import com.example.aislescout.data.model.ProductCategory
import com.example.aislescout.data.model.StorageLocation
import com.example.aislescout.data.repository.PromotionData
import com.example.aislescout.data.repository.StoreData
import com.example.aislescout.ui.components.SavingsPill
import com.example.aislescout.ui.components.StoreBadge
import com.example.aislescout.ui.theme.*

@Composable
fun ProductLookupSheet(
    product: Product,
    scannedBarcode: String,
    onAddToList: (Product) -> Unit,
    onAddToPantry: (Product, Double, StorageLocation) -> Unit = { _, _, _ -> },
    onLogPrice: (Product) -> Unit,
    onScanNext: () -> Unit,
    onDismiss: () -> Unit,
    isPantryPriority: Boolean = false,
    modifier: Modifier = Modifier
) {
    var isAddedToList by remember(product.id) { mutableStateOf(false) }
    var isAddedToPantry by remember(product.id) { mutableStateOf(false) }
    var pantryQuantity by remember(product.id) { mutableStateOf(1.0) }
    var selectedLocation by remember(product.id) {
        val defaultLoc = when (product.category) {
            ProductCategory.DAIRY, ProductCategory.MEAT_SEAFOOD -> StorageLocation.FRIDGE
            ProductCategory.FROZEN -> StorageLocation.FREEZER
            ProductCategory.PRODUCE -> StorageLocation.FRIDGE
            else -> StorageLocation.PANTRY
        }
        mutableStateOf(defaultLoc)
    }
    val matchingPromos = remember(product.id) {
        PromotionData.promotions.filter { it.productId == product.id && it.active }
    }

    val storePrices = product.prices
    val lowestEntry = storePrices.minByOrNull { it.value }
    val highestEntry = storePrices.maxByOrNull { it.value }
    val lowestStore = lowestEntry?.let { StoreData.getById(it.key) }
    val lowestPrice = lowestEntry?.value ?: 0.0
    val highestPrice = highestEntry?.value ?: 0.0
    val maxSavings = (highestPrice - lowestPrice).coerceAtLeast(0.0)

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .testTag("product_lookup_sheet"),
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 6.dp,
        shadowElevation = 16.dp
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            // Drag handle / close row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(EmeraldLight)
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = EmeraldGreen,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Item Identified in 32080 Database",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = EmeraldGreen
                        )
                    }
                }

                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Dismiss",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Product Title and Category Info
            Text(
                text = product.name,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(4.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "${product.sizeLabel} • ${product.category.displayName}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (product.isOrganic) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(EmeraldLight)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "ORGANIC",
                            color = EmeraldGreen,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                    }
                }
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "UPC: ${if (scannedBarcode.isNotBlank()) scannedBarcode else product.barcode}",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Best Price Banner
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = EmeraldLight),
                border = BorderStroke(1.dp, EmeraldGreen.copy(alpha = 0.3f))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(
                            text = "LOWEST PRICE IN 32080",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.ExtraBold,
                            color = EmeraldGreen,
                            letterSpacing = 0.5.sp
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = lowestStore?.name ?: "Aldi",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = DeepNavy
                        )
                        if (maxSavings > 0.05) {
                            Text(
                                text = "Save $${String.format("%.2f", maxSavings)} vs ${highestEntry?.key?.replace("_", " ")?.capitalize() ?: "Publix"}",
                                style = MaterialTheme.typography.bodySmall,
                                fontWeight = FontWeight.SemiBold,
                                color = EmeraldGreen
                            )
                        }
                    }

                    Text(
                        text = "$${String.format("%.2f", lowestPrice)}",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.ExtraBold,
                        color = EmeraldGreen
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Store Comparison Grid
            Text(
                text = "Live Store Price Comparison (32080)",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(8.dp))

            Column(
                verticalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                listOf("aldi", "walmart", "target", "publix_beach").forEach { storeId ->
                    val price = storePrices[storeId]
                    val isLowest = storeId == lowestEntry?.key
                    val store = StoreData.getById(storeId)

                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isLowest) EmeraldLight.copy(alpha = 0.4f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
                        ),
                        border = BorderStroke(
                            1.dp,
                            if (isLowest) EmeraldGreen.copy(alpha = 0.5f) else MaterialTheme.colorScheme.outlineVariant
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                StoreBadge(storeId = storeId)
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = store?.shortName ?: storeId,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "${store?.milesFromCenter32080 ?: 2.5} mi from Beach",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        fontSize = 11.sp
                                    )
                                }
                            }

                            Row(verticalAlignment = Alignment.CenterVertically) {
                                if (isLowest) {
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(EmeraldGreen)
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = "BEST DEAL",
                                            color = Color.White,
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.ExtraBold
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                }
                                Text(
                                    text = if (price != null) "$${String.format("%.2f", price)}" else "--",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = if (isLowest) EmeraldGreen else MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }
            }

            // Promotional Deals if any
            if (matchingPromos.isNotEmpty()) {
                Spacer(modifier = Modifier.height(14.dp))
                matchingPromos.forEach { promo ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = CrimsonLight),
                        border = BorderStroke(1.dp, CrimsonRed.copy(alpha = 0.25f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(CrimsonRed),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.LocalOffer,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Active Deal: ${promo.kind.name} Free",
                                    fontWeight = FontWeight.Bold,
                                    color = CrimsonRed,
                                    fontSize = 13.sp
                                )
                                Text(
                                    text = "${promo.description} • Valid thru ${promo.validUntil}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Pantry Quick Config Bar (Location & Quantity for home storage)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
            ) {
                Column(modifier = Modifier.padding(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Save to My Pantry Location:",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        // Quantity Stepper
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(
                                onClick = { if (pantryQuantity > 1) pantryQuantity -= 1.0 },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(Icons.Default.Remove, contentDescription = "Decrease", modifier = Modifier.size(14.dp))
                            }
                            Text(
                                text = "${pantryQuantity.toInt()} ${product.sizeLabel}",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.ExtraBold,
                                modifier = Modifier.padding(horizontal = 4.dp)
                            )
                            IconButton(
                                onClick = { pantryQuantity += 1.0 },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(Icons.Default.Add, contentDescription = "Increase", modifier = Modifier.size(14.dp))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        listOf(StorageLocation.PANTRY, StorageLocation.FRIDGE, StorageLocation.FREEZER).forEach { loc ->
                            val isSelected = selectedLocation == loc
                            FilterChip(
                                selected = isSelected,
                                onClick = { selectedLocation = loc },
                                label = { Text(loc.label, fontSize = 11.sp) },
                                modifier = Modifier.height(30.dp),
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = OceanBlueLight,
                                    selectedLabelColor = OceanBlue
                                )
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Add to My Pantry Button
                Button(
                    onClick = {
                        onAddToPantry(product, pantryQuantity, selectedLocation)
                        isAddedToPantry = true
                    },
                    modifier = Modifier
                        .weight(1.1f)
                        .testTag("scanner_add_to_pantry_button"),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isAddedToPantry) EmeraldGreen else SunsetAmber
                    )
                ) {
                    Icon(
                        imageVector = if (isAddedToPantry) Icons.Default.Check else Icons.Default.Kitchen,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (isAddedToPantry) "In Pantry!" else "+ Pantry",
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }

                // Add to List Button
                Button(
                    onClick = {
                        onAddToList(product)
                        isAddedToList = true
                    },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("scanner_add_to_list_button"),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isAddedToList) EmeraldGreen else OceanBlue
                    )
                ) {
                    Icon(
                        imageVector = if (isAddedToList) Icons.Default.Check else Icons.Default.AddShoppingCart,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = if (isAddedToList) "In List" else "+ List",
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }

                // Log Shelf Tag Button
                OutlinedButton(
                    onClick = { onLogPrice(product) },
                    modifier = Modifier.weight(0.9f),
                    shape = RoundedCornerShape(12.dp),
                    contentPadding = PaddingValues(horizontal = 4.dp),
                    border = BorderStroke(1.dp, OceanBlue)
                ) {
                    Icon(
                        imageVector = Icons.Default.EditNote,
                        contentDescription = null,
                        tint = OceanBlue,
                        modifier = Modifier.size(15.dp)
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Text(
                        text = "Log Tag",
                        fontWeight = FontWeight.Bold,
                        color = OceanBlue,
                        fontSize = 11.5.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            TextButton(
                onClick = onScanNext,
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("scanner_scan_next_button")
            ) {
                Icon(
                    imageVector = Icons.Default.QrCodeScanner,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Scan Another Product",
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
