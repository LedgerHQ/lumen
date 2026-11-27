export type LottieSource = string | number | { uri: string };

export type LottieColorScheme = 'light' | 'dark';

export type LottieAnimation = Record<LottieColorScheme, LottieSource>;

export type LottieViewBaseProps = {
  /**
   * The animation to play: a single source, or a variant per color scheme.
   */
  animation: LottieSource | LottieAnimation;
  /**
   * Forces the light or dark variant. Follows the theme by default.
   */
  colorScheme?: LottieColorScheme;
  /**
   * Plays as soon as it loads.
   * @default true
   */
  autoPlay?: boolean;
  /**
   * Repeats when it ends.
   * @default false
   */
  loop?: boolean;
  /**
   * Playback speed.
   * @default 1
   */
  speed?: number;
  /**
   * Pauses the animation.
   * @default false
   */
  paused?: boolean;
  /**
   * Called when the animation is loaded.
   */
  onLoad?: () => void;
  /**
   * Called when the animation ends.
   */
  onComplete?: () => void;
  /**
   * Called each time the animation loops. On React Native, setting it replays
   * each loop from JS instead of looping natively.
   */
  onLoop?: () => void;
  /**
   * Called when the animation fails to load.
   */
  onError?: (error: Error) => void;
};

export type LottieViewRef = {
  /**
   * Plays the animation.
   */
  play: () => void;
  /**
   * Pauses the animation.
   */
  pause: () => void;
  /**
   * Pauses and goes back to the first frame.
   */
  stop: () => void;
};
