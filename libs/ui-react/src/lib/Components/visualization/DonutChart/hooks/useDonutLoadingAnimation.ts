import { useId, useMemo } from 'react';

import { chartConfig } from '../../config';

const { loading } = chartConfig.donut;

const FULL_TURN = 2 * Math.PI;

type DonutLoadingAnimationResult = {
  animationStyle: string;
  keyframe: string;
  getSegmentDelay: (midAngle: number) => string;
};

export const useDonutLoadingAnimation = (): DonutLoadingAnimationResult => {
  const id = useId();
  const animationName = `donut-loading-wave-${id.replaceAll(':', '')}`;

  return useMemo(
    () => ({
      animationStyle: `${animationName} ${loading.durationInSeconds}s ${loading.easing} infinite`,
      keyframe:
        `@keyframes ${animationName} { 0%, 100% { opacity: 1; } 50% { opacity: ${loading.minOpacity}; } } ` +
        `@media (prefers-reduced-motion: reduce) { @keyframes ${animationName} { 0%, 100% { opacity: 1; } } }`,
      getSegmentDelay: (midAngle: number): string =>
        `-${((FULL_TURN - midAngle) / FULL_TURN) * loading.durationInSeconds}s`,
    }),
    [animationName],
  );
};
