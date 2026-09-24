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
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.aislescout.data.model.Product
import com.example.aislescout.data.model.ProductCategory
import com.example.aislescout.data.repository.CatalogData
import com.example.aislescout.ui.AisleScoutViewModel
import com.example.aislescout.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PricesScreen(
    viewModel: AisleScoutViewModel,
    onNavigateToList: () -> Unit,
    onNavigateToScan: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val organicOnly by viewModel.organicOnly.collectAsState()

    val filteredProducts = remember(searchQuery, selectedCategory, organicOnly) {
        CatalogData.products.filter { product ->
            val matchesQuery = searchQuery.isEmpty() ||
                    product.name.contains(searchQuery, ignoreCase = true) ||
                    product.category.displayName.contains(searchQuery, ignoreCase = true)
            val matchesCategory = selectedCategory == null || product.category == selectedCategory
            val matchesOrganic = !organicOnly || product.isOrganic
            matchesQuery && matchesCategory && matchesOrganic
        }
    }

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
                                text = "32080 Price Book",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.ExtraBold
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(OceanBlueLight)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "${filteredProducts.size} items",
                                    color = OceanBlue,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        Text(
                            text = "Audited shelf prices at Aldi, Walmart, Target, Publix",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                actions = {
                    IconButton(
                        onClick = onNavigateToScan,
                        modifier = Modifier.testTag("prices_scan_camera_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.QrCodeScanner,
                            contentDescription = "Scan Item with Camera",
                            tint = OceanBlue
                        )
                    }
                    FilterChip(
                        selected = organicOnly,
                        onClick = { viewModel.toggleOrganicOnly() },
                        label = {
                            Text(
                                text = "Organic",
                                fontSize = 12.sp,
                                fontWeight = if (organicOnly) FontWeight.Bold else FontWeight.Medium
                            )
                        },
                        leadingIcon = if (organicOnly) {
                            { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(14.dp)) }
                        } else null,
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = EmeraldLight,
                            selectedLabelColor = EmeraldGreen,
                            selectedLeadingIconColor = EmeraldGreen
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true,
                            selected = organicOnly,
                            borderColor = if (organicOnly) EmeraldGreen else MaterialTheme.colorScheme.outline
                        ),
                        modifier = Modifier.padding(end = 12.dp)
                    )
                }
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
            // Sleek Search Input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.setSearch(it) },
                placeholder = {
                    Text(
                        text = "Search staple name, brand, or category...",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = OceanBlue,
                        modifier = Modifier.size(20.dp)
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.setSearch("") }) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Clear",
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                },
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = OceanBlue,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant,
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface
                ),
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Category Chips Row with refined pills
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    SleekCategoryFilterChip(
                        label = "All Staples",
                        isSelected = selectedCategory == null,
                        onClick = { viewModel.setCategory(null) }
                    )
                }
                items(ProductCategory.values()) { category ->
                    SleekCategoryFilterChip(
                        label = category.displayName,
                        isSelected = selectedCategory == category,
                        onClick = { viewModel.setCategory(category) }
                    )
                }
            }

            // Products List
            LazyColumn(
                contentPadding = PaddingValues(bottom = 100.dp, top = 4.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                if (filteredProducts.isEmpty()) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(48.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    modifier = Modifier
                                        .size(64.dp)
                                        .clip(CircleShape)
                                        .background(MaterialTheme.colorScheme.surfaceVariant),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.SearchOff,
                                        contentDescription = null,
                                        modifier = Modifier.size(32.dp),
                                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                                Spacer(modifier = Modifier.height(16.dp))
                                Text(
                                    text = "No matching items found",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Try clearing your search query or filters",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Spacer(modifier = Modifier.height(14.dp))
                                Button(
                                    onClick = {
                                        viewModel.setSearch("")
                                        viewModel.setCategory(null)
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Text("Reset Filters")
                                }
                            }
                        }
                    }
                } else {
                    items(filteredProducts, key = { it.id }) { product ->
                        FeaturedProductRow(
                            product = product,
                            onAddToList = {
                                viewModel.addToList(product.id, product.name, unit = product.unit.label)
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun SleekCategoryFilterChip(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val bgColor = if (isSelected) OceanBlue else MaterialTheme.colorScheme.surface
    val textColor = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
    val borderStroke = if (isSelected) null else BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(bgColor)
            .then(
                if (borderStroke != null) Modifier.border(borderStroke, RoundedCornerShape(20.dp))
                else Modifier
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 7.dp)
    ) {
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.Medium,
            color = textColor
        )
    }
}
