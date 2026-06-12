import { useId, useMemo } from 'react';
import type { CSSProperties } from 'react';

import type { DrawingArea, Series } from '../../../utils/types';

/**
 * Duration in seconds of an individual point's opacity fade-in.
 */
const POINT_FADE_DURATION = 0.2;

type RevealAnimationConfig = {
  duration: number;
  easing: string;
  drawingArea: DrawingArea;
};

/**
 * Creates the reveal animation for the chart.
 * It returns
 * - the clip id
 * - the clip path animation
 * - and the fade animation.
 */
export const useRevealAnimation = ({
  duration,
  easing,
  drawingArea,
}: RevealAnimationConfig) => {
  const clipId = useId();
  const revealFadeAnimation = useRevealFadeAnimation({
    clipId,
    duration,
    easing,
  });

  const revealClipPathAnimation = useRevealClipPathAnimation({
    clipId,
    duration,
    easing,
    drawingArea,
  });

  return useMemo(
    () => ({
      clipId,
      clipPathAttr: `url(#${clipId})`,
      clipPathAnimation: revealClipPathAnimation,
      fadeAnimation: revealFadeAnimation,
    }),
    [clipId, revealClipPathAnimation, revealFadeAnimation],
  );
};

/**
 * Creates the fade animation for the chart.
 */
const useRevealFadeAnimation = ({
  clipId,
  duration,
  easing,
}: {
  clipId: string;
  duration: number;
  easing: string;
}) => {
  const fadeAnimationName = `reveal-fade-${clipId.replaceAll(':', '')}`;

  return useMemo(
    () => ({
      keyframe: `@keyframes ${fadeAnimationName} { from { opacity: 0; } to { opacity: 1; } }`,
      getPointRevealStyle: (): CSSProperties => {
        const delay = Math.max(0, duration - 0.1);
        return {
          animation: `${fadeAnimationName} ${POINT_FADE_DURATION}s ${easing} ${delay}s both`,
        };
      },
    }),
    [duration, easing, fadeAnimationName],
  );
};

/**
 * Creates the clip path animation for the chart.
 */
const useRevealClipPathAnimation = ({
  clipId,
  duration,
  easing,
  drawingArea,
}: {
  clipId: string;
  duration: number;
  easing: string;
  drawingArea: DrawingArea;
}) => {
  const clipAnimationName = `reveal-clip-${clipId.replaceAll(':', '')}`;
  const fullWidth = drawingArea.width;

  return useMemo(
    () => ({
      keyframe: `@keyframes ${clipAnimationName} { from { width: 0; } to { width: ${fullWidth}px; } }`,
      style: `${clipAnimationName} ${duration}s ${easing} forwards`,
    }),
    [clipAnimationName, duration, easing, fullWidth],
  );
};

export const useDataFingerprint = ({
  series,
}: {
  series: Series[];
}): string => {
  return series.map((s) => s.data?.join(',') ?? '').join('|');
};
