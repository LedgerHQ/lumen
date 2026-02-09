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
  isActive: boolean;
  isShrunk: boolean;
};

const useDotAnimation = (
  isActive: boolean,
  isShrunk: boolean,
  theme: ReturnType<typeof useTheme>['theme'],
) => {
  const colorProgress = useSharedValue(isActive ? 1 : 0);
  const shrinkProgress = useSharedValue(isShrunk ? 1 : 0);

  useEffect(() => {
    colorProgress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive, colorProgress]);

  useEffect(() => {
    shrinkProgress.value = withTiming(isShrunk ? 1 : 0, { duration: 200 });
  }, [isShrunk, shrinkProgress]);

  return useAnimatedStyle(() => {
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
};

const useDotStyles = () =>
  useStyleSheet(
    (t) => ({
      dot: {
        height: t.sizes.s6,
        width: t.sizes.s6,
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.mutedHover,
      },
    }),
    [],
  );

const PageIndicatorDot = ({ isActive, isShrunk }: PageIndicatorDotProps) => {
  const styles = useDotStyles();
  const { theme } = useTheme();
  const animatedStyle = useDotAnimation(isActive, isShrunk, theme);

  return <AnimatedBox style={[styles.dot, animatedStyle]} />;
};

type UsePageIndicatorParams = {
  currentPage: number;
  totalPages: number;
  dotSize: number;
  gap: number;
};

const usePageIndicator = ({
  currentPage,
  totalPages,
  dotSize,
  gap,
}: UsePageIndicatorParams) => {
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

  const dotWidth = dotSize + gap;

  useEffect(() => {
    translateX.value = withTiming(-offset * dotWidth, { duration: 200 });
  }, [currentPage, totalPages, offset, dotWidth, translateX]);

  const stripAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
    }),
    [translateX],
  );

  const viewportWidth = Math.max(
    0,
    visibleDots * dotSize + (visibleDots - 1) * gap,
  );

  const firstVisibleIndex = offset;
  const lastVisibleIndex = offset + MAX_VISIBLE_DOTS - 1;

  const isActive = useCallback(
    (index: number): boolean => index === currentPage,
    [currentPage],
  );

  const isShrunk = useCallback(
    (index: number): boolean => {
      if (totalPages <= MAX_VISIBLE_DOTS) return false;
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

  return {
    viewportWidth,
    stripAnimatedStyle,
    isActive,
    isShrunk,
  };
};

const usePageIndicatorStyles = () =>
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
    }),
    [],
  );

/**
 * A page indicator component that shows the current position within a set of pages (e.g. carousel or onboarding).
 *
 * Renders a row of dots: the active dot is highlighted, and when there are more pages than visible dots,
 * edge dots shrink and the strip scrolls to keep the current page in view.
 */
export const PageIndicator = ({
  currentPage,
  totalPages,
  lx = {},
  ref,
  ...props
}: PageIndicatorProps) => {
  const styles = usePageIndicatorStyles();
  const { theme } = useTheme();

  const { viewportWidth, stripAnimatedStyle, isActive, isShrunk } =
    usePageIndicator({
      currentPage,
      totalPages,
      dotSize: theme.sizes.s6,
      gap: theme.spacings.s4,
    });

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
              isActive={isActive(index)}
              isShrunk={isShrunk(index)}
            />
          ))}
        </AnimatedBox>
      </Box>
    </Box>
  );
};

PageIndicator.displayName = 'PageIndicator';
