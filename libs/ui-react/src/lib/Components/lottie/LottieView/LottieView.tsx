import {
  resolveLottieSource,
  type LottieSource,
} from '@ledgerhq/lumen-utils-shared';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTheme } from '../../core/ThemeProvider';
import type { LottieViewProps } from './types';

// Numeric sources are Metro asset ids, which only exist on React Native.
const toWebSrc = (source: LottieSource): string | undefined => {
  if (typeof source === 'number') {
    return undefined;
  }
  return typeof source === 'string' ? source : source.uri;
};

/**
 * Plays a Lottie animation, picking the light or dark variant from the theme.
 * Control playback declaratively with `paused`, or imperatively through `ref`.
 *
 * @example
 * <LottieView animation={success} className='size-80' />
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
  className,
  ref,
  ...props
}: LottieViewProps) => {
  const { colorScheme: themeColorScheme } = useTheme();
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const wasPausedRef = useRef(paused);

  const src = toWebSrc(
    resolveLottieSource(animation, colorScheme ?? themeColorScheme),
  );

  useImperativeHandle(
    ref,
    () => ({
      play: () => dotLottie?.play(),
      pause: () => dotLottie?.pause(),
      stop: () => dotLottie?.stop(),
    }),
    [dotLottie],
  );

  useEffect(() => {
    if (wasPausedRef.current === paused) {
      return;
    }
    wasPausedRef.current = paused;
    if (paused) {
      dotLottie?.pause();
    } else {
      dotLottie?.play();
    }
  }, [paused, dotLottie]);

  useEffect(() => {
    if (!dotLottie) {
      return;
    }

    // Autoplay is driven here rather than by the player, so a source swap
    // (e.g. a theme change) replays while `paused` stays respected.
    const handleLoad = (): void => {
      if (autoPlay && !wasPausedRef.current) {
        dotLottie.play();
      }
      onLoad?.();
    };
    const handleComplete = (): void => onComplete?.();
    const handleLoop = (): void => onLoop?.();
    const handleLoadError = ({ error }: { error: Error }): void =>
      onError?.(error);

    dotLottie.addEventListener('load', handleLoad);
    dotLottie.addEventListener('complete', handleComplete);
    dotLottie.addEventListener('loop', handleLoop);
    dotLottie.addEventListener('loadError', handleLoadError);
    return () => {
      dotLottie.removeEventListener('load', handleLoad);
      dotLottie.removeEventListener('complete', handleComplete);
      dotLottie.removeEventListener('loop', handleLoop);
      dotLottie.removeEventListener('loadError', handleLoadError);
    };
  }, [dotLottie, autoPlay, onLoad, onComplete, onLoop, onError]);

  return (
    <div className={className} {...props}>
      <DotLottieReact
        src={src}
        autoplay={false}
        loop={loop}
        speed={speed}
        dotLottieRefCallback={setDotLottie}
      />
    </div>
  );
};
