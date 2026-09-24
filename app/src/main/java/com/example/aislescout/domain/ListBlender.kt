package com.example.aislescout.domain

import com.example.aislescout.data.model.ListItem
import com.example.aislescout.data.repository.CatalogData

object ListBlender {

    data class BlendResult(
        val matchedItems: List<ListItem>,
        val unmatchedLines: List<String>
    )

    fun blend(rawText: String): BlendResult {
        val lines = rawText.lines()
            .map { it.trim() }
            .filter { it.isNotEmpty() && !it.startsWith("#") && !it.startsWith("//") }

        val matched = mutableListOf<ListItem>()
        val unmatched = mutableListOf<String>()

        for (line in lines) {
            val clean = line.replace(Regex("^[-*•\\d+\\.\\)]+\\s*"), "").trim()
            if (clean.isEmpty()) continue

            // Check quantity pattern: e.g. "2 cartons of eggs", "3 avocados", "1 gallon milk"
            val qtyMatch = Regex("^(\\d+)\\s+(?:cartons?|packs?|bags?|cans?|lbs?|gallons?|bottles?|of)?\\s*(.+)$", RegexOption.IGNORE_CASE).find(clean)
            val quantity = qtyMatch?.groupValues?.get(1)?.toIntOrNull() ?: 1
            val query = (qtyMatch?.groupValues?.get(2) ?: clean).lowercase()

            // Find best matching catalog item
            val found = CatalogData.products.find { product ->
                val pName = product.name.lowercase()
                val pId = product.id.lowercase().replace("_", " ")
                query.contains(pName) || pName.contains(query) ||
                        query.split(" ").any { word -> word.length >= 4 && (pName.contains(word) || pId.contains(word)) }
            }

            if (found != null) {
                matched.add(
                    ListItem(
                        productId = found.id,
                        name = found.name,
                        quantity = quantity,
                        unit = found.unit.label
                    )
                )
            } else {
                unmatched.add(clean)
            }
        }

        return BlendResult(matchedItems = matched, unmatchedLines = unmatched)
    }
}
