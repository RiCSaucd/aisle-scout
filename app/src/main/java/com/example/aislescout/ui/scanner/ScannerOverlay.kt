package com.example.aislescout.ui.scanner

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.aislescout.ui.theme.*

@Composable
fun ScannerOverlay(
    isTorchOn: Boolean,
    onToggleTorch: () -> Unit,
    onFlipCamera: () -> Unit,
    statusText: String,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "laser_transition")
    val laserProgress by infiniteTransition.animateFloat(
        initialValue = 0.1f,
        targetValue = 0.9f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1800, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "laser_position"
    )

    BoxWithConstraints(modifier = modifier.fillMaxSize()) {
        val screenWidth = maxWidth
        val screenHeight = maxHeight

        val boxWidth = 280.dp
        val boxHeight = 220.dp

        // Canvas for the dark cutout scrim, corner guides, and animated scanning beam
        Canvas(modifier = Modifier.fillMaxSize()) {
            val widthPx = size.width
            val heightPx = size.height

            val rectWidth = boxWidth.toPx()
            val rectHeight = boxHeight.toPx()

            val left = (widthPx - rectWidth) / 2f
            val top = (heightPx - rectHeight) / 2f - 40.dp.toPx()
            val right = left + rectWidth
            val bottom = top + rectHeight

            // Draw darkened scrim with rounded transparent window
            val scrimPath = Path().apply {
                fillType = PathFillType.EvenOdd
                addRect(Rect(0f, 0f, widthPx, heightPx))
                addRoundRect(
                    RoundRect(
                        left = left,
                        top = top,
                        right = right,
                        bottom = bottom,
                        cornerRadius = CornerRadius(20.dp.toPx(), 20.dp.toPx())
                    )
                )
            }
            drawPath(scrimPath, color = Color.Black.copy(alpha = 0.65f))

            // Draw subtle viewfinder inner border
            drawRoundRect(
                color = Color.White.copy(alpha = 0.25f),
                topLeft = Offset(left, top),
                size = Size(rectWidth, rectHeight),
                cornerRadius = CornerRadius(20.dp.toPx(), 20.dp.toPx()),
                style = Stroke(width = 2.dp.toPx())
            )

            // Draw corner accent brackets
            val cornerLength = 28.dp.toPx()
            val cornerRadiusPx = 14.dp.toPx()
            val strokeWidthPx = 4.5.dp.toPx()
            val cornerColor = EmeraldGreen

            // Top-left
            val tlPath = Path().apply {
                moveTo(left, top + cornerLength)
                lineTo(left, top + cornerRadiusPx)
                arcTo(
                    rect = Rect(left, top, left + cornerRadiusPx * 2, top + cornerRadiusPx * 2),
                    startAngleDegrees = 180f,
                    sweepAngleDegrees = 90f,
                    forceMoveTo = false
                )
                lineTo(left + cornerLength, top)
            }
            drawPath(tlPath, color = cornerColor, style = Stroke(width = strokeWidthPx, cap = StrokeCap.Round))

            // Top-right
            val trPath = Path().apply {
                moveTo(right - cornerLength, top)
                lineTo(right - cornerRadiusPx, top)
                arcTo(
                    rect = Rect(right - cornerRadiusPx * 2, top, right, top + cornerRadiusPx * 2),
                    startAngleDegrees = 270f,
                    sweepAngleDegrees = 90f,
                    forceMoveTo = false
                )
                lineTo(right, top + cornerLength)
            }
            drawPath(trPath, color = cornerColor, style = Stroke(width = strokeWidthPx, cap = StrokeCap.Round))

            // Bottom-left
            val blPath = Path().apply {
                moveTo(left, bottom - cornerLength)
                lineTo(left, bottom - cornerRadiusPx)
                arcTo(
                    rect = Rect(left, bottom - cornerRadiusPx * 2, left + cornerRadiusPx * 2, bottom),
                    startAngleDegrees = 90f,
                    sweepAngleDegrees = 90f,
                    forceMoveTo = false
                )
                lineTo(left + cornerLength, bottom)
            }
            drawPath(blPath, color = cornerColor, style = Stroke(width = strokeWidthPx, cap = StrokeCap.Round))

            // Bottom-right
            val brPath = Path().apply {
                moveTo(right - cornerLength, bottom)
                lineTo(right - cornerRadiusPx, bottom)
                arcTo(
                    rect = Rect(right - cornerRadiusPx * 2, bottom - cornerRadiusPx * 2, right, bottom),
                    startAngleDegrees = 0f,
                    sweepAngleDegrees = 90f,
                    forceMoveTo = false
                )
                lineTo(right, bottom - cornerLength)
            }
            drawPath(brPath, color = cornerColor, style = Stroke(width = strokeWidthPx, cap = StrokeCap.Round))

            // Draw animated scanning laser line with neon glow
            val laserY = top + (rectHeight * laserProgress)
            val laserBrush = Brush.horizontalGradient(
                colors = listOf(
                    Color.Transparent,
                    EmeraldGreen.copy(alpha = 0.5f),
                    EmeraldGreen,
                    EmeraldGreen.copy(alpha = 0.5f),
                    Color.Transparent
                ),
                startX = left + 10.dp.toPx(),
                endX = right - 10.dp.toPx()
            )

            drawLine(
                brush = laserBrush,
                start = Offset(left + 8.dp.toPx(), laserY),
                end = Offset(right - 8.dp.toPx(), laserY),
                strokeWidth = 3.dp.toPx(),
                cap = StrokeCap.Round
            )
        }

        // Top Controls: Torch & Camera Switch
        Row(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 16.dp, end = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            IconButton(
                onClick = onToggleTorch,
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Color.Black.copy(alpha = 0.55f))
                    .testTag("scanner_torch_button")
            ) {
                Icon(
                    imageVector = if (isTorchOn) Icons.Default.FlashOn else Icons.Default.FlashOff,
                    contentDescription = "Toggle Torch",
                    tint = if (isTorchOn) AccentAmber else Color.White
                )
            }

            IconButton(
                onClick = onFlipCamera,
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Color.Black.copy(alpha = 0.55f))
                    .testTag("scanner_flip_button")
            ) {
                Icon(
                    imageVector = Icons.Default.Cameraswitch,
                    contentDescription = "Switch Camera",
                    tint = Color.White
                )
            }
        }

        // Center guide text pill just under the viewfinder box
        Box(
            modifier = Modifier
                .align(Alignment.Center)
                .offset(y = 100.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(Color.Black.copy(alpha = 0.7f))
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(EmeraldGreen)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = statusText,
                    color = Color.White,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}
