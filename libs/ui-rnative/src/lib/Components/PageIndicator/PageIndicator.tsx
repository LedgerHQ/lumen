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
  currentPage: number;
  isShrunk: boolean;
};

const MAX_VISIBLE_DOTS = 4;

const PageIndicatorDot = ({
  index,
  currentPage,
  isShrunk,
}: PageIndicatorDotProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const isActive = index === currentPage;
  const colorProgress = useSharedValue(isActive ? 1 : 0);
  const shrinkProgress = useSharedValue(isShrunk ? 1 : 0);

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
  const { theme } = useTheme();
  const translateX = useSharedValue(0);
  const prevPage = useRef(currentPage);

  const direction = currentPage > prevPage.current ? 'forward' : 'backward';

  useEffect(() => {
    prevPage.current = currentPage;
  }, [currentPage]);

  const forwardAnchor = MAX_VISIBLE_DOTS - 2;
  const backwardAnchor = 1;

  const anchorIndex = direction === 'forward' ? forwardAnchor : backwardAnchor;

  const lastPage = totalPages - 1;
  const visibleDots = Math.min(totalPages, MAX_VISIBLE_DOTS);

  const offset = Math.max(
    0,
    Math.min(currentPage - anchorIndex, lastPage - (visibleDots - 1)),
  );

  useEffect(() => {
    const dotSize = theme.sizes.s6;
    const gap = theme.spacings.s4;
    const dotWidth = dotSize + gap;

    translateX.value = withTiming(-offset * dotWidth, { duration: 200 });
  }, [currentPage, totalPages, theme.sizes.s6, theme.spacings.s4, offset]);

  const stripAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const dotSize = theme.sizes.s6;
  const gap = theme.spacings.s4;
  const viewportWidth = visibleDots * dotSize + (visibleDots - 1) * gap;

  const firstVisibleIndex = offset;
  const lastVisibleIndex = offset + MAX_VISIBLE_DOTS - 1;

  const isShrunk = (index: number): boolean => {
    if (totalPages <= MAX_VISIBLE_DOTS) {
      return false;
    }
    if (index === firstVisibleIndex && firstVisibleIndex > 0) {
      return true;
    }
    if (index === lastVisibleIndex && lastVisibleIndex < totalPages - 1) {
      return true;
    }
    return false;
  };

  return (
    <Box
      ref={ref}
      accessibilityRole='none'
      lx={{ ...lx }}
      style={styles.container}
      {...props}
    >
      <Box style={[styles.viewport, { width: viewportWidth }]}>
        <AnimatedBox style={[styles.strip, stripAnimatedStyle]}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <PageIndicatorDot
              key={index}
              index={index}
              currentPage={currentPage}
              isShrunk={isShrunk(index)}
            />
          ))}
        </AnimatedBox>
      </Box>
    </Box>
  );
};

PageIndicator.displayName = 'PageIndicator';

const useStyles = () =>
  useStyleSheet(
    (t) => ({
      container: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      viewport: {
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
      },
      strip: {
        flexDirection: 'row',
        gap: t.spacings.s4,
        alignItems: 'center',
      },
      dot: {
        height: t.sizes.s6,
        width: t.sizes.s6,
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.mutedHover,
      },
    }),
    [],
  );
