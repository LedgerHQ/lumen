import { useId, useMemo } from 'react';

import { chartConfig } from '../../../config';

const { loading } = chartConfig.donut;

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
        `-${((2 * Math.PI - midAngle) / (2 * Math.PI)) * loading.durationInSeconds}s`,
    }),
    [animationName],
  );
};
