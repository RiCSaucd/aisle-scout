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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.aislescout.data.model.Product
import com.example.aislescout.data.repository.CatalogData
import com.example.aislescout.data.repository.PromotionData
import com.example.aislescout.domain.PricingEngine
import com.example.aislescout.ui.AisleScoutViewModel
import com.example.aislescout.ui.components.SavingsPill
import com.example.aislescout.ui.components.StoreBadge
import com.example.aislescout.ui.theme.*

@Composable
fun HomeScreen(
    viewModel: AisleScoutViewModel,
    onNavigateToPrices: () -> Unit,
    onNavigateToList: () -> Unit,
    onNavigateToDeals: () -> Unit,
    onNavigateToScan: () -> Unit,
    onNavigateToFarms: () -> Unit,
    onNavigateToShip: () -> Unit,
    onNavigateToPantry: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val storeWins by viewModel.storeWins.collectAsState()
    val clippedDeals by viewModel.clippedDeals.collectAsState()
    val listItems by viewModel.listItems.collectAsState()
    val inventoryItems by viewModel.inventoryItems.collectAsState()

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(bottom = 100.dp)
    ) {
        // Sleek Premium Hero Header
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                DeepNavy,
                                Color(0xFF0D234A),
                                Color(0xFF0F367A)
                            )
                        )
                    )
                    .statusBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 22.dp)
            ) {
                Column {
                    // Top Bar: Location & Shopping List Pill
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
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(EmeraldGreen)
                            )
                            Text(
                                text = "ST. AUGUSTINE BEACH • 32080",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.ExtraBold,
                                letterSpacing = 1.2.sp,
                                color = Color.White.copy(alpha = 0.9f)
                            )
                        }

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            // Camera scanner quick button
                            IconButton(
                                onClick = onNavigateToScan,
                                modifier = Modifier
                                    .size(34.dp)
                                    .clip(CircleShape)
                                    .background(Color.White.copy(alpha = 0.15f))
                                    .border(BorderStroke(1.dp, Color.White.copy(alpha = 0.25f)), CircleShape)
                                    .testTag("home_camera_scan_button")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.QrCodeScanner,
                                    contentDescription = "Camera Scanner",
                                    tint = Color.White,
                                    modifier = Modifier.size(17.dp)
                                )
                            }

                            // Shopping list quick pill
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .clip(RoundedCornerShape(20.dp))
                                    .background(Color.White.copy(alpha = 0.15f))
                                    .border(BorderStroke(1.dp, Color.White.copy(alpha = 0.25f)), RoundedCornerShape(20.dp))
                                    .clickable(onClick = onNavigateToList)
                                    .padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.ShoppingCart,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(15.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "${listItems.size} in list",
                                    color = Color.White,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Aisle Scout",
                        style = MaterialTheme.typography.displayLarge,
                        color = Color.White,
                        fontWeight = FontWeight.ExtraBold
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Live shelf prices & BOGO deals compared across Aldi, Walmart, Target, Publix, and farm stands.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.White.copy(alpha = 0.85f),
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    // Embedded Quick Search Bar (Tappable into Price Book)
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color.White)
                            .clickable(onClick = onNavigateToPrices)
                            .padding(horizontal = 16.dp, vertical = 13.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = null,
                            tint = TextSecondary,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Search 52+ staple prices in 32080...",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary,
                            modifier = Modifier.weight(1f)
                        )
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(OceanBlueLight)
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "PRICE BOOK",
                                color = OceanBlue,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // 3 Sleek Key Metrics Cards
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        MetricCard(
                            label = "AVG TRIP SAVINGS",
                            value = "$14.80",
                            subtext = "Multi-stop vs 1 store",
                            valueColor = EmeraldGreen,
                            modifier = Modifier.weight(1f)
                        )
                        MetricCard(
                            label = "LOWEST PRICES",
                            value = "Aldi #1",
                            subtext = "45% staple wins",
                            valueColor = CoastalCyan,
                            modifier = Modifier.weight(1f)
                        )
                        MetricCard(
                            label = "ACTIVE BOGOS",
                            value = "12 Deals",
                            subtext = "Publix & Target",
                            valueColor = SunburstYellow,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // Quick Navigation Action Pills
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                item {
                    SleekActionPill(
                        label = "My Pantry",
                        icon = Icons.Default.Kitchen,
                        color = OceanBlue,
                        badgeText = if (inventoryItems.isNotEmpty()) "${inventoryItems.size}" else null,
                        onClick = onNavigateToPantry
                    )
                }
                item {
                    SleekActionPill(
                        label = "Scan Shelf Tag",
                        icon = Icons.Default.QrCodeScanner,
                        color = CoralOrange,
                        onClick = onNavigateToScan
                    )
                }
                item {
                    SleekActionPill(
                        label = "Weekly BOGOs",
                        icon = Icons.Default.LocalOffer,
                        color = CrimsonRed,
                        badgeText = "NEW",
                        onClick = onNavigateToDeals
                    )
                }
                item {
                    SleekActionPill(
                        label = "Farm Stands",
                        icon = Icons.Default.Agriculture,
                        color = EmeraldGreen,
                        onClick = onNavigateToFarms
                    )
                }
                item {
                    SleekActionPill(
                        label = "Delivery Rates",
                        icon = Icons.Default.LocalShipping,
                        color = AldiBlue,
                        onClick = onNavigateToShip
                    )
                }
            }
        }

        // Store Win Rate Leaderboard
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 6.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Leaderboard,
                                    contentDescription = null,
                                    tint = OceanBlue,
                                    modifier = Modifier.size(18.dp)
                                )
                                Text(
                                    text = "32080 Store Leaderboard",
                                    style = MaterialTheme.typography.titleLarge,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "Percentage of grocery staples with lowest shelf tag",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    storeWins.forEachIndexed { index, win ->
                        val barColor = when (win.storeId) {
                            "aldi" -> AldiBlue
                            "walmart" -> WalmartBlue
                            "target" -> TargetRed
                            "publix_beach" -> PublixGreen
                            else -> OceanBlue
                        }
                        val rankLabel = when (index) {
                            0 -> "1st"
                            1 -> "2nd"
                            2 -> "3rd"
                            else -> "${index + 1}th"
                        }

                        Column(modifier = Modifier.padding(vertical = 6.dp)) {
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
                                            .size(24.dp)
                                            .clip(CircleShape)
                                            .background(
                                                if (index == 0) SunburstYellow.copy(alpha = 0.2f)
                                                else MaterialTheme.colorScheme.surfaceVariant
                                            ),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = rankLabel,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.ExtraBold,
                                            color = if (index == 0) Color(0xFFB45309) else MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                    StoreBadge(storeId = win.storeId)
                                    Text(
                                        text = win.storeName,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }

                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Text(
                                        text = "${win.winPercentage}%",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = barColor
                                    )
                                    Text(
                                        text = "(${win.winCount} items)",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth(win.winPercentage / 100f)
                                        .fillMaxHeight()
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(barColor)
                                )
                            }
                        }
                    }
                }
            }
        }

        // Active Promotions Carousel
        item {
            Spacer(modifier = Modifier.height(14.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 18.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.LocalOffer,
                        contentDescription = null,
                        tint = CrimsonRed,
                        modifier = Modifier.size(18.dp)
                    )
                    Text(
                        text = "Weekly Circular Deals",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                }
                Text(
                    text = "See all (${PromotionData.promotions.size})",
                    style = MaterialTheme.typography.labelLarge,
                    color = OceanBlue,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable(onClick = onNavigateToDeals)
                )
            }
            Spacer(modifier = Modifier.height(10.dp))

            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(PromotionData.promotions.take(6)) { promo ->
                    val isClipped = clippedDeals.contains(promo.id)
                    Card(
                        modifier = Modifier
                            .width(230.dp)
                            .clip(RoundedCornerShape(18.dp)),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                StoreBadge(storeId = promo.storeId)
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(CrimsonLight)
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = promo.kind.badgeText,
                                        color = CrimsonRed,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.ExtraBold
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = promo.title,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                maxLines = 2
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = promo.description,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                maxLines = 2,
                                lineHeight = 16.sp
                            )

                            Spacer(modifier = Modifier.height(12.dp))
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                if (promo.promoPrice != null) {
                                    Text(
                                        text = "$${String.format("%.2f", promo.promoPrice)}",
                                        style = MaterialTheme.typography.titleLarge,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = EmeraldGreen
                                    )
                                } else {
                                    Text(
                                        text = "BOGO FREE",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = EmeraldGreen
                                    )
                                }

                                IconButton(
                                    onClick = { viewModel.toggleDeal(promo.id) },
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                        .background(if (isClipped) EmeraldLight else MaterialTheme.colorScheme.surfaceVariant)
                                ) {
                                    Icon(
                                        imageVector = if (isClipped) Icons.Default.Bookmark else Icons.Outlined.BookmarkBorder,
                                        contentDescription = "Clip Deal",
                                        tint = if (isClipped) EmeraldGreen else MaterialTheme.colorScheme.onSurfaceVariant,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Staple Grocery Price Comparison
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 18.dp)
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ShoppingBag,
                            contentDescription = null,
                            tint = OceanBlue,
                            modifier = Modifier.size(18.dp)
                        )
                        Text(
                            text = "Everyday Staple Price Book",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Real-time shelf tag audit across 32080 grocery stores",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Text(
                    text = "View All",
                    style = MaterialTheme.typography.labelLarge,
                    color = OceanBlue,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable(onClick = onNavigateToPrices)
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
        }

        items(CatalogData.products.take(10)) { product ->
            FeaturedProductRow(
                product = product,
                onAddToList = {
                    viewModel.addToList(product.id, product.name, unit = product.unit.label)
                }
            )
        }
    }
}

@Composable
fun MetricCard(
    label: String,
    value: String,
    subtext: String,
    valueColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .background(Color.White.copy(alpha = 0.10f))
            .border(BorderStroke(1.dp, Color.White.copy(alpha = 0.15f)), RoundedCornerShape(14.dp))
            .padding(vertical = 10.dp, horizontal = 10.dp)
    ) {
        Column {
            Text(
                text = label,
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 0.6.sp,
                color = Color.White.copy(alpha = 0.7f)
            )
            Spacer(modifier = Modifier.height(3.dp))
            Text(
                text = value,
                fontSize = 15.sp,
                fontWeight = FontWeight.ExtraBold,
                color = valueColor
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtext,
                fontSize = 9.sp,
                color = Color.White.copy(alpha = 0.75f),
                maxLines = 1
            )
        }
    }
}

@Composable
fun SleekActionPill(
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    badgeText: String? = null,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .clip(RoundedCornerShape(14.dp))
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(30.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(color.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = color,
                    modifier = Modifier.size(17.dp)
                )
            }
            Spacer(modifier = Modifier.width(10.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Bold
            )
            if (badgeText != null) {
                Spacer(modifier = Modifier.width(6.dp))
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(CrimsonRed)
                        .padding(horizontal = 4.dp, vertical = 1.dp)
                ) {
                    Text(
                        text = badgeText,
                        color = Color.White,
                        fontSize = 8.5.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
            }
        }
    }
}

@Composable
fun FeaturedProductRow(
    product: Product,
    onAddToList: () -> Unit
) {
    val aldi = product.prices["aldi"]
    val walmart = product.prices["walmart"]
    val target = product.prices["target"]
    val publix = product.prices["publix_beach"]

    val cheapest = PricingEngine.getCheapestStoreForProduct(product.id)

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 5.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(
                            text = product.name,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        if (product.isOrganic) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(EmeraldLight)
                                    .padding(horizontal = 5.dp, vertical = 1.5.dp)
                            ) {
                                Text(
                                    text = "ORGANIC",
                                    color = EmeraldGreen,
                                    fontSize = 8.5.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "${product.sizeLabel} • ${product.category.displayName}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                IconButton(
                    onClick = onAddToList,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(OceanBlueLight)
                ) {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = "Add to List",
                        tint = OceanBlue,
                        modifier = Modifier.size(19.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // 4 Store Comparison Grid with sleek highlighted best price cell
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                    .padding(horizontal = 6.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                SleekStorePriceColumn("Aldi", aldi, cheapest?.first == "aldi", modifier = Modifier.weight(1f))
                SleekStorePriceColumn("Walmart", walmart, cheapest?.first == "walmart", modifier = Modifier.weight(1f))
                SleekStorePriceColumn("Target", target, cheapest?.first == "target", modifier = Modifier.weight(1f))
                SleekStorePriceColumn("Publix", publix, cheapest?.first?.startsWith("publix") == true, modifier = Modifier.weight(1f))
            }
        }
    }
}

@Composable
fun SleekStorePriceColumn(
    storeName: String,
    price: Double?,
    isLowest: Boolean,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(if (isLowest) EmeraldLight.copy(alpha = 0.7f) else Color.Transparent)
            .padding(vertical = 4.dp, horizontal = 2.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = storeName,
                    fontSize = 11.sp,
                    fontWeight = if (isLowest) FontWeight.Bold else FontWeight.Medium,
                    color = if (isLowest) EmeraldGreen else MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (isLowest) {
                    Spacer(modifier = Modifier.width(3.dp))
                    Box(
                        modifier = Modifier
                            .size(5.dp)
                            .clip(CircleShape)
                            .background(EmeraldGreen)
                    )
                }
            }
            Spacer(modifier = Modifier.height(2.dp))
            if (price != null) {
                Text(
                    text = "$${String.format("%.2f", price)}",
                    fontSize = 13.5.sp,
                    fontWeight = if (isLowest) FontWeight.ExtraBold else FontWeight.SemiBold,
                    color = if (isLowest) Color(0xFF047857) else MaterialTheme.colorScheme.onSurface
                )
            } else {
                Text(
                    text = "—",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
