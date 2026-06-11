import { useMemo } from 'react';


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

  const dataFingerprint = useDataFingerprint({ series });
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
            x={drawingArea.x}
            y={drawingArea.y}
            height={drawingArea.height}
            width={drawingArea.width}
            style={{ animation: clipPathAnimation.style }}
          />
        </clipPath>
      </defs>
      <style>{`${clipPathAnimation.keyframe} ${fadeAnimation.keyframe}`}</style>
      {children}
    </RevealAnimationContext.Provider>
  );
}
