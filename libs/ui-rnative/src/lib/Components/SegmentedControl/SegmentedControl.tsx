import React, { useEffect, useMemo, useRef } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useStyleSheet } from '../../../styles';
import { durations, easingCurves } from '../../Animations/constants';
import { Box, Pressable, Text } from '../Utility';
import {
  SegmentedControlContextProvider,
  useSegmentedControlContext,
} from './SegmentedControlContext';
import type {
  SegmentedControlButtonProps,
  SegmentedControlProps,
} from './types';

export function SegmentedControlButton({
  value,
  children,
  icon: Icon,
  onPress,
  ...props
}: SegmentedControlButtonProps) {
  const styles = useButtonStyles();
  const { selectedValue, onSelectedChange, disabled } =
    useSegmentedControlContext();

  const selected = selectedValue === value;

  function handlePress() {
    if (!disabled) {
      onSelectedChange(value);
      onPress?.();
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityState={{ selected, disabled }}
      style={styles.button}
      {...props}
    >
      <Box style={styles.content}>
        {Icon && (
          <Box style={styles.iconWrap}>
            <Icon size={16} color={selected && !disabled ? 'base' : 'muted'} />
          </Box>
        )}
        <Text
          typography={selected ? 'body2SemiBold' : 'body2'}
          lx={{
            color: selected && !disabled ? 'base' : 'muted',
          }}
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
  selectedValue,
  onSelectedChange,
  accessibilityLabel,
  children,
  disabled,
  appearance = 'background',
  ...props
}: SegmentedControlProps) {
  const styles = useRootStyles(!!disabled, appearance);
  const pillTranslateX = useSharedValue(0);
  const pillWidth = useSharedValue(0);
  const pillHeight = useSharedValue(0);
  const hasLayoutRef = useRef(false);

  const selectedIndex = useMemo(
    () =>
      React.Children.toArray(children).findIndex((child) => {
        if (React.isValidElement(child) && child.props != null) {
          return (child.props as { value?: string }).value === selectedValue;
        }
        return false;
      }),
    [selectedValue, children],
  );

  function onLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    const count = React.Children.count(children);
    const slotWidth = count > 0 ? width / count : 0;

    pillWidth.value = slotWidth;
    pillHeight.value = height;

    if (!hasLayoutRef.current) {
      hasLayoutRef.current = true;
      if (selectedIndex >= 0) {
        pillTranslateX.value = selectedIndex * slotWidth;
      }
    }
  }

  useEffect(() => {
    if (!hasLayoutRef.current) return;
    if (selectedIndex >= 0 && pillWidth.value > 0) {
      pillTranslateX.value = withTiming(selectedIndex * pillWidth.value, {
        duration: durations['250'],
        easing: easingCurves.bezier.default,
      });
    }
  }, [selectedIndex, pillWidth, pillTranslateX]);

  const animatedPillStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: pillTranslateX.value }],
      width: pillWidth.value,
      height: pillHeight.value,
    }),
    [pillTranslateX, pillWidth, pillHeight],
  );

  return (
    <SegmentedControlContextProvider
      value={{ selectedValue, onSelectedChange, disabled }}
    >
      <Box
        accessibilityRole='radiogroup'
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        onLayout={onLayout}
        style={styles.container}
        {...props}
      >
        {children}
        <Animated.View
          style={[styles.pill, animatedPillStyle]}
          pointerEvents='none'
        />
      </Box>
    </SegmentedControlContextProvider>
  );
}

SegmentedControl.displayName = 'SegmentedControl';

function useRootStyles(
  disabled: boolean,
  appearance: 'background' | 'no-background',
) {
  return useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        borderRadius: t.borderRadius.md,
        backgroundColor:
          appearance === 'background' ? t.colors.bg.surface : 'transparent',
      },
      pill: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: t.borderRadius.sm,
        backgroundColor: disabled
          ? t.colors.bg.baseTransparentPressed
          : t.colors.bg.muted,
        zIndex: 0,
      },
    }),
    [disabled, appearance],
  );
}
