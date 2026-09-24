package com.example.aislescout.data.repository

import com.example.aislescout.data.model.Promotion
import com.example.aislescout.data.model.PromotionKind

object PromotionData {
    val promotions = listOf(
        Promotion(
            id = "publix_bogo_raos",
            storeId = "publix_beach",
            productId = "raos_marinara_24oz",
            kind = PromotionKind.BOGO,
            promoPrice = 4.65,
            regularPrice = 9.29,
            title = "Rao's Homemade Pasta Sauce 24 oz",
            description = "Buy 1 Get 1 Free at Publix. Equal or lesser value.",
            validUntil = "Wednesday",
            active = true
        ),
        Promotion(
            id = "publix_bogo_thomas",
            storeId = "publix_beach",
            productId = "thomas_english_muffins",
            kind = PromotionKind.BOGO,
            promoPrice = 2.65,
            regularPrice = 5.29,
            title = "Thomas' English Muffins 6 ct",
            description = "BOGO Free. Essential breakfast staple.",
            validUntil = "Wednesday",
            active = true
        ),
        Promotion(
            id = "publix_bogo_cheerios",
            storeId = "publix_beach",
            productId = "cheerios_cereal_18oz",
            kind = PromotionKind.BOGO,
            promoPrice = 3.25,
            regularPrice = 6.49,
            title = "General Mills Cheerios Cereal 18 oz",
            description = "BOGO Free. Honey Nut or Original.",
            validUntil = "Wednesday",
            active = true
        ),
        Promotion(
            id = "publix_bogo_talenti",
            storeId = "publix_beach",
            productId = "talenti_gelato_16oz",
            kind = PromotionKind.BOGO,
            promoPrice = 3.10,
            regularPrice = 6.19,
            title = "Talenti Gelato & Sorbetto 16 oz",
            description = "BOGO Free freezer treat.",
            validUntil = "Wednesday",
            active = true
        ),
        Promotion(
            id = "publix_bogo_natures_own",
            storeId = "publix_beach",
            productId = "natures_own_honey_wheat",
            kind = PromotionKind.BOGO,
            promoPrice = 2.10,
            regularPrice = 4.19,
            title = "Nature's Own Honey Wheat Bread 20 oz",
            description = "BOGO Free weekly staple.",
            validUntil = "Wednesday",
            active = true
        ),
        Promotion(
            id = "publix_bogo_tillamook",
            storeId = "publix_beach",
            productId = "tillamook_cheddar_chunk",
            kind = PromotionKind.BOGO,
            promoPrice = 2.75,
            regularPrice = 5.49,
            title = "Tillamook Medium Cheddar 8 oz",
            description = "BOGO Free dairy special.",
            validUntil = "Wednesday",
            active = true
        ),
        Promotion(
            id = "walmart_rollback_eggs",
            storeId = "walmart",
            productId = "eggs_large_white_doz",
            kind = PromotionKind.ROLLBACK,
            promoPrice = 2.48,
            regularPrice = 3.12,
            title = "Great Value Large Grade A Eggs 1 Dozen",
            description = "Everyday Rollback at US-1 South.",
            validUntil = "Ongoing",
            active = true
        ),
        Promotion(
            id = "walmart_rollback_chicken",
            storeId = "walmart",
            productId = "chicken_breast_boneless",
            kind = PromotionKind.ROLLBACK,
            promoPrice = 2.88,
            regularPrice = 3.48,
            title = "Fresh Boneless Skinless Chicken Breasts (per lb)",
            description = "Family pack special savings.",
            validUntil = "Sunday",
            active = true
        ),
        Promotion(
            id = "target_circle_avocados",
            storeId = "target",
            productId = "avocados_haas_each",
            kind = PromotionKind.CIRCLE,
            promoPrice = 0.69,
            regularPrice = 0.99,
            title = "Hass Avocados (each)",
            description = "Save with Target Circle membership in-app.",
            validUntil = "Saturday",
            active = true
        ),
        Promotion(
            id = "target_circle_bubly",
            storeId = "target",
            productId = "bubly_sparkling_8pk",
            kind = PromotionKind.CIRCLE,
            promoPrice = 3.33,
            regularPrice = 4.49,
            title = "Bubly Sparkling Water 8 pk (12 oz)",
            description = "3 for $10 with Target Circle.",
            validUntil = "Saturday",
            active = true
        ),
        Promotion(
            id = "aldi_find_sourdough",
            storeId = "aldi",
            productId = "artisan_sourdough_loaf",
            kind = PromotionKind.ALDI_FINDS,
            promoPrice = 3.49,
            regularPrice = 4.29,
            title = "Specially Selected Sourdough Round",
            description = "Aldi Finds weekly special bake.",
            validUntil = "While supplies last",
            active = true
        ),
        Promotion(
            id = "aldi_find_hummus",
            storeId = "aldi",
            productId = "hummus_classic_10oz",
            kind = PromotionKind.ALDI_FINDS,
            promoPrice = 1.99,
            regularPrice = 2.49,
            title = "Park Street Deli Classic Hummus 10 oz",
            description = "Aldi weekly favorite.",
            validUntil = "Sunday",
            active = true
        )
    )

    fun getForProductAndStore(productId: String, storeId: String): Promotion? {
        return promotions.find { it.productId == productId && it.storeId == storeId && it.active }
    }
}
