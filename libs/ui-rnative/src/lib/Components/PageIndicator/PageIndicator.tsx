import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useStyleSheet, useTheme } from '../../../styles';
import { Box } from '../Utility';
import { PageIndicatorProps } from './types';
import { useEffect, useRef } from 'react';

const AnimatedBox = Animated.createAnimatedComponent(Box);

type PageIndicatorDotProps = {
  index: number;
  isActive: boolean;
  isShrunk: boolean;
};

const MAX_NUMBER_OF_DOTS = 4;

const PageIndicatorDot = ({
  index,
  isActive,
  isShrunk,
}: PageIndicatorDotProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const colorProgress = useSharedValue(0);
  const shrinkProgress = useSharedValue(0);

  useEffect(() => {
    colorProgress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive]);

  useEffect(() => {
    shrinkProgress.value = withTiming(isShrunk ? 1 : 0, { duration: 200 });
  }, [isShrunk]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      [theme.colors.bg.mutedHover, theme.colors.bg.mutedStrong],
    );
    const size = interpolate(
      shrinkProgress.value,
      [0, 1],
      [theme.sizes.s6, theme.sizes.s4],
    );
    return {
      backgroundColor,
      height: size,
      width: size,
    };
  });

  return <AnimatedBox style={[styles.dot, animatedStyle]} />;
};

export const PageIndicator = ({
  currentPage,
  totalPages,
  lx = {},
  ref,
  ...props
}: PageIndicatorProps) => {
  const styles = useStyles();
  const activeDotProgress = useSharedValue(0);

  useEffect(() => {
    activeDotProgress.value = withTiming(currentPage, { duration: 200 });
  }, [currentPage]);

  const prevPage = useRef(currentPage);
  const direction = currentPage > prevPage.current ? 'forward' : 'backward';

  useEffect(() => {
    prevPage.current = currentPage;
  }, [currentPage]);

  const forwardAnchor = MAX_NUMBER_OF_DOTS - 2;
  const backwardAnchor = 1;

  const anchorIndex = direction === 'forward' ? forwardAnchor : backwardAnchor;

  const visibleDots = Math.min(totalPages, MAX_NUMBER_OF_DOTS);
  const lastPage = totalPages - 1;

  const windowStart = Math.max(
    0,
    Math.min(currentPage - anchorIndex, lastPage - (visibleDots - 1)),
  );

  const isActive = (index: number) => windowStart + index === currentPage;

  const isShrunk = (index: number) =>
    (index === 0 && windowStart > 0) ||
    (index === visibleDots - 1 && windowStart + visibleDots - 1 < lastPage);

  return (
    <Box
      ref={ref}
      accessibilityRole='none'
      lx={{ ...lx }}
      style={styles.container}
      {...props}
    >
      {Array.from({ length: Math.min(totalPages, MAX_NUMBER_OF_DOTS) }).map(
        (_, index) => (
          <PageIndicatorDot
            key={index}
            index={index}
            isActive={isActive(index)}
            isShrunk={isShrunk(index)}
          />
        ),
      )}
    </Box>
  );
};

PageIndicator.displayName = 'PageIndicator';

const useStyles = () =>
  useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        gap: t.spacings.s4,
        alignItems: 'center',
      },
      dot: {
        height: t.sizes.s6,
        aspectRatio: 1,
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.mutedHover,
      },
    }),
    [],
  );
