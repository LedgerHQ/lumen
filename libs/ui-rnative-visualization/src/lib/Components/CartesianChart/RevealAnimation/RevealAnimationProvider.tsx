import { RuntimeConstants } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';

import Animated from 'react-native-reanimated';
import { ClipPath, Defs, Rect } from 'react-native-svg';

import { OVERFLOW_BUFFER } from '../utils';

import { RevealAnimationContext } from './context';
import type { RevealAnimationProps } from './types';
import { useDataFingerprint, useRevealAnimation } from './utils';

const DEFAULT_DURATION_IN_SECONDS = 0.8;

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export function RevealAnimationProvider({
  children,
  drawingArea,
  series,
  animate = true,
  transitions,
}: RevealAnimationProps) {
  /**
   * Disable reveal animation on Android devices due to issues with SVG clip-path animation support.
   * On Android, the animation does not render correctly, so we opt out for a consistent user experience.
   */
  const isDisabled = !animate || RuntimeConstants.isAndroid;
  const durationMs =
    (transitions?.enter?.duration ?? DEFAULT_DURATION_IN_SECONDS) * 1000;

  const dataFingerprint = useDataFingerprint(series);
  const { clipId, animatedRectProps, pointOpacity } = useRevealAnimation({
    durationMs,
    drawingArea,
    dataFingerprint,
  });

  const contextValue = useMemo(
    () => ({ clipPathAttr: `url(#${clipId})`, pointOpacity }),
    [clipId, pointOpacity],
  );

  if (isDisabled) {
    return children;
  }

  return (
    <RevealAnimationContext.Provider value={contextValue}>
      <Defs>
        <ClipPath id={clipId}>
          <AnimatedRect
            x={drawingArea.x - OVERFLOW_BUFFER.left}
            y={drawingArea.y - OVERFLOW_BUFFER.top}
            height={
              drawingArea.height + OVERFLOW_BUFFER.top + OVERFLOW_BUFFER.bottom
            }
            animatedProps={animatedRectProps}
          />
        </ClipPath>
      </Defs>
      {children}
    </RevealAnimationContext.Provider>
  );
}
