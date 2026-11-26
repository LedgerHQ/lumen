import successLottie from './assets/lottie-success.lottie';
import type { LottieAnimation } from './types';

// TODO: no dark variant yet, so both appearances share one file.
export const success: LottieAnimation = {
  light: successLottie,
  dark: successLottie,
};
