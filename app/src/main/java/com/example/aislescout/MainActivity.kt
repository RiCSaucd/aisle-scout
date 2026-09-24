package com.example.aislescout

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.aislescout.ui.AisleScoutApp
import com.example.aislescout.ui.theme.AisleScoutTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AisleScoutTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    AisleScoutApp()
                }
            }
        }
    }
}
