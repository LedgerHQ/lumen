import { useId, useMemo } from 'react';

import type { DrawingArea } from '../../../utils/types';
import { OVERFLOW_BUFFER } from '../utils';

type RevealClipAnimationConfig = {
  duration: number;
  easing: string;
  drawingArea: DrawingArea;
};

type RevealClipAnimationResult = {
  clipId: string;
  animationStyle: string;
  keyframe: string;
};

export const useRevealClipAnimation = ({
  duration,
  easing,
  drawingArea,
}: RevealClipAnimationConfig): RevealClipAnimationResult => {
  const clipId = useId();
  const animationName = `reveal-clip-${clipId.replaceAll(':', '')}`;

  return useMemo(
    () => ({
      clipId,
      animationStyle: `${animationName} ${duration}s ${easing} forwards`,
      keyframe: `@keyframes ${animationName} { from { width: 0; } to { width: ${drawingArea.width + OVERFLOW_BUFFER.left + OVERFLOW_BUFFER.right}px; } }`,
    }),
    [clipId, animationName, duration, easing, drawingArea.width],
  );
};
