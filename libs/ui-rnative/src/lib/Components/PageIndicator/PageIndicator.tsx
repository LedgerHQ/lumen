import { useCallback, useEffect, useMemo, useRef } from 'react';
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

const AnimatedBox = Animated.createAnimatedComponent(Box);
const MAX_VISIBLE_DOTS = 4;

type PageIndicatorDotProps = {
  index: number;
  currentPage: number;
  isShrunk: boolean;
};

const PageIndicatorDot = ({
  index,
  currentPage,
  isShrunk,
}: PageIndicatorDotProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const isActive = index === currentPage;
  const colorProgress = useSharedValue(0);
  const shrinkProgress = useSharedValue(0);

  useEffect(() => {
    colorProgress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive, colorProgress]);

  useEffect(() => {
    shrinkProgress.value = withTiming(isShrunk ? 1 : 0, { duration: 200 });
  }, [isShrunk, shrinkProgress]);

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
  }, [colorProgress, shrinkProgress, theme]);

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
    const dotWidth = theme.sizes.s6 + theme.spacings.s4;
    translateX.value = withTiming(-offset * dotWidth, { duration: 200 });
  }, [currentPage, totalPages, theme, offset, translateX]);

  const stripAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
    }),
    [translateX],
  );

  const viewportWidth =
    visibleDots * theme.sizes.s6 + (visibleDots - 1) * theme.spacings.s4;

  const firstVisibleIndex = offset;
  const lastVisibleIndex = offset + MAX_VISIBLE_DOTS - 1;

  const isShrunk = useCallback(
    (index: number): boolean => {
      if (totalPages <= MAX_VISIBLE_DOTS) {
        return false;
      }
      if (
        (index === firstVisibleIndex && firstVisibleIndex > 0) ||
        (index === lastVisibleIndex && lastVisibleIndex < totalPages - 1)
      ) {
        return true;
      }
      return false;
    },
    [totalPages, firstVisibleIndex, lastVisibleIndex],
  );

  const dotIndexes = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i),
    [totalPages],
  );

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
          {dotIndexes.map((index) => (
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
