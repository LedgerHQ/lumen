import { useMemo } from 'react';
import { useRevealClipAnimation } from '../hooks/useRevealClipAnimation';
import { OVERFLOW_BUFFER } from '../utils';

import { RevealClipContext } from './context';
import type { RevealClipDefsProps } from './types';
import { computeDataFingerprint } from './utils';

const DEFAULT_DURATION_IN_SECONDS = 0.8;
const DEFAULT_EASING = 'linear';

export function RevealClipDefs({
  children,
  drawingArea,
  series,
  animate = true,
  transitions,
}: RevealClipDefsProps) {
  const isDisabled = !animate;
  const duration = transitions?.enter?.duration ?? DEFAULT_DURATION_IN_SECONDS;
  const easing = transitions?.enter?.easing ?? DEFAULT_EASING;

  const dataFingerprint = useMemo(
    () => computeDataFingerprint({ series }),
    [series],
  );
  const { clipId, animationStyle, keyframe } = useRevealClipAnimation({
    duration,
    easing,
    drawingArea,
  });

  const contextValue = useMemo(
    () => ({
      clipPathAttr: `url(#${clipId})`,
    }),
    [clipId],
  );

  if (isDisabled) {
    return <>{children}</>;
  }

  return (
    <RevealClipContext.Provider key={dataFingerprint} value={contextValue}>
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
            style={{ animation: animationStyle }}
          />
        </clipPath>
      </defs>
      <style>{keyframe}</style>
      {children}
    </RevealClipContext.Provider>
  );
}
