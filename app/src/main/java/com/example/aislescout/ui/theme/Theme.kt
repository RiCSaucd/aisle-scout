package com.example.aislescout.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val LightColorScheme = lightColorScheme(
    primary = OceanBlue,
    onPrimary = CardSurfaceLight,
    primaryContainer = OceanBlueLight,
    onPrimaryContainer = DeepNavy,
    secondary = AldiBlue,
    onSecondary = CardSurfaceLight,
    secondaryContainer = SurfaceSubtle,
    onSecondaryContainer = TextPrimary,
    background = LightBackground,
    onBackground = TextPrimary,
    surface = CardSurfaceLight,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceSubtle,
    onSurfaceVariant = TextSecondary,
    outline = OutlineLight,
    outlineVariant = OutlineSubtle
)

private val DarkColorScheme = darkColorScheme(
    primary = OceanBlue,
    onPrimary = CardSurfaceLight,
    primaryContainer = DarkCardElevated,
    onPrimaryContainer = OceanBlueLight,
    secondary = OceanBlueLight,
    onSecondary = DeepNavy,
    secondaryContainer = DarkSurface,
    onSecondaryContainer = DarkTextPrimary,
    background = DarkBackground,
    onBackground = DarkTextPrimary,
    surface = DarkSurface,
    onSurface = DarkTextPrimary,
    surfaceVariant = DarkCard,
    onSurfaceVariant = DarkTextSecondary,
    outline = DarkOutline,
    outlineVariant = DarkOutlineSubtle
)

@Composable
fun AisleScoutTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
