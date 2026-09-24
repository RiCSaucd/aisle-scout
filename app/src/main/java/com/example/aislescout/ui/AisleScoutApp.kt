package com.example.aislescout.ui

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.aislescout.ui.screens.*
import com.example.aislescout.ui.theme.OceanBlue
import com.example.aislescout.ui.theme.OceanBlueLight

enum class AppTab(val label: String, val selectedIcon: ImageVector, val unselectedIcon: ImageVector) {
    HOME("Home", Icons.Filled.Storefront, Icons.Outlined.Storefront),
    PRICES("Prices", Icons.Filled.FormatListNumbered, Icons.Outlined.FormatListNumbered),
    DEALS("Deals", Icons.Filled.LocalOffer, Icons.Outlined.LocalOffer),
    LIST("List", Icons.Filled.ShoppingCart, Icons.Outlined.ShoppingCart),
    PANTRY("My Pantry", Icons.Filled.Kitchen, Icons.Outlined.Kitchen)
}

enum class SubScreen {
    NONE, SCAN, STORES, FARMS, SHIP
}

@Composable
fun AisleScoutApp(
    viewModel: AisleScoutViewModel = viewModel()
) {
    var currentTab by remember { mutableStateOf(AppTab.HOME) }
    var currentSubScreen by remember { mutableStateOf(SubScreen.NONE) }
    var isScanningForPantry by remember { mutableStateOf(false) }

    val listItems by viewModel.listItems.collectAsState()
    val clippedDeals by viewModel.clippedDeals.collectAsState()
    val inventoryItems by viewModel.inventoryItems.collectAsState()

    val now = System.currentTimeMillis()
    val expiringCount = remember(inventoryItems) {
        inventoryItems.count {
            val days = (it.expiryDate - now) / (1000 * 60 * 60 * 24)
            days in 0..3
        }
    }

    when (currentSubScreen) {
        SubScreen.SCAN -> ScanScreen(
            viewModel = viewModel,
            onBack = { currentSubScreen = SubScreen.NONE },
            isPantryMode = isScanningForPantry,
            modifier = Modifier.fillMaxSize()
        )
        SubScreen.STORES -> StoresScreen(onBack = { currentSubScreen = SubScreen.NONE })
        SubScreen.FARMS -> FarmsScreen(onBack = { currentSubScreen = SubScreen.NONE })
        SubScreen.SHIP -> ShipScreen(onBack = { currentSubScreen = SubScreen.NONE })
        SubScreen.NONE -> {
            Scaffold(
                bottomBar = {
                    NavigationBar(
                        containerColor = MaterialTheme.colorScheme.surface,
                        tonalElevation = 6.dp,
                        modifier = Modifier.navigationBarsPadding()
                    ) {
                        AppTab.values().forEach { tab ->
                            val isSelected = currentTab == tab
                            NavigationBarItem(
                                selected = isSelected,
                                onClick = { currentTab = tab },
                                icon = {
                                    BadgedBox(
                                        badge = {
                                            if (tab == AppTab.LIST && listItems.isNotEmpty()) {
                                                Badge(
                                                    containerColor = OceanBlue,
                                                    contentColor = MaterialTheme.colorScheme.onPrimary
                                                ) {
                                                    Text(
                                                        text = "${listItems.size}",
                                                        fontSize = 10.sp,
                                                        fontWeight = FontWeight.Bold
                                                    )
                                                }
                                            } else if (tab == AppTab.DEALS && clippedDeals.isNotEmpty()) {
                                                Badge(
                                                    containerColor = OceanBlue,
                                                    contentColor = MaterialTheme.colorScheme.onPrimary
                                                ) {
                                                    Text(
                                                        text = "${clippedDeals.size}",
                                                        fontSize = 10.sp,
                                                        fontWeight = FontWeight.Bold
                                                    )
                                                }
                                            } else if (tab == AppTab.PANTRY && expiringCount > 0) {
                                                Badge(
                                                    containerColor = CoralOrange,
                                                    contentColor = Color.White
                                                ) {
                                                    Text(
                                                        text = "$expiringCount",
                                                        fontSize = 10.sp,
                                                        fontWeight = FontWeight.Bold
                                                    )
                                                }
                                            }
                                        }
                                    ) {
                                        Icon(
                                            imageVector = if (isSelected) tab.selectedIcon else tab.unselectedIcon,
                                            contentDescription = tab.label,
                                            modifier = Modifier.size(24.dp)
                                        )
                                    }
                                },
                                label = {
                                    Text(
                                        text = tab.label,
                                        style = MaterialTheme.typography.labelSmall,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                    )
                                },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = OceanBlue,
                                    selectedTextColor = OceanBlue,
                                    indicatorColor = OceanBlue.copy(alpha = 0.12f),
                                    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                                    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            )
                        }
                    }
                }
            ) { innerPadding ->
                val modifier = Modifier.padding(innerPadding)
                when (currentTab) {
                    AppTab.HOME -> HomeScreen(
                        viewModel = viewModel,
                        onNavigateToPrices = { currentTab = AppTab.PRICES },
                        onNavigateToList = { currentTab = AppTab.LIST },
                        onNavigateToDeals = { currentTab = AppTab.DEALS },
                        onNavigateToScan = {
                            isScanningForPantry = false
                            currentSubScreen = SubScreen.SCAN
                        },
                        onNavigateToFarms = { currentSubScreen = SubScreen.FARMS },
                        onNavigateToShip = { currentSubScreen = SubScreen.SHIP },
                        onNavigateToPantry = { currentTab = AppTab.PANTRY },
                        modifier = modifier
                    )
                    AppTab.PRICES -> PricesScreen(
                        viewModel = viewModel,
                        onNavigateToList = { currentTab = AppTab.LIST },
                        onNavigateToScan = {
                            isScanningForPantry = false
                            currentSubScreen = SubScreen.SCAN
                        },
                        modifier = modifier
                    )
                    AppTab.DEALS -> DealsScreen(
                        viewModel = viewModel,
                        onNavigateToList = { currentTab = AppTab.LIST },
                        modifier = modifier
                    )
                    AppTab.LIST -> ListScreen(
                        viewModel = viewModel,
                        onNavigateToPrices = { currentTab = AppTab.PRICES },
                        modifier = modifier
                    )
                    AppTab.PANTRY -> PantryScreen(
                        viewModel = viewModel,
                        onNavigateToList = { currentTab = AppTab.LIST },
                        onNavigateToScan = {
                            isScanningForPantry = true
                            currentSubScreen = SubScreen.SCAN
                        },
                        modifier = modifier
                    )
                }
            }
        }
    }
}

