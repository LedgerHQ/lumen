/**
 * Defines the intensity of haptic feedback triggered on press.
 *
 * Uses React Native's `Vibration` API.
 * On Android, maps to different vibration durations.
 * On iOS, the Vibration API always triggers a fixed system vibration
 *
 * - `'light'`  — Quick, subtle tap (10ms on Android)
 * - `'medium'` — Moderate vibration (25ms on Android)
 * - `'heavy'`  — Strong, pronounced vibration (50ms on Android)
 */
export type HapticFeedback = 'light' | 'medium' | 'heavy';
