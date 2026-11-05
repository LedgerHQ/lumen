import { BlurView } from '@sbaiahmed1/react-native-blur';
import type { ReactElement, ReactNode } from 'react';
import { Children, isValidElement, useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { useStyleSheet, useTheme } from '../../../../styles';
import { triggerHapticFeedback } from '../../../Haptics';
import { RuntimeConstants } from '../../../utils';
import { useTimingConfig } from '../../animations/useTimingConfig';
import { Box, Pressable } from '../../primitives';
import { Placeholder } from '../../symbols';
import { TabBarContextProvider, useTabBarContext } from './TabBarContext';
import type { TabBarItemProps, TabBarProps, TabBarValue } from './types';

export const TAB_BAR_EXPANDED_HEIGHT = 60;
export const TAB_BAR_COMPACT_HEIGHT = 44;
const PILL_INSET = 4;
const ICON_SIZE = 20;
const ICON_LABEL_GAP = 4;

const useLabelLineHeight = (): { base: number; scaled: number } => {
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();
  const base = theme.typographies.body4.lineHeight ?? 0;
  return { base, scaled: base * fontScale };
};

const useTabBarItemAnimations = ({
  isActive,
  densityProgress,
  labelOpacity,
  iconShift,
}: {
  isActive: boolean;
  densityProgress: SharedValue<number>;
  labelOpacity: SharedValue<number>;
  iconShift: number;
}) => {
  const activeProgress = useSharedValue(isActive ? 1 : 0);
  const pressProgress = useSharedValue(1);

  const activeTimingConfig = useTimingConfig({
    duration: 200,
    easing: 'easeInOut',
  });

  const pressInTimingConfig = useTimingConfig({
    duration: 100,
    easing: 'easeOut',
  });

  const pressOutTimingConfig = useTimingConfig({
    duration: 100,
    easing: 'easeOut',
  });

  useEffect(() => {
    activeProgress.value = withDelay(
      50,
      withTiming(isActive ? 1 : 0, activeTimingConfig),
    );
  }, [isActive, activeProgress, activeTimingConfig]);

  useEffect(() => () => cancelAnimation(activeProgress), [activeProgress]);

  const onPressIn = () => {
    pressProgress.value = withTiming(0.9, pressInTimingConfig);
  };

  const onPressOut = () => {
    triggerHapticFeedback('light');
    pressProgress.value = withSequence(
      withTiming(0.95, { duration: 0 }),
      withTiming(1, pressOutTimingConfig),
    );
  };

  const scaleStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: pressProgress.value }],
    }),
    [pressProgress],
  );

  const activeIconStyle = useAnimatedStyle(
    () => ({
      opacity: activeProgress.value,
    }),
    [activeProgress],
  );

  const inactiveIconStyle = useAnimatedStyle(
    () => ({
      opacity: 1 - activeProgress.value,
    }),
    [activeProgress],
  );

  const contentStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -iconShift * densityProgress.value }],
    }),
    [densityProgress, iconShift],
  );

  const labelStyle = useAnimatedStyle(
    () => ({
      opacity: labelOpacity.value,
      // Closes the icon/label gap as the bar collapses.
      transform: [
        { translateY: -ICON_LABEL_GAP * (1 - densityProgress.value) },
      ],
    }),
    [labelOpacity, densityProgress],
  );

  return {
    onPressIn,
    onPressOut,
    scaleStyle,
    activeIconStyle,
    inactiveIconStyle,
    contentStyle,
    labelStyle,
  };
};

const useTabBarAnimations = ({
  active,
  density,
  children,
}: {
  active: string;
  density: TabBarProps['density'];
  children: ReactNode;
}) => {
  const { theme } = useTheme();
  const items = Children.toArray(children).filter(
    isValidElement<TabBarItemProps>,
  );
  const count = items.length;
  const activeIndex = items.findIndex((item) => item.props.value === active);

  const isExpanded = density === 'expanded';
  const pillIndex = useSharedValue(Math.max(activeIndex, 0));
  const densityProgress = useSharedValue(isExpanded ? 1 : 0);
  const labelOpacity = useSharedValue(isExpanded ? 1 : 0);

  const pillTimingConfig = useTimingConfig({
    duration: 300,
    easing: 'easeInOut',
  });
  const densityTimingConfig = useTimingConfig({
    duration: 300,
    easing: 'easeOut',
  });
  const labelOutTimingConfig = useTimingConfig({
    duration: 150,
    easing: 'easeOut',
  });
  const labelInTimingConfig = useTimingConfig({
    duration: 200,
    easing: 'easeOut',
  });
  const labelInDelay = theme.motion.delays[75];
  const compactInset = theme.spacings.s32;
  const labelLineHeight = useLabelLineHeight();
  const expandedHeight =
    TAB_BAR_EXPANDED_HEIGHT +
    Math.max(labelLineHeight.scaled - labelLineHeight.base, 0);

  useEffect(() => {
    if (activeIndex >= 0) {
      pillIndex.value = withTiming(activeIndex, pillTimingConfig);
    }
  }, [activeIndex, pillIndex, pillTimingConfig]);

  useEffect(() => {
    densityProgress.value = withTiming(isExpanded ? 1 : 0, densityTimingConfig);
    // Labels leave quickly, but only come back once the bar has started
    // making room for them.
    labelOpacity.value = isExpanded
      ? withDelay(labelInDelay, withTiming(1, labelInTimingConfig))
      : withTiming(0, labelOutTimingConfig);
  }, [
    isExpanded,
    densityProgress,
    labelOpacity,
    densityTimingConfig,
    labelInTimingConfig,
    labelOutTimingConfig,
    labelInDelay,
  ]);

  useEffect(
    () => () => {
      cancelAnimation(pillIndex);
      cancelAnimation(densityProgress);
      cancelAnimation(labelOpacity);
    },
    [pillIndex, densityProgress, labelOpacity],
  );

  const barStyle = useAnimatedStyle(
    () => ({
      height: interpolate(
        densityProgress.value,
        [0, 1],
        [TAB_BAR_COMPACT_HEIGHT, expandedHeight],
      ),
      marginHorizontal: interpolate(
        densityProgress.value,
        [0, 1],
        [compactInset, 0],
      ),
    }),
    [densityProgress, compactInset, expandedHeight],
  );

  const pillStyle = useAnimatedStyle(
    () => ({
      width: `${100 / count}%`,
      left: `${(pillIndex.value * 100) / count}%`,
    }),
    [pillIndex, count],
  );

  return { densityProgress, labelOpacity, barStyle, pillStyle };
};

export function TabBarItem({
  value,
  label,
  icon,
  activeIcon,
  style,
  ...props
}: TabBarItemProps) {
  const styles = useStyles();
  const labelLineHeight = useLabelLineHeight();
  const { active, onTabPress, densityProgress, labelOpacity } =
    useTabBarContext();

  const isActive = active === value;
  const Icon = icon ?? Placeholder;
  const ActiveIcon = activeIcon ?? Icon;

  const {
    onPressIn,
    onPressOut,
    scaleStyle,
    activeIconStyle,
    inactiveIconStyle,
    contentStyle,
    labelStyle,
  } = useTabBarItemAnimations({
    isActive,
    densityProgress,
    labelOpacity,
    iconShift: label ? (ICON_LABEL_GAP + labelLineHeight.scaled) / 2 : 0,
  });

  function onPress() {
    onTabPress(value);
  }

  return (
    <Pressable
      style={StyleSheet.flatten([styles.item, style])}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole='tab'
      accessibilityLabel={label ?? value}
      accessibilityState={{ selected: isActive }}
      {...props}
    >
      <Animated.View style={[styles.itemContent, contentStyle]}>
        <Animated.View style={scaleStyle}>
          <Box style={styles.itemIconContainer}>
            <Animated.View style={[styles.itemIcon, inactiveIconStyle]}>
              <Icon size={ICON_SIZE} />
            </Animated.View>
            <Animated.View style={[styles.itemIcon, activeIconStyle]}>
              <ActiveIcon size={ICON_SIZE} />
            </Animated.View>
          </Box>
        </Animated.View>
        {label && (
          <Animated.View style={[styles.itemLabel, labelStyle]}>
            <Text
              style={[styles.itemText, isActive && styles.activeItemText]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

/**
 * A horizontal tab bar with animated pill background and icon transitions.
 * Provides smooth animations for active state changes and press interactions.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-tabbar--docs Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 *
 * @example
 * import { TabBar, TabBarItem } from '@ledgerhq/lumen-ui-rnative';
 * import { HomeFill, Settings } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * const [activeTab, setActiveTab] = useState('home');
 * <TabBar active={activeTab} onTabPress={setActiveTab}>
 *   <TabBarItem value="home" label="Home" icon={HomeFill} />
 *   <TabBarItem value="settings" label="Settings" icon={Settings} />
 * </TabBar>
 */
export function TabBar<T extends TabBarValue = TabBarValue>({
  active,
  onTabPress,
  density = 'expanded',
  children,
  ...props
}: TabBarProps<T>) {
  const styles = useStyles();
  const { theme, colorScheme } = useTheme();

  const { densityProgress, labelOpacity, barStyle, pillStyle } =
    useTabBarAnimations({
      active,
      density,
      children,
    });

  return (
    <TabBarContextProvider
      value={{
        active,
        onTabPress: (value) => onTabPress(value as T),
        densityProgress,
        labelOpacity,
      }}
    >
      <Box accessibilityRole='tablist' {...props}>
        <Animated.View style={[styles.container, barStyle]}>
          {children}
          {RuntimeConstants.isAndroid ? (
            <View style={styles.fallbackBackground} />
          ) : (
            <BlurView
              style={styles.blur}
              blurAmount={theme.blur.lg}
              blurType={colorScheme === 'dark' ? 'dark' : 'light'}
              overlayColor={
                colorScheme === 'dark'
                  ? 'rgba(0,0,0,0.15)'
                  : 'rgba(255,255,255,0.2)'
              }
              reducedTransparencyFallbackColor={
                styles.fallbackBackground.backgroundColor
              }
            />
          )}
          <View style={styles.pillTrack}>
            <Animated.View style={[styles.pill, pillStyle]} />
          </View>
        </Animated.View>
      </Box>
    </TabBarContextProvider>
  );
}

const useStyles = () =>
  useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: t.spacings.s4,
        alignItems: 'center',
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.mutedTransparent,
        overflow: 'hidden',
      },
      blur: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: -t.sizes.s16,
        zIndex: -1,
      },
      fallbackBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        backgroundColor: t.colors.bg.muted,
      },
      item: {
        flex: 1,
        alignSelf: 'stretch',
        marginVertical: -t.spacings.s4,
        justifyContent: 'center',
      },
      itemContent: {
        alignItems: 'center',
      },
      itemLabel: {
        position: 'absolute',
        top: ICON_SIZE + ICON_LABEL_GAP,
        left: 0,
        right: 0,
        alignItems: 'center',
      },
      itemText: {
        ...t.typographies.body4,
        paddingHorizontal: t.spacings.s12,
        color: t.colors.text.base,
      },
      itemIcon: {
        position: 'absolute',
      },
      itemIconContainer: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        position: 'relative',
      },
      activeItemText: {
        ...t.typographies.body4SemiBold,
      },
      pillTrack: {
        position: 'absolute',
        pointerEvents: 'none',
        top: PILL_INSET,
        bottom: PILL_INSET,
        left: PILL_INSET,
        right: PILL_INSET,
      },
      pill: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.mutedTransparent,
      },
    }),
    [],
  );

export function createTabBar<T extends TabBarValue = never>(): {
  TabBar: (props: TabBarProps<T>) => ReactElement;
  TabBarItem: (props: TabBarItemProps<T>) => ReactElement;
} {
  return { TabBar, TabBarItem };
}
