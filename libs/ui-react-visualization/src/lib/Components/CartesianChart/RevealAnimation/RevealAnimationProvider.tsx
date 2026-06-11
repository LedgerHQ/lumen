import { useMemo } from 'react';

import { OVERFLOW_BUFFER } from '../utils';

import { RevealAnimationContext } from './context';
import type { RevealAnimationProps } from './types';
import { useRevealAnimation, useDataFingerprint } from './utils';

const DEFAULT_DURATION_IN_SECONDS = 0.8;
const DEFAULT_EASING = 'linear';

export function RevealAnimationProvider({
  children,
  drawingArea,
  series,
  animate = true,
  transitions,
}: RevealAnimationProps) {
  const isDisabled = !animate;
  const duration = transitions?.enter?.duration ?? DEFAULT_DURATION_IN_SECONDS;
  const easing = transitions?.enter?.easing ?? DEFAULT_EASING;

  const dataFingerprint = useDataFingerprint(series);
  const { clipId, clipPathAttr, clipPathAnimation, fadeAnimation } =
    useRevealAnimation({
      duration,
      easing,
      drawingArea,
    });

  const contextValue = useMemo(
    () => ({
      clipPathAttr,
      getPointRevealStyle: fadeAnimation.getPointRevealStyle,
    }),
    [clipPathAttr, fadeAnimation],
  );

  if (isDisabled) {
    return <>{children}</>;
  }

  return (
    <RevealAnimationContext.Provider key={dataFingerprint} value={contextValue}>
      <defs>
        <clipPath id={clipId}>
          <rect
            x={drawingArea.x - OVERFLOW_BUFFER.left}
            y={drawingArea.y - OVERFLOW_BUFFER.top}
            height={
              drawingArea.height + OVERFLOW_BUFFER.top + OVERFLOW_BUFFER.bottom
            }
            width={
              drawingArea.width + OVERFLOW_BUFFER.left + OVERFLOW_BUFFER.right
            }
            style={{ animation: clipPathAnimation.style }}
          />
        </clipPath>
      </defs>
      <style>{`${clipPathAnimation.keyframe} ${fadeAnimation.keyframe}`}</style>
      {children}
    </RevealAnimationContext.Provider>
  );
}
