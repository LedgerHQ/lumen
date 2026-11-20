import type { LottieAnimation, LottieColorScheme, LottieSource } from './types';

const isLottieAnimation = (
  animation: LottieSource | LottieAnimation,
): animation is LottieAnimation =>
  typeof animation === 'object' && 'light' in animation && 'dark' in animation;

export const resolveLottieSource = (
  animation: LottieSource | LottieAnimation,
  colorScheme: LottieColorScheme,
): LottieSource =>
  isLottieAnimation(animation) ? animation[colorScheme] : animation;
