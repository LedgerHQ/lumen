import React, {
  isValidElement,
  cloneElement,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useStyleSheet } from '../../../styles';
import { Box, Pressable, Text } from '../Utility';
import type {
  SegmentedControlButtonProps,
  SegmentedControlProps,
} from './types';

const ICON_SIZE = 16;

export function SegmentedControlButton({
  selected,
  children,
  icon: Icon,
  index: _index = 0,
  onPress,
  ...props
}: SegmentedControlButtonProps) {
  const styles = useButtonStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityState={{ selected }}
      style={styles.button}
      {...props}
    >
      <Box style={styles.content}>
        {Icon && (
          <Box style={styles.iconWrap}>
            <Icon size={ICON_SIZE} />
          </Box>
        )}
        <Text
          typography={selected ? 'body2SemiBold' : 'body2'}
          lx={{ color: 'base' }}
          style={styles.label}
        >
          {children}
        </Text>
      </Box>
    </Pressable>
  );
}

SegmentedControlButton.displayName = 'SegmentedControlButton';

function useButtonStyles() {
  return useStyleSheet(
    (t) => ({
      button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: t.spacings.s16,
        paddingVertical: t.spacings.s8,
        borderRadius: t.borderRadius.full,
        zIndex: 1,
      },
      content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: t.spacings.s8,
      },
      label: {
        textAlign: 'center',
        includeFontPadding: false,
      },
      iconWrap: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    }),
    [],
  );
}

export function SegmentedControl({
  selectedIndex,
  onChange,
  accessibilityLabel,
  children,
  ...props
}: SegmentedControlProps) {
  const styles = useRootStyles();
  const pillTranslateX = useSharedValue(0);
  const pillWidth = useSharedValue(0);
  const pillHeight = useSharedValue(0);
  const hasLayoutRef = useRef(false);

  const count = React.Children.count(children);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      if (count <= 0) return;
      const slotWidth = width / count;
      pillWidth.value = slotWidth;
      pillHeight.value = height;
      if (!hasLayoutRef.current) {
        hasLayoutRef.current = true;
        pillTranslateX.value = selectedIndex * slotWidth;
      }
    },
    [count, selectedIndex, pillWidth, pillHeight, pillTranslateX],
  );

  useEffect(() => {
    if (!hasLayoutRef.current || pillWidth.value <= 0) return;
    pillTranslateX.value = withTiming(selectedIndex * pillWidth.value, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [selectedIndex, pillTranslateX, pillWidth]);

  const childrenWithInjections = React.Children.map(
    children,
    (child, index) => {
      if (isValidElement(child) && child.type === SegmentedControlButton) {
        const existingOnPress = (child.props as SegmentedControlButtonProps)
          .onPress;
        return cloneElement(
          child as React.ReactElement<SegmentedControlButtonProps>,
          {
            index,
            onPress: () => {
              onChange(index);
              existingOnPress?.();
            },
          },
        );
      }
      return child;
    },
  );

  const animatedPillStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: pillTranslateX.value }],
      width: pillWidth.value,
      height: pillHeight.value,
    }),
    [pillTranslateX, pillWidth, pillHeight],
  );

  return (
    <Box
      accessibilityRole='radiogroup'
      accessibilityLabel={accessibilityLabel}
      onLayout={onLayout}
      style={styles.container}
      {...props}
    >
      {childrenWithInjections}
      <Animated.View
        style={[styles.pill, animatedPillStyle]}
        pointerEvents='none'
      />
    </Box>
  );
}

SegmentedControl.displayName = 'SegmentedControl';

function useRootStyles() {
  return useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.baseTransparent,
      },
      pill: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: t.borderRadius.sm,
        backgroundColor: t.colors.bg.muted,
        zIndex: 0,
      },
    }),
    [],
  );
}
