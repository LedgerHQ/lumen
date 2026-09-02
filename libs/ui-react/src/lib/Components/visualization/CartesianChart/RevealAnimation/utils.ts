import { useId, useMemo } from 'react';
import type { CSSProperties } from 'react';

import { chartConfig } from '../../config';
import type { DrawingArea, Series } from '../../utils/types';

const { reveal } = chartConfig;

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
        const delay = Math.max(
          0,
          duration + reveal.pointFadeInAfterClipInSeconds,
        );
        return {
          animation: `${fadeAnimationName} ${reveal.pointFadeDurationInSeconds}s ${easing} ${delay}s both`,
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

/**
 * Stable signature of every series' data points, memoized on the `series`
 * reference. Used to key the reveal provider so the reveal animation only
 * replays when the underlying data actually changes — not on unrelated
 * re-renders such as scrubbing or hover.
 */
export const useDataFingerprint = (series: Series[]): string => {
  return useMemo(
    () => series.map((s) => s.data?.join(',') ?? '').join('|'),
    [series],
  );
};
