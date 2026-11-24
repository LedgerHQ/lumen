import {
  resolveLottieSource,
  type LottieSource,
} from '@ledgerhq/lumen-utils-shared';
import RNLottieView, {
  type LottieViewProps as RNLottieViewProps,
} from 'lottie-react-native';
import { useEffect, useImperativeHandle, useRef } from 'react';
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
  testID,
  ref,
}: LottieViewProps) => {
  const { colorScheme: themeColorScheme } = useTheme();
  const resolvedStyle = useResolveViewStyle(lx);
  const lottieRef = useRef<RNLottieView>(null);
  const hasCompletedRef = useRef(false);
  const wasPausedRef = useRef(paused);

  const source = toNativeSource(
    resolveLottieSource(
      animation,
      colorScheme ?? (themeColorScheme === 'light' ? 'light' : 'dark'),
    ),
  );
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

  const sourceKey = typeof source === 'object' ? source.uri : String(source);
  useEffect(() => {
    hasCompletedRef.current = false;
  }, [sourceKey]);

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

  const previousSpeedRef = useRef(speed);
  useEffect(() => {
    if (previousSpeedRef.current === speed) {
      return;
    }
    previousSpeedRef.current = speed;
    if (paused) {
      lottieRef.current?.pause();
    }
  }, [speed, paused]);

  const handleLoad = (): void => {
    if (autoPlay && !paused) {
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
    hasCompletedRef.current = true;
    onComplete?.();
  };

  return (
    <RNLottieView
      ref={lottieRef}
      source={source as RNLottieViewProps['source']}
      autoPlay={false}
      loop={loop && !loopsFromJs}
      speed={speed}
      style={StyleSheet.flatten([style, resolvedStyle])}
      testID={testID}
      onAnimationLoaded={handleLoad}
      onAnimationFinish={handleFinish}
      onAnimationFailure={(error) => onError?.(new Error(error))}
    />
  );
};
