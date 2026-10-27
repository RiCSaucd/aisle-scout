package com.example.aislescout

import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.test.core.app.ApplicationProvider
import com.google.mlkit.common.MlKit
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.onNodeWithTag
import com.github.takahirom.roborazzi.captureRoboImage
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/**
 * Launches the real MainActivity on the JVM and opens each screen, so a crash on
 * start-up or on any tab fails the build. Each screen is also saved as a
 * 1080×1920 PNG in app/build/outputs/roborazzi/, usable as a Play Store screenshot.
 */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h640dp-xxhdpi")
class AppScreensTest {
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private fun capture(name: String) {
        compose.waitForIdle()
        compose.onRoot().captureRoboImage("build/outputs/roborazzi/$name.png")
    }

    private fun openTab(tag: String) {
        compose.onNodeWithTag("nav_$tag").performClick()
    }

    @Test
    fun home() = capture("01-home")

    @Test
    fun prices() {
        openTab("prices")
        capture("02-prices")
    }

    @Test
    fun deals() {
        openTab("deals")
        capture("03-deals")
    }

    @Test
    fun list() {
        openTab("list")
        capture("04-list")
    }

    @Test
    fun pantry() {
        openTab("pantry")
        capture("05-pantry")
    }

    @Test
    fun scan() {
        // On a phone ML Kit's own startup provider does this; Robolectric skips library providers.
        MlKit.initialize(ApplicationProvider.getApplicationContext())
        compose.onNodeWithTag("home_camera_scan_button").performClick()
        capture("06-scan")
    }
}
