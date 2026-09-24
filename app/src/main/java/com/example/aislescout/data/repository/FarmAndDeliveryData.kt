package com.example.aislescout.data.repository

import com.example.aislescout.data.model.DeliveryOption
import com.example.aislescout.data.model.FarmMarket

object FarmData {
    val markets = listOf(
        FarmMarket(
            id = "wed_pier_market",
            name = "Wednesday Pier Farmers Market",
            dayOfWeek = "Every Wednesday",
            hours = "8:00 AM – 12:00 PM",
            location = "St. Augustine Beach Pier Park",
            address = "350 A1A Beach Blvd, St. Augustine Beach, FL 32080",
            highlights = listOf("Fresh Atlantic catch & local shrimp", "Heirloom hydroponic tomatoes", "Artisan local breads & pastries", "Beach breeze shopping"),
            season = "Year-round"
        ),
        FarmMarket(
            id = "amp_saturday_market",
            name = "The Amp Farmers Market",
            dayOfWeek = "Every Saturday",
            hours = "8:30 AM – 12:30 PM",
            location = "St. Augustine Amphitheatre",
            address = "1340 A1A S, St. Augustine, FL 32080",
            highlights = listOf("Pasture-raised poultry & duck eggs", "Organic greens & mushrooms", "Local raw wildflower honey", "Live acoustic music & food trucks"),
            season = "Year-round"
        ),
        FarmMarket(
            id = "sunday_village_market",
            name = "St. Augustine Sunday Farmers Market",
            dayOfWeek = "Every Sunday",
            hours = "11:00 AM – 3:00 PM",
            location = "St. Augustine Beach Volleyball Courts",
            address = "299 S Ocean Shore Blvd, Flagler / St. Aug Beach",
            highlights = listOf("Handmade cheeses", "Citrus & fresh squeezed juices", "Locally roasted coffees"),
            season = "Fall & Spring"
        ),
        FarmMarket(
            id = "bee_hill_farm",
            name = "Bee Hill Farm & Apiary",
            dayOfWeek = "Tues – Sat",
            hours = "10:00 AM – 5:00 PM",
            location = "Elkton / Hastings Farm Belt",
            address = "5600 County Rd 13 S, Elkton, FL 32033",
            highlights = listOf("Certified organic St. Johns County produce", "Pure Tupelo & Gallberry honey", "Seasonal u-pick berries"),
            season = "March – November"
        ),
        FarmMarket(
            id = "county_line_produce",
            name = "County Line Produce Stand",
            dayOfWeek = "Daily",
            hours = "8:00 AM – 6:00 PM",
            location = "State Road 207 Farm Belt",
            address = "State Road 207, Hastings, FL 32145",
            highlights = listOf("Hastings famous new potatoes", "Cabbage & broccoli direct from field", "Farm-gate bulk bushel pricing"),
            season = "November – June"
        )
    )
}

object DeliveryData {
    val options = listOf(
        DeliveryOption(
            serviceName = "Walmart+ InHome / Delivery",
            provider = "Walmart Supercenter (US-1 S)",
            monthlyFee = 12.95,
            annualFee = 98.00,
            minOrderForFreeDelivery = 35.00,
            deliveryFeeUnderMin = 6.99,
            itemMarkupPercent = 0.0, // Same shelf price!
            estimatedServiceFeePercent = 0.0,
            recommendedTipPercent = 0.10,
            coverage32080 = "Direct to all Anastasia Island & Beach addresses",
            perks = listOf(
                "Zero markup on store shelf prices",
                "Free same-day delivery on orders $35+",
                "Paramount+ subscription included",
                "Fuel discount at Murphy & Exxon"
            )
        ),
        DeliveryOption(
            serviceName = "Publix via Instacart",
            provider = "Publix (Anastasia Plaza)",
            monthlyFee = 9.99,
            annualFee = 99.00,
            minOrderForFreeDelivery = 35.00,
            deliveryFeeUnderMin = 7.99,
            itemMarkupPercent = 0.15, // ~15% shelf markup
            estimatedServiceFeePercent = 0.05,
            recommendedTipPercent = 0.15,
            coverage32080 = "Delivers anywhere on Anastasia Island in ~60 mins",
            perks = listOf(
                "Access to famous Pub Subs & deli hot bar",
                "Weekly BOGO specials honored in app",
                "Priority 30-45 minute dropoff available"
            )
        ),
        DeliveryOption(
            serviceName = "Target 360 (Shipt)",
            provider = "Target (Cobblestone Village)",
            monthlyFee = 10.99,
            annualFee = 99.00,
            minOrderForFreeDelivery = 35.00,
            deliveryFeeUnderMin = 9.99,
            itemMarkupPercent = 0.0, // Target Circle 360 uses in-store prices
            estimatedServiceFeePercent = 0.0,
            recommendedTipPercent = 0.12,
            coverage32080 = "Across Bridge of Lions / SR-312 onto Island",
            perks = listOf(
                "No markups on Good & Gather groceries",
                "Personal Shipt shoppers communicate in real-time",
                "Same-day delivery as fast as 1 hour"
            )
        ),
        DeliveryOption(
            serviceName = "Sam's Club Plus Delivery",
            provider = "Sam's Club #8253",
            monthlyFee = 9.16,
            annualFee = 110.00,
            minOrderForFreeDelivery = 50.00,
            deliveryFeeUnderMin = 12.00,
            itemMarkupPercent = 0.0,
            estimatedServiceFeePercent = 0.0,
            recommendedTipPercent = 0.10,
            coverage32080 = "Scheduled delivery slots into 32080",
            perks = listOf(
                "Bulk club pricing without driving to Jax",
                "Free delivery on orders $50+ for Plus members",
                "2% cash back on club purchases"
            )
        )
    )
}
