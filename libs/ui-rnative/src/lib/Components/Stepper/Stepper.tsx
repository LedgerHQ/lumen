import {
  getStepperCalculations,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useCommonTranslation } from '../../../i18n';
import { useTheme } from '../../../styles';
import { useTimingConfig } from '../../Animations/useTimingConfig';
import { Box } from '../Utility/Box';
import { Text } from '../Utility/Text';
import type { StepperProps } from './types';

const SIZE = 48;
const STROKE_WIDTH = 4;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const useAnimatedProgress = ({
  progressDashOffset,
}: {
  progressDashOffset: number;
}) => {
  const animatedOffset = useSharedValue(progressDashOffset);
  const timingConfig = useTimingConfig({
    duration: 300,
    easing: 'easeInOut',
  });

  useEffect(() => {
    animatedOffset.value = withTiming(progressDashOffset, timingConfig);
    return () => cancelAnimation(animatedOffset);
  }, [progressDashOffset, animatedOffset, timingConfig]);

  const animatedProgress = useAnimatedProps(
    () => ({
      strokeDashoffset: animatedOffset.value,
    }),
    [animatedOffset],
  );

  return animatedProgress;
};

/**
 * A circular stepper component showing progress as current step out of total steps.
 * Renders a track arc with a progress arc and a center label.
 *
 * @see [Figma – Stepper](https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=11977-94&m=dev)
 *
 * @example
 * <Stepper currentStep={1} totalSteps={4} />
 * <Stepper currentStep={0} totalSteps={9} disabled /> // Shows minimal dot, disabled style
 */
export const Stepper = ({
  lx = {},
  currentStep,
  totalSteps,
  disabled: disabledProp = false,
  label,
  ref,
  ...props
}: StepperProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Stepper',
    mergeWith: { disabled: disabledProp },
  });
  const { t } = useCommonTranslation();
  const { theme } = useTheme();

  const {
    displayLabel,
    r,
    cx,
    cy,
    trackDashArray,
    progressDashArray,
    progressDashOffset,
  } = getStepperCalculations({
    currentStep,
    totalSteps,
    size: SIZE,
    label,
    strokeWidth: STROKE_WIDTH,
  });

  const animatedProgress = useAnimatedProgress({
    progressDashOffset,
  });

  return (
    <Box
      ref={ref}
      accessibilityRole='progressbar'
      accessibilityValue={{
        now: currentStep,
        min: 1,
        max: totalSteps,
        text: displayLabel,
      }}
      accessibilityLabel={
        label ??
        t('components.stepper.progressAriaLabel', {
          currentStep: Math.min(Math.max(currentStep, 0), totalSteps),
          totalSteps,
        })
      }
      lx={{
        width: 's48',
        height: 's48',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'full',
        ...lx,
      }}
      {...props}
    >
      <Svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: [{ rotate: '135deg' }] }}
      >
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill='none'
          stroke={theme.colors.border.mutedSubtle}
          strokeLinecap='round'
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={trackDashArray}
          strokeDashoffset={0}
        />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={r}
          fill='none'
          stroke={
            disabled
              ? theme.colors.border.mutedSubtleHover
              : theme.colors.border.active
          }
          strokeLinecap='round'
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={progressDashArray}
          animatedProps={animatedProgress}
        />
      </Svg>
      <Box
        lx={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          top: 's0',
          left: 's0',
          right: 's0',
          bottom: 's0',
        }}
      >
        {label ? (
          <Text
            typography='body2SemiBold'
            lx={{ color: 'base' }}
            maxFontSizeMultiplier={1.4}
          >
            {label}
          </Text>
        ) : (
          <>
            <Text
              typography='body1SemiBold'
              lx={{ color: 'base' }}
              maxFontSizeMultiplier={1.4}
            >
              {Math.min(Math.max(currentStep, 0), totalSteps)}
            </Text>
            <Text
              typography='body2SemiBold'
              lx={{ color: 'muted' }}
              maxFontSizeMultiplier={1.4}
            >
              /{totalSteps}
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
};
