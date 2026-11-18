import RNLottieView, {
  type LottieViewProps as RNLottieViewProps,
} from 'lottie-react-native';
import { useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useResolveViewStyle, useTheme } from '../../../../styles';
import type { LottieViewProps } from './types';

/**
 * Plays a Lottie animation, picking the light or dark variant from the theme.
 * Control playback declaratively with `paused`, or imperatively through `ref`.
 *
 * @example
 * <LottieView animation={success} lx={{ width: 's80', height: 's80' }} />
 *
 * @example
 * // Looping, forced to its dark variant
 * <LottieView animation={loading} appearance='dark' loop />
 */
export const LottieView = ({
  animation,
  appearance,
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
  testID,
  ref,
}: LottieViewProps) => {
  const { colorScheme } = useTheme();
  const resolvedStyle = useResolveViewStyle(lx);
  const lottieRef = useRef<RNLottieView>(null);
  const hasCompletedRef = useRef(false);
  const wasPausedRef = useRef(paused);

  const resolvedAppearance =
    appearance ?? (colorScheme === 'light' ? 'light' : 'dark');
  const source = animation[resolvedAppearance];
  const loopsFromJs = loop && onLoop !== undefined;

  const restart = (): void => {
    lottieRef.current?.reset();
    lottieRef.current?.resume();
  };

  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        if (hasCompletedRef.current) {
          hasCompletedRef.current = false;
          restart();
          return;
        }
        lottieRef.current?.resume();
      },
      pause: () => lottieRef.current?.pause(),
      stop: () => {
        hasCompletedRef.current = false;
        lottieRef.current?.reset();
      },
    }),
    [],
  );

  useEffect(() => {
    hasCompletedRef.current = false;
  }, [source]);

  useEffect(() => {
    if (wasPausedRef.current === paused) {
      return;
    }
    wasPausedRef.current = paused;
    if (paused) {
      lottieRef.current?.pause();
    } else {
      lottieRef.current?.resume();
    }
  }, [paused]);

  const handleFinish = (isCancelled: boolean): void => {
    if (isCancelled) {
      return;
    }
    if (loopsFromJs) {
      onLoop?.();
      restart();
      return;
    }
    hasCompletedRef.current = true;
    onComplete?.();
  };

  return (
    <RNLottieView
      ref={lottieRef}
      source={source as RNLottieViewProps['source']}
      autoPlay={autoPlay && !paused}
      loop={loop && !loopsFromJs}
      speed={speed}
      style={StyleSheet.flatten([style, resolvedStyle])}
      testID={testID}
      onAnimationLoaded={onLoad}
      onAnimationFinish={handleFinish}
      onAnimationFailure={(error) => onError?.(new Error(error))}
    />
  );
};
