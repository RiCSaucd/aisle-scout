package com.example.aislescout.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.example.aislescout.data.model.Product
import com.example.aislescout.data.repository.CatalogData
import com.example.aislescout.data.repository.StoreData
import com.example.aislescout.ui.AisleScoutViewModel
import com.example.aislescout.ui.components.StoreBadge
import com.example.aislescout.ui.scanner.BarcodeAnalyzer
import com.example.aislescout.ui.scanner.CameraPreviewView
import com.example.aislescout.ui.scanner.ProductLookupSheet
import com.example.aislescout.ui.scanner.ScannerOverlay
import com.example.aislescout.ui.theme.*

enum class ScannerTab {
    CAMERA, LOG_PRICE
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScanScreen(
    viewModel: AisleScoutViewModel,
    onBack: () -> Unit = {},
    isPantryMode: Boolean = false,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val priceLogs by viewModel.priceLogs.collectAsState()

    var activeTab by remember { mutableStateOf(ScannerTab.CAMERA) }

    // Camera Permission State
    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        )
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        hasCameraPermission = isGranted
    }

    // Camera Controls
    var isTorchOn by remember { mutableStateOf(false) }
    var lensFacing by remember { mutableStateOf(CameraSelector.LENS_FACING_BACK) }
    var cameraError by remember { mutableStateOf<String?>(null) }

    // Scanned Product State
    var identifiedProduct by remember { mutableStateOf<Product?>(null) }
    var currentScannedBarcode by remember { mutableStateOf("") }
    var statusMessage by remember { mutableStateOf("Align barcode or item inside frame") }
    var showManualSearch by remember { mutableStateOf(false) }
    var manualSearchQuery by remember { mutableStateOf("") }

    // Price Logger Form State
    var selectedStoreId by remember { mutableStateOf("publix_beach") }
    var selectedProductId by remember { mutableStateOf("bananas") }
    var shelfPriceInput by remember { mutableStateOf("") }
    var userBarcode by remember { mutableStateOf("011110852445") }
    var notesInput by remember { mutableStateOf("") }
    var showSuccessBanner by remember { mutableStateOf(false) }

    // Create Barcode Analyzer
    val analyzer = remember {
        BarcodeAnalyzer { barcode ->
            currentScannedBarcode = barcode
            val matched = CatalogData.findByBarcode(barcode)
            if (matched != null) {
                identifiedProduct = matched
                statusMessage = "Found: ${matched.name}"
            } else {
                statusMessage = "Barcode $barcode: Searching catalog..."
                val searchResults = CatalogData.search(barcode)
                if (searchResults.isNotEmpty()) {
                    identifiedProduct = searchResults.first()
                    statusMessage = "Matched: ${identifiedProduct?.name}"
                } else {
                    statusMessage = "Barcode $barcode not yet in catalog"
                }
            }
        }
    }

    // Update analyzer scanning flag
    LaunchedEffect(identifiedProduct) {
        analyzer.isScanning = (identifiedProduct == null)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                navigationIcon = {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier.testTag("scanner_back_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                },
                title = {
                    Column {
                        Text(
                            text = if (isPantryMode && activeTab == ScannerTab.CAMERA) {
                                "Scan to My Pantry"
                            } else if (activeTab == ScannerTab.CAMERA) {
                                "Camera Product Scanner"
                            } else {
                                "Shelf Tag Logger"
                            },
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            text = if (isPantryMode && activeTab == ScannerTab.CAMERA) {
                                "Scan barcodes to stock your home pantry & fridge"
                            } else if (activeTab == ScannerTab.CAMERA) {
                                "Scan barcode to look up 32080 prices"
                            } else {
                                "Log real in-store shelf tags in 32080"
                            },
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(
                        onClick = { showManualSearch = !showManualSearch },
                        modifier = Modifier.testTag("scanner_search_toggle")
                    ) {
                        Icon(
                            imageVector = if (showManualSearch) Icons.Default.Close else Icons.Default.Search,
                            contentDescription = "Manual Search"
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
            // Mode Selector Tabs (Camera vs Shelf Logger)
            PrimaryTabRow(
                selectedTabIndex = activeTab.ordinal,
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = OceanBlue
            ) {
                Tab(
                    selected = activeTab == ScannerTab.CAMERA,
                    onClick = { activeTab = ScannerTab.CAMERA },
                    text = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.PhotoCamera, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Camera Scanner", fontWeight = FontWeight.Bold)
                        }
                    }
                )
                Tab(
                    selected = activeTab == ScannerTab.LOG_PRICE,
                    onClick = { activeTab = ScannerTab.LOG_PRICE },
                    text = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.EditNote, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Shelf Tag Log", fontWeight = FontWeight.Bold)
                        }
                    }
                )
            }

            // Manual Search Bar overlay if toggled
            AnimatedVisibility(visible = showManualSearch) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, OceanBlue.copy(alpha = 0.3f))
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        OutlinedTextField(
                            value = manualSearchQuery,
                            onValueChange = { manualSearchQuery = it },
                            placeholder = { Text("Search by name, UPC, or category...") },
                            singleLine = true,
                            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = OceanBlue) },
                            trailingIcon = {
                                if (manualSearchQuery.isNotEmpty()) {
                                    IconButton(onClick = { manualSearchQuery = "" }) {
                                        Icon(Icons.Default.Clear, contentDescription = "Clear")
                                    }
                                }
                            },
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("scanner_manual_search_input")
                        )

                        if (manualSearchQuery.isNotBlank()) {
                            val matches = CatalogData.search(manualSearchQuery)
                            Spacer(modifier = Modifier.height(8.dp))
                            if (matches.isEmpty()) {
                                Text(
                                    text = "No catalog items matching '$manualSearchQuery'",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            } else {
                                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                    matches.take(4).forEach { item ->
                                        Row(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clip(RoundedCornerShape(8.dp))
                                                .clickable {
                                                    identifiedProduct = item
                                                    currentScannedBarcode = item.barcode
                                                    showManualSearch = false
                                                }
                                                .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
                                                .padding(horizontal = 10.dp, vertical = 8.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Column {
                                                Text(item.name, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                                Text("UPC: ${item.barcode} • ${item.sizeLabel}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                            }
                                            Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            when (activeTab) {
                ScannerTab.CAMERA -> {
                    Box(modifier = Modifier.fillMaxSize()) {
                        if (!hasCameraPermission) {
                            // Camera Permission Request Screen
                            CameraPermissionCard(
                                onRequestPermission = {
                                    permissionLauncher.launch(Manifest.permission.CAMERA)
                                },
                                onSelectSample = { product ->
                                    identifiedProduct = product
                                    currentScannedBarcode = product.barcode
                                },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp)
                            )
                        } else {
                            // Live CameraX View & Scanner Overlay
                            Box(modifier = Modifier.fillMaxSize()) {
                                CameraPreviewView(
                                    analyzer = analyzer,
                                    isTorchOn = isTorchOn,
                                    lensFacing = lensFacing,
                                    onError = { err ->
                                        cameraError = err
                                    },
                                    modifier = Modifier.fillMaxSize()
                                )

                                ScannerOverlay(
                                    isTorchOn = isTorchOn,
                                    onToggleTorch = { isTorchOn = !isTorchOn },
                                    onFlipCamera = {
                                        lensFacing = if (lensFacing == CameraSelector.LENS_FACING_BACK) {
                                            CameraSelector.LENS_FACING_FRONT
                                        } else {
                                            CameraSelector.LENS_FACING_BACK
                                        }
                                    },
                                    statusText = statusMessage,
                                    modifier = Modifier.fillMaxSize()
                                )

                                // Interactive Quick-Scan Product Tester Bar at bottom
                                Column(
                                    modifier = Modifier
                                        .align(Alignment.BottomCenter)
                                        .fillMaxWidth()
                                        .background(
                                            Brush.verticalGradient(
                                                colors = listOf(
                                                    Color.Transparent,
                                                    Color.Black.copy(alpha = 0.85f),
                                                    Color.Black
                                                )
                                            )
                                        )
                                        .padding(horizontal = 16.dp, vertical = 14.dp)
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Text(
                                            text = "QUICK TEST BARCODES (SIMULATION)",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.ExtraBold,
                                            color = Color.White.copy(alpha = 0.8f),
                                            letterSpacing = 0.5.sp
                                        )
                                        Text(
                                            text = "Tap to identify",
                                            fontSize = 11.sp,
                                            color = EmeraldGreen,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }

                                    Spacer(modifier = Modifier.height(8.dp))

                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .horizontalScroll(rememberScrollState())
                                    ) {
                                        val testProducts = listOf(
                                            "milk_whole_gal" to "🥛 Whole Milk",
                                            "eggs_large_white_doz" to "🥚 White Eggs",
                                            "bananas" to "🍌 Bananas",
                                            "raos_marinara_24oz" to "🍝 Rao's Marinara",
                                            "artisan_sourdough_loaf" to "🍞 Sourdough",
                                            "avocados_haas_each" to "🥑 Hass Avocados",
                                            "chicken_breast_boneless" to "🍗 Chicken",
                                            "digiorno_frozen_pizza" to "🍕 DiGiorno",
                                            "strawberries" to "🍓 Strawberries",
                                            "tillamook_cheddar_chunk" to "🧀 Cheddar"
                                        )

                                        testProducts.forEach { (id, label) ->
                                            val p = CatalogData.getById(id)
                                            Button(
                                                onClick = {
                                                    if (p != null) {
                                                        currentScannedBarcode = p.barcode
                                                        identifiedProduct = p
                                                        statusMessage = "Scanned: ${p.name}"
                                                    }
                                                },
                                                colors = ButtonDefaults.buttonColors(
                                                    containerColor = Color.White.copy(alpha = 0.15f),
                                                    contentColor = Color.White
                                                ),
                                                shape = RoundedCornerShape(20.dp),
                                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                                border = BorderStroke(1.dp, Color.White.copy(alpha = 0.3f)),
                                                modifier = Modifier.testTag("test_scan_chip_$id")
                                            ) {
                                                Text(label, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // Product Lookup Bottom Sheet Overlay
                        AnimatedVisibility(
                            visible = identifiedProduct != null,
                            enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
                            exit = slideOutVertically(targetOffsetY = { it }) + fadeOut(),
                            modifier = Modifier.align(Alignment.BottomCenter)
                        ) {
                            identifiedProduct?.let { product ->
                                ProductLookupSheet(
                                    product = product,
                                    scannedBarcode = currentScannedBarcode,
                                    onAddToList = { p ->
                                        viewModel.addToList(
                                            productId = p.id,
                                            name = p.name,
                                            quantity = 1,
                                            unit = p.sizeLabel
                                        )
                                    },
                                    onAddToPantry = { p, qty, loc ->
                                        viewModel.addProductToPantry(
                                            product = p,
                                            quantity = qty,
                                            customLocation = loc,
                                            barcode = currentScannedBarcode.ifBlank { p.barcode }
                                        )
                                        statusMessage = "Added ${p.name} ($qty) to ${loc.label}!"
                                    },
                                    onLogPrice = { p ->
                                        selectedProductId = p.id
                                        userBarcode = p.barcode
                                        activeTab = ScannerTab.LOG_PRICE
                                        identifiedProduct = null
                                    },
                                    onScanNext = {
                                        identifiedProduct = null
                                        currentScannedBarcode = ""
                                        analyzer.isScanning = true
                                        statusMessage = "Align barcode or item inside frame"
                                    },
                                    onDismiss = {
                                        identifiedProduct = null
                                        analyzer.isScanning = true
                                    },
                                    isPantryPriority = isPantryMode
                                )
                            }
                        }
                    }
                }

                ScannerTab.LOG_PRICE -> {
                    // Shelf Tag Logger Form
                    val selectedProduct = CatalogData.getById(selectedProductId)

                    LazyColumn(
                        contentPadding = PaddingValues(bottom = 96.dp, top = 8.dp),
                        modifier = Modifier
                            .fillMaxSize()
                            .background(MaterialTheme.colorScheme.background)
                    ) {
                        item {
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 16.dp, vertical = 6.dp),
                                shape = RoundedCornerShape(18.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                            ) {
                                Column(modifier = Modifier.padding(18.dp)) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(32.dp)
                                                .clip(RoundedCornerShape(8.dp))
                                                .background(OceanBlueLight),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(Icons.Default.Storefront, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(18.dp))
                                        }
                                        Text(
                                            text = "1. Store Location (32080)",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(10.dp))

                                    // Store Selector
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        listOf("aldi", "walmart", "target", "publix_beach").forEach { id ->
                                            val store = StoreData.getById(id)
                                            val isSelected = selectedStoreId == id
                                            FilterChip(
                                                selected = isSelected,
                                                onClick = { selectedStoreId = id },
                                                label = { Text(store?.shortName ?: id, fontSize = 12.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium) },
                                                colors = FilterChipDefaults.filterChipColors(
                                                    selectedContainerColor = OceanBlueLight,
                                                    selectedLabelColor = OceanBlue
                                                ),
                                                border = FilterChipDefaults.filterChipBorder(
                                                    enabled = true,
                                                    selected = isSelected,
                                                    borderColor = if (isSelected) OceanBlue else MaterialTheme.colorScheme.outlineVariant
                                                )
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(16.dp))

                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(32.dp)
                                                .clip(RoundedCornerShape(8.dp))
                                                .background(OceanBlueLight),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(Icons.Default.ShoppingBag, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(18.dp))
                                        }
                                        Text(
                                            text = "2. Catalog Item",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(8.dp))

                                    var expanded by remember { mutableStateOf(false) }
                                    OutlinedCard(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clickable { expanded = true },
                                        shape = RoundedCornerShape(12.dp),
                                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                                    ) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp)
                                        ) {
                                            Column {
                                                Text(
                                                    text = selectedProduct?.name ?: "Select an item",
                                                    style = MaterialTheme.typography.titleMedium,
                                                    fontWeight = FontWeight.Bold
                                                )
                                                Text(
                                                    text = "${selectedProduct?.sizeLabel} • ${selectedProduct?.category?.displayName}",
                                                    style = MaterialTheme.typography.bodySmall,
                                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                                )
                                            }
                                            Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                                        }
                                    }

                                    DropdownMenu(
                                        expanded = expanded,
                                        onDismissRequest = { expanded = false }
                                    ) {
                                        CatalogData.products.take(20).forEach { product ->
                                            DropdownMenuItem(
                                                text = { Text(product.name, fontWeight = FontWeight.Medium) },
                                                onClick = {
                                                    selectedProductId = product.id
                                                    userBarcode = product.barcode
                                                    expanded = false
                                                }
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(16.dp))

                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(32.dp)
                                                .clip(RoundedCornerShape(8.dp))
                                                .background(OceanBlueLight),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(Icons.Default.AttachMoney, contentDescription = null, tint = OceanBlue, modifier = Modifier.size(18.dp))
                                        }
                                        Text(
                                            text = "3. Price Observed & Barcode",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(8.dp))

                                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                        OutlinedTextField(
                                            value = shelfPriceInput,
                                            onValueChange = { shelfPriceInput = it },
                                            label = { Text("Observed Price ($)") },
                                            placeholder = { Text("e.g. 2.99") },
                                            singleLine = true,
                                            shape = RoundedCornerShape(12.dp),
                                            modifier = Modifier.weight(1f)
                                        )
                                        OutlinedTextField(
                                            value = userBarcode,
                                            onValueChange = { userBarcode = it },
                                            label = { Text("Barcode / UPC") },
                                            singleLine = true,
                                            shape = RoundedCornerShape(12.dp),
                                            modifier = Modifier.weight(1f)
                                        )
                                    }

                                    Spacer(modifier = Modifier.height(12.dp))
                                    OutlinedTextField(
                                        value = notesInput,
                                        onValueChange = { notesInput = it },
                                        label = { Text("Notes (optional)") },
                                        placeholder = { Text("e.g. Manager special endcap, yellow sticker") },
                                        modifier = Modifier.fillMaxWidth(),
                                        shape = RoundedCornerShape(12.dp)
                                    )

                                    Spacer(modifier = Modifier.height(16.dp))
                                    Button(
                                        onClick = {
                                            val price = shelfPriceInput.toDoubleOrNull()
                                            if (price != null && selectedProduct != null) {
                                                viewModel.logShelfPrice(
                                                    productId = selectedProduct.id,
                                                    productName = selectedProduct.name,
                                                    storeId = selectedStoreId,
                                                    price = price,
                                                    barcode = userBarcode,
                                                    notes = notesInput
                                                )
                                                shelfPriceInput = ""
                                                notesInput = ""
                                                showSuccessBanner = true
                                            }
                                        },
                                        shape = RoundedCornerShape(12.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(18.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("Save Shelf Tag Log", fontWeight = FontWeight.Bold)
                                    }

                                    if (showSuccessBanner) {
                                        Spacer(modifier = Modifier.height(10.dp))
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clip(RoundedCornerShape(8.dp))
                                                .background(EmeraldLight)
                                                .padding(horizontal = 12.dp, vertical = 8.dp)
                                        ) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldGreen, modifier = Modifier.size(16.dp))
                                                Spacer(modifier = Modifier.width(8.dp))
                                                Text(
                                                    text = "Shelf tag saved & verified for 32080 database!",
                                                    style = MaterialTheme.typography.labelMedium,
                                                    fontWeight = FontWeight.Bold,
                                                    color = EmeraldGreen
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // Recent Shelf Logs
                        item {
                            Spacer(modifier = Modifier.height(14.dp))
                            Text(
                                text = "Recent Community Price Logs",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.ExtraBold,
                                modifier = Modifier.padding(horizontal = 18.dp)
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                        }

                        if (priceLogs.isEmpty()) {
                            item {
                                Text(
                                    text = "No custom price logs yet. Use the form above to record price tags you observe in-store.",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.padding(horizontal = 18.dp, vertical = 8.dp)
                                )
                            }
                        } else {
                            items(priceLogs) { log ->
                                Card(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 16.dp, vertical = 4.dp),
                                    shape = RoundedCornerShape(14.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        modifier = Modifier.padding(14.dp)
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(
                                                text = log.productName,
                                                style = MaterialTheme.typography.titleMedium,
                                                fontWeight = FontWeight.Bold
                                            )
                                            Spacer(modifier = Modifier.height(3.dp))
                                            Row(
                                                verticalAlignment = Alignment.CenterVertically,
                                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                                            ) {
                                                StoreBadge(storeId = log.storeId)
                                                if (log.notes.isNotEmpty()) {
                                                    Text(
                                                        text = "• ${log.notes}",
                                                        style = MaterialTheme.typography.bodySmall,
                                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                                    )
                                                }
                                            }
                                        }
                                        Text(
                                            text = "$${String.format("%.2f", log.shelfPrice)}",
                                            style = MaterialTheme.typography.titleLarge,
                                            fontWeight = FontWeight.ExtraBold,
                                            color = EmeraldGreen
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CameraPermissionCard(
    onRequestPermission: () -> Unit,
    onSelectSample: (Product) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(72.dp)
                    .clip(CircleShape)
                    .background(OceanBlueLight),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.CameraAlt,
                    contentDescription = null,
                    tint = OceanBlue,
                    modifier = Modifier.size(36.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Camera Access Needed",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Point your camera at grocery barcodes and package labels to instantly compare prices across Aldi, Walmart, Target, and Publix in 32080.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 20.sp,
                modifier = Modifier.padding(horizontal = 8.dp)
            )

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = onRequestPermission,
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = OceanBlue),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("grant_camera_permission_button")
            ) {
                Icon(Icons.Default.LockOpen, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Grant Camera Access", fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(20.dp))

            HorizontalDivider()

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Or try scanning sample staples right now:",
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
            ) {
                val samples = listOf(
                    "milk_whole_gal" to "🥛 Whole Milk",
                    "eggs_large_white_doz" to "🥚 Grade A Eggs",
                    "raos_marinara_24oz" to "🍝 Rao's Sauce",
                    "bananas" to "🍌 Bananas",
                    "artisan_sourdough_loaf" to "🍞 Sourdough"
                )
                samples.forEach { (id, name) ->
                    val prod = CatalogData.getById(id)
                    if (prod != null) {
                        OutlinedButton(
                            onClick = { onSelectSample(prod) },
                            shape = RoundedCornerShape(16.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(name, fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}
