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
import androidx.compose.material.icons.outlined.BookmarkBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.aislescout.data.model.Promotion
import com.example.aislescout.data.model.PromotionKind
import com.example.aislescout.data.repository.CatalogData
import com.example.aislescout.data.repository.PromotionData
import com.example.aislescout.ui.AisleScoutViewModel
import com.example.aislescout.ui.components.StoreBadge
import com.example.aislescout.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DealsScreen(
    viewModel: AisleScoutViewModel,
    onNavigateToList: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var selectedKind by remember { mutableStateOf<PromotionKind?>(null) }
    val clippedDeals by viewModel.clippedDeals.collectAsState()

    val filteredPromotions = remember(selectedKind) {
        PromotionData.promotions.filter { promo ->
            selectedKind == null || promo.kind == selectedKind
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
                                text = "Weekly Circular Deals",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.ExtraBold
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(CrimsonLight)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "${filteredPromotions.size} active",
                                    color = CrimsonRed,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        Text(
                            text = "Publix BOGOs, Target Circle, Walmart Rollbacks, Aldi Finds",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
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
            // Deal Kind Filter Row
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    SleekCategoryFilterChip(
                        label = "All Circulars",
                        isSelected = selectedKind == null,
                        onClick = { selectedKind = null }
                    )
                }
                items(PromotionKind.values()) { kind ->
                    SleekCategoryFilterChip(
                        label = kind.badgeText,
                        isSelected = selectedKind == kind,
                        onClick = { selectedKind = kind }
                    )
                }
            }

            // Deals List
            LazyColumn(
                contentPadding = PaddingValues(bottom = 100.dp, top = 4.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredPromotions, key = { it.id }) { promo ->
                    val isClipped = clippedDeals.contains(promo.id)
                    SleekDealCard(
                        promo = promo,
                        isClipped = isClipped,
                        onToggleClip = { viewModel.toggleDeal(promo.id) },
                        onAddToList = {
                            val product = CatalogData.getById(promo.productId)
                            viewModel.addToList(
                                productId = promo.productId,
                                name = promo.title,
                                storeId = promo.storeId,
                                unit = product?.unit?.label ?: "ea"
                            )
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun SleekDealCard(
    promo: Promotion,
    isClipped: Boolean,
    onToggleClip: () -> Unit,
    onAddToList: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 5.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(
            1.dp,
            if (isClipped) EmeraldGreen.copy(alpha = 0.5f) else MaterialTheme.colorScheme.outlineVariant
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
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
                            fontSize = 9.5.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                    }
                }

                if (promo.validUntil.isNotEmpty()) {
                    Text(
                        text = "Thru ${promo.validUntil}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = promo.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(3.dp))
            Text(
                text = promo.description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 17.sp
            )

            Spacer(modifier = Modifier.height(14.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column {
                    if (promo.promoPrice != null) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = "$${String.format("%.2f", promo.promoPrice)}",
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.ExtraBold,
                                color = EmeraldGreen
                            )
                            if (promo.regularPrice != null) {
                                Text(
                                    text = "$${String.format("%.2f", promo.regularPrice)}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    textDecoration = androidx.compose.ui.text.style.TextDecoration.LineThrough
                                )
                            }
                        }
                    } else {
                        Text(
                            text = "BOGO FREE",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.ExtraBold,
                            color = EmeraldGreen
                        )
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(
                        onClick = onToggleClip,
                        shape = RoundedCornerShape(10.dp),
                        border = BorderStroke(
                            1.dp,
                            if (isClipped) EmeraldGreen else MaterialTheme.colorScheme.outlineVariant
                        ),
                        colors = if (isClipped) ButtonDefaults.outlinedButtonColors(
                            containerColor = EmeraldLight
                        ) else ButtonDefaults.outlinedButtonColors()
                    ) {
                        Icon(
                            imageVector = if (isClipped) Icons.Default.Bookmark else Icons.Outlined.BookmarkBorder,
                            contentDescription = null,
                            tint = if (isClipped) EmeraldGreen else MaterialTheme.colorScheme.onSurface,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isClipped) "Saved" else "Clip",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isClipped) EmeraldGreen else MaterialTheme.colorScheme.onSurface
                        )
                    }

                    Button(
                        onClick = onAddToList,
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = OceanBlue)
                    ) {
                        Icon(
                            imageVector = Icons.Default.AddShoppingCart,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "Add", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
