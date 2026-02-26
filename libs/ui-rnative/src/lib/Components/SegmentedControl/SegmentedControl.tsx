import React, { useCallback, useEffect, useRef } from 'react';
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

const ICON_SIZE = 16;

export function SegmentedControlButton({
  value,
  children,
  icon: Icon,
  onPress,
  ...props
}: SegmentedControlButtonProps) {
  const styles = useButtonStyles();
  const { selectedValue, onSelectedChange } = useSegmentedControlContext();

  const selected = selectedValue === value;

  function handlePress() {
    onSelectedChange(value);
    onPress?.();
  }

  return (
    <Pressable
      onPress={handlePress}
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
  selectedValue,
  onSelectedChange,
  accessibilityLabel,
  children,
  ...props
}: SegmentedControlProps) {
  const styles = useRootStyles();
  const pillTranslateX = useSharedValue(0);
  const pillWidth = useSharedValue(0);
  const pillHeight = useSharedValue(0);
  const hasLayoutRef = useRef(false);

  const getSelectedIndex = useCallback((): number => {
    return React.Children.toArray(children).findIndex((child) => {
      if (React.isValidElement(child) && child.props != null) {
        return (child.props as { value?: string }).value === selectedValue;
      }
      return false;
    });
  }, [selectedValue, children]);

  function onLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    const count = React.Children.count(children);
    const slotWidth = count > 0 ? width / count : 0;

    pillWidth.value = slotWidth;
    pillHeight.value = height;

    if (!hasLayoutRef.current) {
      hasLayoutRef.current = true;
      const index = getSelectedIndex();
      if (index >= 0) {
        pillTranslateX.value = index * slotWidth;
      }
    }
  }

  useEffect(() => {
    if (!hasLayoutRef.current) return;
    const index = getSelectedIndex();
    if (index >= 0 && pillWidth.value > 0) {
      pillTranslateX.value = withTiming(index * pillWidth.value, {
        duration: durations['250'],
        easing: easingCurves.bezier.default,
      });
    }
  }, [pillWidth, pillTranslateX, getSelectedIndex]);

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
      value={{ selectedValue, onSelectedChange }}
    >
      <Box
        accessibilityRole='radiogroup'
        accessibilityLabel={accessibilityLabel}
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
