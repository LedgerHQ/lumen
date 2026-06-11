import { RuntimeConstants } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';

import Animated from 'react-native-reanimated';
import { ClipPath, Defs, Rect } from 'react-native-svg';

import { useDataFingerprint } from '../hooks/useDataFingerprint';
import { useRevealClipAnimation } from '../hooks/useRevealClipAnimation';
import { OVERFLOW_BUFFER } from '../utils';

import { RevealClipContext } from './context';
import type { RevealClipDefsProps } from './types';

const DEFAULT_DURATION_IN_SECONDS = 0.8;

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export function RevealClipDefs({
  children,
  drawingArea,
  series,
  animate = true,
  transitions,
}: RevealClipDefsProps) {
  /**
   * Disable reveal animation on Android devices due to issues with SVG clip-path animation support.
   * On Android, the animation does not render correctly, so we opt out for a consistent user experience.
   */
  const isDisabled = !animate || RuntimeConstants.isAndroid;
  const durationMs =
    (transitions?.enter?.duration ?? DEFAULT_DURATION_IN_SECONDS) * 1000;

  const dataFingerprint = useDataFingerprint(series);
  const { clipId, animatedRectProps } = useRevealClipAnimation({
    durationMs,
    drawingArea,
    dataFingerprint,
  });

  const contextValue = useMemo(
    () => ({ clipPathAttr: `url(#${clipId})` }),
    [clipId],
  );

  if (isDisabled) {
    return children;
  }

  return (
    <RevealClipContext.Provider key={dataFingerprint} value={contextValue}>
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
    </RevealClipContext.Provider>
  );
}
