import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useStyleSheet, useTheme } from '../../../styles';
import { Box } from '../Utility';
import { PageIndicatorProps } from './types';
import { useEffect } from 'react';

const AnimatedBox = Animated.createAnimatedComponent(Box);

type PageIndicatorDotProps = {
  index: number;
  active: boolean;
};

const PageIndicatorDot = ({ index, active }: PageIndicatorDotProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: 200 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.bg.mutedHover, theme.colors.bg.mutedStrong],
    );
    return {
      backgroundColor,
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

  return (
    <Box
      ref={ref}
      accessibilityRole='none'
      lx={{ ...lx }}
      style={styles.container}
      {...props}
    >
      {Array.from({ length: totalPages }).map((_, i) => (
        <PageIndicatorDot index={i} active={i + 1 === currentPage} />
      ))}
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
