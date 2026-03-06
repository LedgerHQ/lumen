/**
 * Defines the intensity of haptic feedback triggered on press.
 *
 * Uses expo-haptics impact feedback. Maps to ImpactFeedbackStyle on both
 * iOS (UIImpactFeedbackStyle) and Android (simulated via Vibrator).
 *
 * - `'light'`  — Quick, subtle tap
 * - `'medium'` — Moderate impact
 * - `'heavy'`  — Strong, pronounced impact
 */
export type HapticFeedback = 'light' | 'medium' | 'heavy';
