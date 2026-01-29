import { BlurView } from '@react-native-community/blur';
import React, { useCallback, useEffect, useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useStyleSheet, useTheme } from '../../../styles';
import { Placeholder } from '../../Symbols';
import { Box, Pressable } from '../Utility';
import { TabBarContext, useTabBarContext } from './TabBarContext';
import { TabBarItemProps, TabBarProps } from './types';

const PILL_INSET = 4;

/**
 * Individual tab item component that displays an icon and label.
 * Must be used as a child of TabBar.
 *
 * @example
 * <TabBarItem value="home" label="Home" icon={HomeFill} activeIcon={HomeActive} />
 */
export function TabBarItem({
  value,
  label,
  icon,
  activeIcon,
}: TabBarItemProps) {
  const styles = useStyles();
  const { active, onTabPress } = useTabBarContext();

  const isActive = active === value;
  const activeProgress = useSharedValue(isActive ? 1 : 0);
  const pressProgress = useSharedValue(1);

  const Icon = icon ?? Placeholder;
  const ActiveIcon = activeIcon ?? Icon;

  useEffect(() => {
    activeProgress.value = withDelay(
      50,
      withTiming(isActive ? 1 : 0, {
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    );
  }, [isActive, activeProgress]);

  function onPress() {
    onTabPress(value);
  }

  function onPressIn() {
    pressProgress.value = withTiming(0.9, {
      duration: 100,
      easing: Easing.bezier(0, 0, 0.2, 1),
    });
  }

  function onPressOut() {
    pressProgress.value = withSequence(
      withTiming(0.95, {
        duration: 0,
      }),
      withTiming(1, {
        duration: 120,
        easing: Easing.out(Easing.quad),
      }),
    );
  }

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

  return (
    <Pressable
      style={styles.item}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole='tab'
      accessibilityLabel={label ?? value}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={scaleStyle}>
        <Box style={styles.itemIconContainer}>
          <Animated.View style={[styles.itemIcon, inactiveIconStyle]}>
            <Icon size={20} />
          </Animated.View>
          <Animated.View style={[styles.itemIcon, activeIconStyle]}>
            <ActiveIcon size={20} />
          </Animated.View>
        </Box>
      </Animated.View>
      <Text style={[styles.itemText, isActive && styles.activeItemText]}>
        {label ?? value}
      </Text>
    </Pressable>
  );
}

TabBarItem.displayName = 'TabBarItem';

/**
 * A horizontal tab bar with animated pill background and icon transitions.
 * Provides smooth animations for active state changes and press interactions.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_navigation-tabbar--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_navigation-tabbar--docs#dos-and-donts Guidelines}
 *
 * @warning Requires at least two TabBarItem children to function properly.
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
export function TabBar({
  active,
  onTabPress,
  children,
  ...props
}: TabBarProps): JSX.Element {
  const styles = useStyles();
  const { theme, colorScheme } = useTheme();

  const pillProgress = useSharedValue(0);
  const itemWidth = useSharedValue(0);
  const itemHeight = useSharedValue(0);
  const hasLayoutRef = useRef(false);

  const getActiveIndex = useCallback((): number => {
    return React.Children.toArray(children).findIndex((child) => {
      if (React.isValidElement<TabBarItemProps>(child)) {
        return child.props.value === active;
      }
      return false;
    });
  }, [active, children]);

  function onLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;

    const count = React.Children.count(children);
    const slotWidth = (width - PILL_INSET * 2) / count;

    itemWidth.value = slotWidth;
    itemHeight.value = height;

    if (!hasLayoutRef.current) {
      hasLayoutRef.current = true;
      const index = getActiveIndex();
      if (index >= 0) {
        pillProgress.value = index * slotWidth;
      }
    }
  }

  function handleTabPress(value: string) {
    onTabPress?.(value);
  }

  useEffect(() => {
    if (!hasLayoutRef.current) {
      return;
    }
    const index = getActiveIndex();

    if (index >= 0 && itemWidth.value > 0) {
      pillProgress.value = withTiming(index * itemWidth.value, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }
  }, [itemWidth, pillProgress, getActiveIndex]);

  const animatedPillStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: pillProgress.value }],
      width: itemWidth.value,
      height: itemHeight.value - PILL_INSET * 2,
    }),
    [pillProgress, itemWidth, itemHeight],
  );

  return (
    <TabBarContext.Provider value={{ active, onTabPress: handleTabPress }}>
      <Box
        style={styles.container}
        onLayout={onLayout}
        accessibilityRole='tablist'
        {...props}
      >
        {children}
        <BlurView
          style={styles.blur}
          blurAmount={theme.blur.md}
          blurType={colorScheme === 'dark' ? 'dark' : 'light'}
        />
        <Animated.View style={[styles.pill, animatedPillStyle]} />
      </Box>
    </TabBarContext.Provider>
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
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
      },
      item: {
        flex: 1,
        paddingVertical: t.spacings.s4,
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.spacings.s2,
      },
      itemText: {
        ...t.typographies.body4,
        color: t.colors.text.base,
      },
      itemIcon: {
        position: 'absolute',
      },
      itemIconContainer: {
        width: 20,
        height: 20,
        position: 'relative',
      },
      activeItemText: {
        ...t.typographies.body4SemiBold,
      },
      pill: {
        position: 'absolute',
        top: PILL_INSET,
        left: PILL_INSET,
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.mutedTransparent,
      },
    }),
    [],
  );
