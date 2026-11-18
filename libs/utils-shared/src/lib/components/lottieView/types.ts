export type LottieSource = string | number | { uri: string };

export type LottieAppearance = 'light' | 'dark';

export type LottieAnimation = Record<LottieAppearance, LottieSource>;

export type LottieViewBaseProps = {
  /**
   * The animation to play, with a variant per appearance.
   */
  animation: LottieAnimation;
  /**
   * Forces light or dark. Follows the theme by default.
   */
  appearance?: LottieAppearance;
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
   * Called each time the animation loops.
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
