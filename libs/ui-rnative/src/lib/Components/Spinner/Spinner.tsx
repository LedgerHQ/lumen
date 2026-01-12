import { forwardRef, memo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useCommonTranslation } from '../../../i18n';
import { useResolveTextStyle, useTheme } from '../../../styles';
import { Box } from '../Utility';
import { SpinnerProps } from './types';

const SpinAnimation = memo(({ children }: { children: React.ReactNode }) => {
  const spinValue = useSharedValue(0);

  useEffect(() => {
    spinValue.value = withRepeat(withTiming(1, { duration: 1000 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(spinValue.value, [0, 1], [0, 360])}deg` },
    ],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});
SpinAnimation.displayName = 'SpinAnimation';

/**
 * A basic spinner component for loading states.
 *
 * @example
 * <Spinner />
 *
 * @example
 * // With custom color using lx prop
 * <Spinner lx={{ color: 'interactive' }} />
 *
 * @example
 * // With lx props for layout and color
 * <Spinner lx={{ marginTop: 's8', color: 'muted' }} />
 */
export const Spinner = forwardRef<View, SpinnerProps>(
  ({ lx = {}, size = 16, color, ...props }, ref) => {
    const { t } = useCommonTranslation();
    const { theme } = useTheme();
    const resolvedColorStyle = useResolveTextStyle({ color });
    const strokeColor = resolvedColorStyle?.color ?? theme.colors.text.base;

    return (
      <Box ref={ref} lx={{ flexShrink: 0, ...lx }} {...props}>
        <SpinAnimation>
          <Svg
            width={size}
            height={size}
            viewBox='0 0 16 16'
            fill='none'
            accessibilityLabel={t('components.spinner.loadingAriaLabel')}
          >
            <Path
              d='M8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8'
              stroke={strokeColor}
              strokeWidth='1.5'
              strokeLinecap='round'
            />
          </Svg>
        </SpinAnimation>
      </Box>
    );
  },
);

Spinner.displayName = 'Spinner';
