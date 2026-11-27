import {
  resolveLottieSource,
  type LottieSource,
} from '@ledgerhq/lumen-utils-shared';
import RNLottieView, {
  type LottieViewProps as RNLottieViewProps,
} from 'lottie-react-native';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { StyleSheet } from 'react-native';
import { useResolveViewStyle, useTheme } from '../../../../styles';
import type { LottieViewProps } from './types';

const toNativeSource = (source: LottieSource): LottieSource =>
  typeof source === 'string' && /^https?:\/\//i.test(source)
    ? { uri: source }
    : source;

/**
 * Plays a Lottie animation, picking the light or dark variant from the theme.
 * Control playback declaratively with `paused`, or imperatively through `ref`.
 *
 * @example
 * <LottieView animation={success} lx={{ width: 's80', height: 's80' }} />
 *
 * @example
 * // Looping, forced to its dark variant
 * <LottieView animation={loading} colorScheme='dark' loop />
 */
export const LottieView = ({
  animation,
  colorScheme,
  autoPlay = true,
  loop = false,
  speed = 1,
  paused = false,
  onLoad,
  onComplete,
  onLoop,
  onError,
  lx = {},
  style,
  ref,
  ...props
}: LottieViewProps) => {
  const { colorScheme: themeColorScheme } = useTheme();
  const resolvedStyle = useResolveViewStyle(lx);
  const lottieRef = useRef<RNLottieView>(null);
  const hasCompletedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const wasPausedRef = useRef(paused);

  const source = toNativeSource(
    resolveLottieSource(
      animation,
      colorScheme ?? (themeColorScheme === 'light' ? 'light' : 'dark'),
    ),
  );
  const loopsFromJs = loop && onLoop !== undefined;

  const restart = useCallback((): void => {
    lottieRef.current?.reset();
    lottieRef.current?.resume();
  }, []);

  const play = useCallback((): void => {
    isPlayingRef.current = true;
    if (hasCompletedRef.current) {
      hasCompletedRef.current = false;
      restart();
      return;
    }
    lottieRef.current?.resume();
  }, [restart]);

  const pause = useCallback((): void => {
    isPlayingRef.current = false;
    lottieRef.current?.pause();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      play,
      pause,
      stop: () => {
        isPlayingRef.current = false;
        hasCompletedRef.current = false;
        lottieRef.current?.reset();
      },
    }),
    [play, pause],
  );

  const sourceKey = typeof source === 'object' ? source.uri : String(source);
  useEffect(() => {
    hasCompletedRef.current = false;
    isPlayingRef.current = false;
  }, [sourceKey]);

  useEffect(() => {
    if (wasPausedRef.current === paused) {
      return;
    }
    wasPausedRef.current = paused;
    if (paused) {
      pause();
    } else {
      play();
    }
  }, [paused, play, pause]);

  // On iOS, lottie-react-native's setSpeed calls play() whenever the animation
  // isn't playing, so a speed change would start an idle animation or replay a
  // finished one. We undo it so it lands before the next frame.
  const previousSpeedRef = useRef(speed);
  useLayoutEffect(() => {
    if (previousSpeedRef.current === speed) {
      return;
    }
    previousSpeedRef.current = speed;
    if (isPlayingRef.current) {
      return;
    }
    if (hasCompletedRef.current) {
      lottieRef.current?.reset();
    } else {
      lottieRef.current?.pause();
    }
  }, [speed]);

  const handleLoad = (): void => {
    if (autoPlay && !paused) {
      isPlayingRef.current = true;
      lottieRef.current?.play();
    }
    onLoad?.();
  };

  const handleFinish = (isCancelled: boolean): void => {
    if (isCancelled) {
      return;
    }
    if (loopsFromJs) {
      restart();
      onLoop?.();
      return;
    }
    isPlayingRef.current = false;
    hasCompletedRef.current = true;
    onComplete?.();
  };

  return (
    <RNLottieView
      {...props}
      ref={lottieRef}
      source={source as RNLottieViewProps['source']}
      autoPlay={false}
      loop={loop && !loopsFromJs}
      speed={speed}
      style={StyleSheet.flatten([style, resolvedStyle])}
      onAnimationLoaded={handleLoad}
      onAnimationFinish={handleFinish}
      onAnimationFailure={(error) => onError?.(new Error(error))}
    />
  );
};
