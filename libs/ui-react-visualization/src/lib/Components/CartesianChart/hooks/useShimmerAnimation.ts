import { useId, useMemo } from 'react';

import { chartConfig } from '../../../config';

const { shimmer } = chartConfig;

type ShimmerAnimationResult = {
  /**
   * Value for the CSS `animation` shorthand, applied via `style` on the
   * element that should shimmer.
   */
  animationStyle: string;
  /**
   * `@keyframes` definition to inject inside an SVG `<style>` element.
   */
  keyframe: string;
};

/**
 * Self-contained shimmer (opacity pulse) for SVG content. Shared by the initial
 * loading placeholder and the transition-loading line.
 */
export const useShimmerAnimation = (): ShimmerAnimationResult => {
  const id = useId();
  const animationName = `shimmer-pulse-${id.replaceAll(':', '')}`;

  return useMemo(
    () => ({
      animationStyle: `${animationName} ${shimmer.pulseDurationInSeconds}s ${shimmer.pulseEasing} infinite`,
      keyframe:
        `@keyframes ${animationName} { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } } ` +
        `@media (prefers-reduced-motion: reduce) { @keyframes ${animationName} { 0%, 100% { opacity: 1; } } }`,
    }),
    [animationName],
  );
};
