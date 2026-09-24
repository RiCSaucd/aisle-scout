package com.example.aislescout.ui.screens

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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.aislescout.data.model.ListItem
import com.example.aislescout.data.model.TripPlan
import com.example.aislescout.ui.AisleScoutViewModel
import com.example.aislescout.ui.components.SavingsPill
import com.example.aislescout.ui.components.StoreBadge
import com.example.aislescout.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ListScreen(
    viewModel: AisleScoutViewModel,
    onNavigateToPrices: () -> Unit,
    modifier: Modifier = Modifier
) {
    val listItems by viewModel.listItems.collectAsState()
    val tripPlan by viewModel.tripPlan.collectAsState()

    var showBlenderDialog by remember { mutableStateOf(false) }
    var showOptimizerSheet by remember { mutableStateOf(false) }
    var blenderInputText by remember { mutableStateOf("") }
    var blendFeedback by remember { mutableStateOf<String?>(null) }

    val completedCount = listItems.count { it.checked }
    val progress = if (listItems.isNotEmpty()) completedCount.toFloat() / listItems.size else 0f

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = "Shopping List",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.ExtraBold
                            )
                            if (listItems.isNotEmpty()) {
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(OceanBlueLight)
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = "$completedCount/${listItems.size}",
                                        color = OceanBlue,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                        Text(
                            text = if (listItems.isEmpty()) "Tap + or List Blender to start" else "$completedCount of ${listItems.size} items checked off",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                actions = {
                    // Blender Action Button
                    IconButton(
                        onClick = { showBlenderDialog = true },
                        modifier = Modifier
                            .padding(end = 4.dp)
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(OceanBlueLight)
                    ) {
                        Icon(
                            imageVector = Icons.Default.AutoFixHigh,
                            contentDescription = "List Blender",
                            tint = OceanBlue,
                            modifier = Modifier.size(19.dp)
                        )
                    }

                    if (listItems.any { it.checked }) {
                        IconButton(onClick = { viewModel.clearCompletedList() }) {
                            Icon(
                                imageVector = Icons.Default.DeleteSweep,
                                contentDescription = "Clear Checked",
                                tint = CrimsonRed
                            )
                        }
                    }
                }
            )
        },
        bottomBar = {
            if (listItems.isNotEmpty()) {
                SleekTripOptimizerBar(
                    tripPlan = tripPlan,
                    onOpenOptimizer = { showOptimizerSheet = true }
                )
            }
        },
        modifier = modifier
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            if (listItems.isEmpty()) {
                SleekEmptyListView(
                    onBrowseCatalog = onNavigateToPrices,
                    onOpenBlender = { showBlenderDialog = true }
                )
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(bottom = 120.dp, top = 8.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    // Progress Indicator Bar
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp, vertical = 6.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(6.dp)
                                    .clip(RoundedCornerShape(3.dp))
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth(progress)
                                        .fillMaxHeight()
                                        .clip(RoundedCornerShape(3.dp))
                                        .background(if (progress == 1f) EmeraldGreen else OceanBlue)
                                )
                            }
                        }
                    }

                    items(listItems, key = { it.id }) { item ->
                        SleekListItemRow(
                            item = item,
                            onToggle = { viewModel.toggleListItem(item) },
                            onDelete = { viewModel.deleteListItem(item) }
                        )
                    }
                }
            }
        }
    }

    // List Blender Dialog
    if (showBlenderDialog) {
        AlertDialog(
            onDismissRequest = { showBlenderDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(OceanBlueLight),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.AutoFixHigh, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(18.dp))
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Text("Recipe & List Blender", fontWeight = FontWeight.Bold)
                }
            },
            text = {
                Column {
                    Text(
                        text = "Paste any ingredient list or tap a preset below to instantly populate your grocery basket:",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    // Quick Recipe Presets
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        item {
                            PresetChip("🌮 Taco Night") {
                                blenderInputText = "2 lb ground beef\ntaco shells\ncheddar cheese\nsalsa\navocados\nsour cream"
                            }
                        }
                        item {
                            PresetChip("🥞 Pancake Brunch") {
                                blenderInputText = "pancake mix\nmaple syrup\neggs\nbutter\nbacon\nblueberries"
                            }
                        }
                        item {
                            PresetChip("🥗 Weekly Staples") {
                                blenderInputText = "whole milk\nsourdough bread\nlarge eggs\nbananas\nchicken breast\npeanut butter"
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = blenderInputText,
                        onValueChange = { blenderInputText = it },
                        placeholder = { Text("Example:\n2 cartons of eggs\n1 gal whole milk\n3 bananas\nrao's marinara\navocados") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(130.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = OceanBlue,
                            unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant
                        )
                    )

                    if (blendFeedback != null) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = blendFeedback!!,
                            style = MaterialTheme.typography.labelMedium,
                            color = EmeraldGreen
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (blenderInputText.isNotBlank()) {
                            viewModel.blendRawText(blenderInputText) { count ->
                                blendFeedback = "Added $count items to list!"
                                blenderInputText = ""
                                showBlenderDialog = false
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Blend into List")
                }
            },
            dismissButton = {
                TextButton(onClick = { showBlenderDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Trip Optimizer Bottom Sheet
    if (showOptimizerSheet) {
        ModalBottomSheet(
            onDismissRequest = { showOptimizerSheet = false },
            shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
        ) {
            SleekTripOptimizerContent(
                tripPlan = tripPlan,
                onClose = { showOptimizerSheet = false }
            )
        }
    }
}

@Composable
fun PresetChip(label: String, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(OceanBlueLight.copy(alpha = 0.6f))
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = label,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = OceanBlue
        )
    }
}

@Composable
fun SleekListItemRow(
    item: ListItem,
    onToggle: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (item.checked) MaterialTheme.colorScheme.surface.copy(alpha = 0.65f) else MaterialTheme.colorScheme.surface
        ),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .clickable(onClick = onToggle)
                .padding(horizontal = 12.dp, vertical = 10.dp)
        ) {
            Checkbox(
                checked = item.checked,
                onCheckedChange = { onToggle() },
                colors = CheckboxDefaults.colors(
                    checkedColor = EmeraldGreen,
                    uncheckedColor = MaterialTheme.colorScheme.outline
                )
            )

            Spacer(modifier = Modifier.width(6.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = if (item.checked) FontWeight.Normal else FontWeight.Bold,
                    textDecoration = if (item.checked) TextDecoration.LineThrough else TextDecoration.None,
                    color = if (item.checked) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(2.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = "Qty: ${item.quantity} ${item.unit}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    if (item.preferredStoreId != null) {
                        StoreBadge(storeId = item.preferredStoreId, useOutlineStyle = true)
                    }
                }
            }

            IconButton(
                onClick = onDelete,
                modifier = Modifier.size(32.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Remove",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                    modifier = Modifier.size(17.dp)
                )
            }
        }
    }
}

@Composable
fun SleekEmptyListView(
    onBrowseCatalog: () -> Unit,
    onOpenBlender: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(72.dp)
                    .clip(CircleShape)
                    .background(OceanBlueLight),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.ShoppingBasket,
                    contentDescription = null,
                    tint = OceanBlue,
                    modifier = Modifier.size(36.dp)
                )
            }
            Spacer(modifier = Modifier.height(18.dp))
            Text(
                text = "Your shopping list is empty",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.ExtraBold
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "Add staples from the 32080 Price Book or paste recipes into the List Blender to calculate multi-store savings.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                lineHeight = 20.sp
            )
            Spacer(modifier = Modifier.height(24.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedButton(
                    onClick = onOpenBlender,
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, OceanBlue)
                ) {
                    Icon(Icons.Default.AutoFixHigh, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Recipe Blender", color = OceanBlue, fontWeight = FontWeight.Bold)
                }
                Button(
                    onClick = onBrowseCatalog,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                ) {
                    Icon(Icons.Default.Search, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Price Book", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun SleekTripOptimizerBar(
    tripPlan: TripPlan,
    onOpenOptimizer: () -> Unit
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier
                .clickable(onClick = onOpenOptimizer)
                .padding(horizontal = 18.dp, vertical = 12.dp)
        ) {
            Column {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = "Trip Optimizer",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.ExtraBold
                    )
                    if (tripPlan.splitSavingsVsBestSingle > 0) {
                        SavingsPill(
                            text = "SAVE $${String.format("%.2f", tripPlan.splitSavingsVsBestSingle)}",
                            isGreen = true
                        )
                    }
                }
                val best = tripPlan.bestSingleStore
                if (best != null) {
                    Text(
                        text = "Best 1-Store: ${best.storeName} ($${String.format("%.2f", best.totalCost)})",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Button(
                onClick = onOpenOptimizer,
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
            ) {
                Text("Strategy", fontSize = 12.5.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.width(4.dp))
                Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(14.dp))
            }
        }
    }
}

@Composable
fun SleekTripOptimizerContent(
    tripPlan: TripPlan,
    onClose: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp)
            .padding(bottom = 32.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column {
                Text(
                    text = "Trip Optimization Strategy",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    text = "Comparison of single-stop vs multi-stop shopping in 32080",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            IconButton(onClick = onClose) {
                Icon(Icons.Default.Close, contentDescription = "Close")
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Split Savings Banner
        Card(
            colors = CardDefaults.cardColors(containerColor = EmeraldLight),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(16.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(EmeraldGreen.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Savings,
                        contentDescription = null,
                        tint = EmeraldGreen,
                        modifier = Modifier.size(24.dp)
                    )
                }
                Spacer(modifier = Modifier.width(14.dp))
                Column {
                    Text(
                        text = "Split Trip Total: $${String.format("%.2f", tripPlan.splitTotal)}",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFF065F46)
                    )
                    Text(
                        text = "Saves $${String.format("%.2f", Math.max(0.0, tripPlan.baselineCost - tripPlan.splitTotal))} vs full Publix shelf prices",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFF047857),
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))
        Text(
            text = "One-Store Totals Comparison",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))

        tripPlan.singleStoreQuotes.forEach { quote ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 3.dp),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        StoreBadge(storeId = quote.storeId)
                        Text(
                            text = quote.storeName,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    Text(
                        text = "$${String.format("%.2f", quote.totalCost)}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
            }
        }

        if (tripPlan.splitStops.isNotEmpty()) {
            Spacer(modifier = Modifier.height(18.dp))
            Text(
                text = "Recommended Multi-Stop Itinerary",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))

            tripPlan.splitStops.forEachIndexed { index, stop ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(22.dp)
                                        .clip(CircleShape)
                                        .background(OceanBlueLight),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "${index + 1}",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = OceanBlue
                                    )
                                }
                                StoreBadge(storeId = stop.storeId)
                            }
                            Text(
                                text = "Subtotal: $${String.format("%.2f", stop.subtotal)}",
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.ExtraBold,
                                color = OceanBlue
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        stop.items.forEach { item ->
                            Text(
                                text = "• ${item.productName} (${item.quantity}x @ $${String.format("%.2f", item.unitPrice)})",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}
