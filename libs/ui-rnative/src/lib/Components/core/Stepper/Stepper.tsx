import {
  getStepperCalculations,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { useEffect, useId } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Mask } from 'react-native-svg';
import { useCommonTranslation } from '../../../../i18n';
import { useTheme } from '../../../../styles';
import { useTimingConfig } from '../../animations/useTimingConfig';
import { Box } from '../../primitives/Box';
import { Text } from '../../primitives/Text';
import type { StepperProps } from './types';

const SIZES = {
  md: { px: 48, strokeWidth: 4, token: 's48', typography: 'body2' },
  lg: { px: 72, strokeWidth: 6, token: 's72', typography: 'heading4' },
} as const;

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
 * Renders a segmented track with progress and a center label.
 *
 * @see [Figma – Stepper](https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=11977-94&m=dev)
 *
 * @example
 * <Stepper currentStep={1} totalSteps={4} />
 * <Stepper currentStep={0} totalSteps={8} disabled /> // Empty progress, disabled style
 * <Stepper currentStep={2} totalSteps={4} size="lg" />
 */
export const Stepper = ({
  lx = {},
  appearance = 'accent',
  size = 'md',
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
  const maskId = useId();
  const { t } = useCommonTranslation();
  const { theme } = useTheme();
  const {
    px: diameter,
    strokeWidth,
    token: sizeToken,
    typography,
  } = SIZES[size];

  const {
    displayLabel,
    r,
    cx,
    cy,
    progressDashArray,
    progressMaskDashArray,
    progressDashOffset,
    dashPatternOffset,
  } = getStepperCalculations({
    currentStep,
    totalSteps,
    size: diameter,
    label,
    strokeWidth,
  });

  const activeColor =
    appearance === 'success'
      ? theme.colors.border.success
      : theme.colors.border.active;

  const progressColor = disabled
    ? theme.colors.border.mutedSubtleHover
    : activeColor;

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
        width: sizeToken,
        height: sizeToken,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'full',
        ...lx,
      }}
      {...props}
    >
      <Svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill='none'
          stroke={theme.colors.border.mutedSubtle}
          strokeLinecap='round'
          strokeWidth={strokeWidth}
          strokeDasharray={progressDashArray}
          strokeDashoffset={dashPatternOffset}
        />
        <Defs>
          <Mask
            id={maskId}
            maskUnits='userSpaceOnUse'
            x={0}
            y={0}
            width={diameter}
            height={diameter}
          >
            <AnimatedCircle
              cx={cx}
              cy={cy}
              r={r}
              fill='none'
              stroke='white'
              strokeWidth={strokeWidth}
              strokeDasharray={progressMaskDashArray}
              animatedProps={animatedProgress}
            />
          </Mask>
        </Defs>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill='none'
          stroke={progressColor}
          strokeLinecap='round'
          strokeWidth={strokeWidth}
          strokeDasharray={progressDashArray}
          strokeDashoffset={dashPatternOffset}
          mask={`url(#${maskId})`}
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
            typography={typography}
            lx={{ color: disabled ? 'disabled' : 'base' }}
            maxFontSizeMultiplier={1.4}
            numberOfLines={1}
          >
            {label}
          </Text>
        ) : (
          <>
            <Text
              typography={typography}
              lx={{ color: disabled ? 'disabled' : 'base' }}
              maxFontSizeMultiplier={1.4}
            >
              {Math.min(Math.max(currentStep, 0), totalSteps)}
            </Text>
            <Text
              typography={typography}
              lx={{ color: disabled ? 'disabled' : 'muted' }}
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
