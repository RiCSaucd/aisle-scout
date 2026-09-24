package com.example.aislescout.data.repository

import com.example.aislescout.data.model.Product
import com.example.aislescout.data.model.ProductCategory
import com.example.aislescout.data.model.UnitType

object CatalogData {

    private fun createItem(
        id: String,
        name: String,
        category: ProductCategory,
        unit: UnitType,
        size: String,
        aldi: Double,
        walmart: Double,
        target: Double,
        publix: Double,
        isOrganic: Boolean = false,
        shelfLifeDays: Int = 7,
        barcode: String = "",
        notes: String = ""
    ): Product {
        val prices = mutableMapOf(
            "aldi" to aldi,
            "walmart" to walmart,
            "target" to target,
            "publix_beach" to publix,
            "publix_cobblestone" to publix,
            "winn_dixie" to (Math.round(walmart * 1.08 * 100.0) / 100.0)
        )
        val defaultBarcode = when (id) {
            "bananas" -> "000000004011"
            "strawberries" -> "033383401201"
            "blueberries" -> "033383401218"
            "raspberries" -> "033383401225"
            "avocados_haas_each" -> "000000004225"
            "roma_tomatoes" -> "000000004087"
            "spinach_baby_5oz" -> "071430009230"
            "broccoli_crowns" -> "000000004060"
            "carrots_baby_1lb" -> "033383100012"
            "yellow_onions_3lb" -> "033383100029"
            "russet_potatoes_5lb" -> "033383100036"
            "lemons_2lb" -> "033383100043"
            "limes_1lb" -> "033383100050"
            "bell_peppers_green" -> "000000004065"
            "cucumbers_each" -> "000000004062"
            "sweet_corn_each" -> "000000004078"
            "gala_apples_3lb" -> "033383100067"
            "watermelon_seedless" -> "000000004032"
            "mushrooms_white_8oz" -> "033383100074"
            "asparagus_per_lb" -> "000000004080"
            "eggs_large_white_doz" -> "011110852445"
            "pasture_raised_eggs" -> "860000051101"
            "milk_whole_gal" -> "011110416005"
            "milk_2percent_gal" -> "011110416012"
            "oat_milk_64oz" -> "190646630070"
            "butter_unsalted_1lb" -> "011110830009"
            "greek_yogurt_plain_32oz" -> "894700010045"
            "tillamook_cheddar_chunk" -> "072830000115"
            "mozzarella_shredded_8oz" -> "011110832003"
            "cream_cheese_8oz" -> "021000612239"
            "chicken_breast_boneless" -> "020810000000"
            "ground_beef_80_20" -> "020820000000"
            "bacon_thick_cut_16oz" -> "043000005101"
            "atlantic_salmon_fillet" -> "020830000000"
            "pork_chops_boneless" -> "020840000000"
            "wild_florida_shrimp" -> "020850000000"
            "artisan_sourdough_loaf" -> "072250011181"
            "natures_own_honey_wheat" -> "072250037129"
            "thomas_english_muffins" -> "048121257018"
            "dave_killer_bread_21" -> "013764027053"
            "flour_tortillas_10ct" -> "073731000103"
            "raos_marinara_24oz" -> "748805005085"
            "barilla_spaghetti_16oz" -> "076808516108"
            "jasmine_rice_5lb" -> "017400104149"
            "extra_virgin_olive_oil_500ml" -> "041790001402"
            "black_beans_canned_15oz" -> "041220172051"
            "peanut_butter_creamy_16oz" -> "051500255162"
            "cheerios_cereal_18oz" -> "016000169660"
            "old_fashioned_oats_42oz" -> "030000011904"
            "hummus_classic_10oz" -> "040822011042"
            "talenti_gelato_16oz" -> "854950002019"
            "frozen_blueberries_32oz" -> "011110842006"
            "digiorno_frozen_pizza" -> "071921003393"
            "frozen_broccoli_florets" -> "011110843003"
            "bubly_sparkling_8pk" -> "012000171765"
            "stok_cold_brew_48oz" -> "025293003301"
            "floridas_natural_oj_52oz" -> "016300165039"
            "folgers_classic_roast_25oz" -> "025500000517"
            "bounty_paper_towels_6pk" -> "037000854432"
            "charmin_toilet_paper_12pk" -> "037000862024"
            "dawn_platinum_dish_soap" -> "037000780014"
            "tide_pods_3in1_42ct" -> "037000823100"
            "colgate_total_toothpaste" -> "035000684128"
            "sunscreen_mineral_spf50" -> "041163004018"
            "local_ipa_6pack" -> "852669003012"
            "white_claw_variety_12pk" -> "635985548903"
            "kim_crawford_sauvignon_blanc" -> "083085501018"
            else -> "012345" + Math.abs(id.hashCode() % 1000000).toString().padStart(6, '0')
        }

        return Product(
            id = id,
            name = name,
            category = category,
            unit = unit,
            sizeLabel = size,
            isOrganic = isOrganic,
            shelfLifeDays = shelfLifeDays,
            barcode = barcode.ifEmpty { defaultBarcode },
            prices = prices,
            notes = notes
        )
    }

    val products = listOf(
        // PRODUCE
        createItem("bananas", "Bananas", ProductCategory.PRODUCE, UnitType.LB, "per lb", 0.44, 0.54, 0.59, 0.69, shelfLifeDays = 5),
        createItem("strawberries", "Strawberries", ProductCategory.PRODUCE, UnitType.EACH, "1 lb clamshell", 2.79, 3.48, 3.99, 5.99, shelfLifeDays = 4),
        createItem("blueberries", "Blueberries", ProductCategory.PRODUCE, UnitType.EACH, "18 oz", 3.49, 3.98, 4.49, 5.99, shelfLifeDays = 6),
        createItem("raspberries", "Raspberries", ProductCategory.PRODUCE, UnitType.EACH, "6 oz", 2.49, 2.98, 3.29, 3.99, shelfLifeDays = 3),
        createItem("avocados_haas_each", "Hass Avocados", ProductCategory.PRODUCE, UnitType.EACH, "each", 0.79, 0.98, 1.29, 1.49, shelfLifeDays = 5),
        createItem("roma_tomatoes", "Roma Tomatoes", ProductCategory.PRODUCE, UnitType.LB, "per lb", 1.19, 1.38, 1.69, 1.99, shelfLifeDays = 7),
        createItem("spinach_baby_5oz", "Baby Spinach (Organic)", ProductCategory.PRODUCE, UnitType.EACH, "5 oz tub", 1.79, 2.28, 2.49, 2.99, isOrganic = true, shelfLifeDays = 6),
        createItem("broccoli_crowns", "Broccoli Crowns", ProductCategory.PRODUCE, UnitType.LB, "per lb", 1.49, 1.78, 1.99, 2.49, shelfLifeDays = 7),
        createItem("carrots_baby_1lb", "Baby Cut Carrots", ProductCategory.PRODUCE, UnitType.EACH, "1 lb bag", 1.19, 1.28, 1.49, 1.79, shelfLifeDays = 14),
        createItem("yellow_onions_3lb", "Yellow Onions", ProductCategory.PRODUCE, UnitType.EACH, "3 lb bag", 1.99, 2.48, 2.79, 3.29, shelfLifeDays = 30),
        createItem("russet_potatoes_5lb", "Russet Potatoes", ProductCategory.PRODUCE, UnitType.EACH, "5 lb bag", 2.49, 2.98, 3.49, 3.99, shelfLifeDays = 21),
        createItem("lemons_2lb", "Lemons", ProductCategory.PRODUCE, UnitType.EACH, "2 lb bag", 2.49, 2.98, 3.49, 3.99, shelfLifeDays = 14),
        createItem("limes_1lb", "Limes", ProductCategory.PRODUCE, UnitType.EACH, "1 lb bag", 1.49, 1.78, 1.99, 2.49, shelfLifeDays = 14),
        createItem("bell_peppers_green", "Green Bell Peppers", ProductCategory.PRODUCE, UnitType.EACH, "each", 0.59, 0.78, 0.89, 0.99, shelfLifeDays = 8),
        createItem("cucumbers_each", "Cucumbers", ProductCategory.PRODUCE, UnitType.EACH, "each", 0.59, 0.68, 0.79, 0.89, shelfLifeDays = 7),
        createItem("sweet_corn_each", "Florida Sweet Corn", ProductCategory.PRODUCE, UnitType.EACH, "each", 0.33, 0.48, 0.59, 0.69, shelfLifeDays = 4),
        createItem("gala_apples_3lb", "Gala Apples", ProductCategory.PRODUCE, UnitType.EACH, "3 lb bag", 2.99, 3.48, 3.99, 4.49, shelfLifeDays = 14),
        createItem("watermelon_seedless", "Seedless Watermelon", ProductCategory.PRODUCE, UnitType.EACH, "whole", 3.99, 4.98, 5.99, 6.99, shelfLifeDays = 10),
        createItem("mushrooms_white_8oz", "White Button Mushrooms", ProductCategory.PRODUCE, UnitType.EACH, "8 oz", 1.49, 1.78, 1.99, 2.49, shelfLifeDays = 5),
        createItem("asparagus_per_lb", "Fresh Asparagus", ProductCategory.PRODUCE, UnitType.LB, "per lb", 2.49, 2.98, 3.49, 3.99, shelfLifeDays = 5),

        // DAIRY & EGGS
        createItem("eggs_large_white_doz", "Large Grade A White Eggs", ProductCategory.DAIRY, UnitType.DOZEN, "12 ct", 2.19, 2.48, 2.89, 3.99, shelfLifeDays = 28),
        createItem("pasture_raised_eggs", "Vital Farms Pasture-Raised Eggs", ProductCategory.DAIRY, UnitType.DOZEN, "12 ct", 4.99, 5.48, 5.99, 6.99, isOrganic = true, shelfLifeDays = 28),
        createItem("milk_whole_gal", "Whole Milk", ProductCategory.DAIRY, UnitType.GAL, "1 gallon", 2.95, 3.12, 3.49, 4.49, shelfLifeDays = 10),
        createItem("milk_2percent_gal", "2% Reduced Fat Milk", ProductCategory.DAIRY, UnitType.GAL, "1 gallon", 2.95, 3.12, 3.49, 4.49, shelfLifeDays = 10),
        createItem("oat_milk_64oz", "Oatly Oat Milk", ProductCategory.DAIRY, UnitType.EACH, "64 oz", 3.99, 4.48, 4.99, 5.69, shelfLifeDays = 14),
        createItem("butter_unsalted_1lb", "Unsalted Butter", ProductCategory.DAIRY, UnitType.EACH, "4 sticks / 16 oz", 3.29, 3.98, 4.29, 4.99, shelfLifeDays = 45),
        createItem("greek_yogurt_plain_32oz", "Greek Plain Yogurt", ProductCategory.DAIRY, UnitType.EACH, "32 oz tub", 3.49, 3.98, 4.49, 5.29, shelfLifeDays = 18),
        createItem("tillamook_cheddar_chunk", "Tillamook Medium Cheddar", ProductCategory.DAIRY, UnitType.EACH, "8 oz block", 3.99, 4.28, 4.79, 5.49, shelfLifeDays = 30),
        createItem("mozzarella_shredded_8oz", "Shredded Mozzarella Cheese", ProductCategory.DAIRY, UnitType.EACH, "8 oz bag", 1.99, 2.24, 2.49, 3.29, shelfLifeDays = 25),
        createItem("cream_cheese_8oz", "Philadelphia Cream Cheese", ProductCategory.DAIRY, UnitType.EACH, "8 oz brick", 2.29, 2.88, 3.19, 3.89, shelfLifeDays = 30),

        // MEAT & SEAFOOD
        createItem("chicken_breast_boneless", "Boneless Skinless Chicken Breasts", ProductCategory.MEAT, UnitType.LB, "per lb", 2.49, 2.88, 3.49, 4.99, shelfLifeDays = 3),
        createItem("ground_beef_80_20", "Ground Beef 80/20", ProductCategory.MEAT, UnitType.LB, "per lb", 3.99, 4.48, 4.99, 5.99, shelfLifeDays = 3),
        createItem("bacon_thick_cut_16oz", "Thick Cut Applewood Bacon", ProductCategory.MEAT, UnitType.EACH, "16 oz pack", 3.99, 4.98, 5.49, 6.99, shelfLifeDays = 20),
        createItem("atlantic_salmon_fillet", "Fresh Atlantic Salmon Fillets", ProductCategory.MEAT, UnitType.LB, "per lb", 8.49, 9.98, 10.99, 12.99, shelfLifeDays = 2),
        createItem("pork_chops_boneless", "Boneless Center Cut Pork Chops", ProductCategory.MEAT, UnitType.LB, "per lb", 2.99, 3.48, 3.99, 4.99, shelfLifeDays = 4),
        createItem("wild_florida_shrimp", "Wild Florida Key West Pink Shrimp", ProductCategory.MEAT, UnitType.LB, "1 lb 21/25 ct", 7.99, 8.98, 9.99, 11.99, shelfLifeDays = 2),

        // BAKERY
        createItem("artisan_sourdough_loaf", "Artisan Sourdough Loaf", ProductCategory.BAKERY, UnitType.EACH, "24 oz round", 3.49, 3.88, 4.29, 4.99, shelfLifeDays = 5),
        createItem("natures_own_honey_wheat", "Nature's Own Honey Wheat Bread", ProductCategory.BAKERY, UnitType.EACH, "20 oz loaf", 2.79, 3.18, 3.49, 4.19, shelfLifeDays = 9),
        createItem("thomas_english_muffins", "Thomas' English Muffins", ProductCategory.BAKERY, UnitType.EACH, "6 ct / 12 oz", 2.99, 3.48, 3.99, 5.29, shelfLifeDays = 12),
        createItem("dave_killer_bread_21", "Dave's Killer Bread 21 Whole Grains", ProductCategory.BAKERY, UnitType.EACH, "27 oz loaf", 5.29, 5.88, 6.29, 6.99, isOrganic = true, shelfLifeDays = 10),
        createItem("flour_tortillas_10ct", "Flour Tortillas (Fajita)", ProductCategory.BAKERY, UnitType.PACK, "10 count", 1.49, 1.88, 2.19, 2.79, shelfLifeDays = 25),

        // PANTRY
        createItem("raos_marinara_24oz", "Rao's Homemade Marinara Sauce", ProductCategory.PANTRY, UnitType.EACH, "24 oz jar", 6.89, 7.48, 7.99, 9.29, shelfLifeDays = 180),
        createItem("barilla_spaghetti_16oz", "Barilla Blue Box Spaghetti", ProductCategory.PANTRY, UnitType.EACH, "16 oz box", 1.49, 1.78, 1.89, 2.29, shelfLifeDays = 365),
        createItem("jasmine_rice_5lb", "Mahatma Jasmine Rice", ProductCategory.PANTRY, UnitType.EACH, "5 lb bag", 5.29, 5.98, 6.49, 7.29, shelfLifeDays = 365),
        createItem("extra_virgin_olive_oil_500ml", "Extra Virgin Olive Oil (Cold Pressed)", ProductCategory.PANTRY, UnitType.EACH, "500 ml", 5.99, 6.88, 7.49, 8.99, shelfLifeDays = 180),
        createItem("black_beans_canned_15oz", "Black Beans (Low Sodium)", ProductCategory.PANTRY, UnitType.EACH, "15.5 oz can", 0.79, 0.88, 0.99, 1.29, shelfLifeDays = 720),
        createItem("peanut_butter_creamy_16oz", "Creamy Peanut Butter", ProductCategory.PANTRY, UnitType.EACH, "16 oz jar", 1.69, 1.98, 2.29, 2.89, shelfLifeDays = 180),
        createItem("cheerios_cereal_18oz", "Honey Nut Cheerios Cereal", ProductCategory.PANTRY, UnitType.EACH, "18.8 oz Family Size", 3.99, 4.48, 4.99, 6.49, shelfLifeDays = 180),
        createItem("old_fashioned_oats_42oz", "Old Fashioned Rolled Oats", ProductCategory.PANTRY, UnitType.EACH, "42 oz canister", 3.49, 3.98, 4.29, 5.19, shelfLifeDays = 365),
        createItem("hummus_classic_10oz", "Park Street Classic Hummus", ProductCategory.PANTRY, UnitType.EACH, "10 oz tub", 1.99, 2.48, 2.79, 3.49, shelfLifeDays = 21),

        // FROZEN
        createItem("talenti_gelato_16oz", "Talenti Gelato (Caramel Cookie Crunch)", ProductCategory.FROZEN, UnitType.EACH, "16 oz pint", 4.49, 4.98, 5.29, 6.19, shelfLifeDays = 90),
        createItem("frozen_blueberries_32oz", "Organic Frozen Blueberries", ProductCategory.FROZEN, UnitType.EACH, "32 oz bag", 5.49, 6.18, 6.99, 7.99, isOrganic = true, shelfLifeDays = 180),
        createItem("digiorno_frozen_pizza", "DiGiorno Rising Crust Pepperoni Pizza", ProductCategory.FROZEN, UnitType.EACH, "28 oz box", 5.99, 6.48, 6.99, 8.49, shelfLifeDays = 120),
        createItem("frozen_broccoli_florets", "Frozen Broccoli Florets", ProductCategory.FROZEN, UnitType.EACH, "16 oz steam bag", 1.19, 1.38, 1.59, 2.19, shelfLifeDays = 180),

        // BEVERAGES
        createItem("bubly_sparkling_8pk", "Bubly Sparkling Water Lime (8 pk)", ProductCategory.BEVERAGES, UnitType.PACK, "8 cans / 12 oz", 3.49, 3.88, 4.49, 4.99, shelfLifeDays = 180),
        createItem("stok_cold_brew_48oz", "STōK Cold Brew Unsweetened", ProductCategory.BEVERAGES, UnitType.EACH, "48 oz bottle", 4.99, 5.48, 5.79, 6.49, shelfLifeDays = 30),
        createItem("floridas_natural_oj_52oz", "Florida's Natural Premium Orange Juice", ProductCategory.BEVERAGES, UnitType.EACH, "52 oz bottle", 3.49, 3.98, 4.29, 4.99, shelfLifeDays = 21),
        createItem("folgers_classic_roast_25oz", "Folgers Classic Roast Ground Coffee", ProductCategory.BEVERAGES, UnitType.EACH, "25.9 oz canister", 7.99, 8.98, 9.49, 10.99, shelfLifeDays = 365),

        // HOUSEHOLD & PERSONAL
        createItem("bounty_paper_towels_6pk", "Bounty Select-A-Size Paper Towels", ProductCategory.HOUSEHOLD, UnitType.PACK, "6 double rolls", 11.99, 12.98, 13.49, 15.49, shelfLifeDays = 720),
        createItem("charmin_toilet_paper_12pk", "Charmin Ultra Soft Bath Tissue", ProductCategory.HOUSEHOLD, UnitType.PACK, "12 mega rolls", 13.99, 14.97, 15.49, 17.99, shelfLifeDays = 720),
        createItem("dawn_platinum_dish_soap", "Dawn Platinum Dishwashing Foam", ProductCategory.HOUSEHOLD, UnitType.EACH, "16 oz pump", 2.99, 3.44, 3.99, 4.49, shelfLifeDays = 720),
        createItem("tide_pods_3in1_42ct", "Tide PODS Free & Gentle", ProductCategory.HOUSEHOLD, UnitType.PACK, "42 pods tub", 11.99, 12.97, 13.49, 15.99, shelfLifeDays = 365),
        createItem("colgate_total_toothpaste", "Colgate Total Clean Mint Toothpaste", ProductCategory.PERSONAL, UnitType.EACH, "4.8 oz tube", 3.49, 3.98, 4.29, 4.99, shelfLifeDays = 365),
        createItem("sunscreen_mineral_spf50", "Sunscreen SPF 50 Broad Spectrum (Beach)", ProductCategory.PERSONAL, UnitType.EACH, "6 oz bottle", 6.99, 7.98, 8.49, 9.99, shelfLifeDays = 365),

        // BEER & WINE
        createItem("local_ipa_6pack", "Jai Alai IPA (Tampa / Local FL)", ProductCategory.ALCOHOL, UnitType.PACK, "6 pk 12 oz cans", 10.49, 10.98, 11.49, 12.49, shelfLifeDays = 120),
        createItem("white_claw_variety_12pk", "White Claw Hard Seltzer Variety Pack", ProductCategory.ALCOHOL, UnitType.PACK, "12 pk 12 oz cans", 15.99, 16.48, 16.99, 18.99, shelfLifeDays = 180),
        createItem("kim_crawford_sauvignon_blanc", "Kim Crawford Sauvignon Blanc 750ml", ProductCategory.ALCOHOL, UnitType.BOTTLE, "750 ml", 12.99, 13.98, 14.99, 16.99, shelfLifeDays = 365)
    )

    fun getById(id: String): Product? = products.find { it.id == id }

    fun getByCategory(category: ProductCategory): List<Product> =
        products.filter { it.category == category }

    fun findByBarcode(code: String): Product? {
        val cleanCode = code.trim().trimStart('0')
        return products.find {
            val productBarcodeClean = it.barcode.trim().trimStart('0')
            it.barcode.equals(code.trim(), ignoreCase = true) ||
                    (cleanCode.isNotEmpty() && productBarcodeClean.isNotEmpty() && (cleanCode == productBarcodeClean || cleanCode.endsWith(productBarcodeClean) || productBarcodeClean.endsWith(cleanCode))) ||
                    it.id.equals(code.trim(), ignoreCase = true)
        }
    }

    fun search(query: String): List<Product> {
        val q = query.trim().lowercase()
        if (q.isEmpty()) return emptyList()
        return products.filter {
            it.name.lowercase().contains(q) ||
                    it.category.displayName.lowercase().contains(q) ||
                    it.notes.lowercase().contains(q) ||
                    it.barcode.contains(q)
        }
    }
}
