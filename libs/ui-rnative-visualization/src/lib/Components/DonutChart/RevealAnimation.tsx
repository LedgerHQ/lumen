import { RuntimeConstants } from '@ledgerhq/lumen-ui-rnative';
import { type ReactNode, useEffect } from 'react';
import Animated, {
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ClipPath, Defs, G, Path } from 'react-native-svg';

import { chartConfig } from '../../config';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export function computeRevealClipPath(R: number, progress: number): string {
  'worklet';
  if (progress >= 1) {
    return `M0,-${R} A${R},${R} 0 1 1 -0.001,-${R} Z`;
  }
  const angle = progress * 2 * Math.PI;
  const x = R * Math.sin(angle);
  const y = -R * Math.cos(angle);
  const largeArc = progress > 0.5 ? 1 : 0;
  return `M0,0 L0,-${R} A${R},${R} 0 ${largeArc} 1 ${x},${y} Z`;
}

type RevealAnimationProps = {
  R: number;
  activeOffset?: number;
  revealTrigger?: number;
  children: ReactNode;
};

export const RevealAnimation = ({
  R,
  activeOffset = 0,
  revealTrigger = 0,
  children,
}: RevealAnimationProps) => {
  const isReducedMotion = useReducedMotion();

  if (isReducedMotion || RuntimeConstants.isAndroid) {
    return <G transform={`translate(${R}, ${R})`}>{children}</G>;
  }

  return (
    <AnimatedReveal
      R={R}
      activeOffset={activeOffset}
      revealTrigger={revealTrigger}
    >
      {children}
    </AnimatedReveal>
  );
};

const AnimatedReveal = ({
  R,
  activeOffset = 0,
  revealTrigger = 0,
  children,
}: RevealAnimationProps) => {
  const revealProgress = useSharedValue(0);
  const clipR = R + activeOffset;

  useEffect(() => {
    revealProgress.value = 0;
    revealProgress.value = withTiming(1, {
      duration: chartConfig.donut.reveal.durationMs,
    });
  }, [revealProgress, revealTrigger]);

  const clipPathProps = useAnimatedProps(() => ({
    d: computeRevealClipPath(clipR, revealProgress.value),
  }));

  return (
    <>
      <Defs>
        <ClipPath id='donut-reveal-clip'>
          <AnimatedPath animatedProps={clipPathProps} />
        </ClipPath>
      </Defs>
      <G transform={`translate(${R}, ${R})`} clipPath='url(#donut-reveal-clip)'>
        {children}
      </G>
    </>
  );
};
