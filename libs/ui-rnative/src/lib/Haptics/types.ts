/**
 * Impact feedback style for haptic feedback on press.
 *
 * Uses expo-haptics impact feedback. Maps to ImpactFeedbackStyle on both
 * iOS (UIImpactFeedbackStyle) and Android (simulated via Vibrator).
 *
 * - `'light'`  — Quick, subtle tap
 * - `'medium'` — Moderate impact
 * - `'heavy'`  — Strong, pronounced impact
 * - `'soft'`   — Soft collision (large compression/elasticity)
 * - `'rigid'`  — Rigid collision (small compression/elasticity)
 */
export type HapticFeedback = 'light' | 'medium' | 'heavy' | 'soft' | 'rigid';
