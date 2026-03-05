import React, { useEffect, useMemo, useRef } from 'react';
import { LayoutChangeEvent } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations, easingCurves } from '../../Animations/constants';

export function useSegmentedControlSelectedIndex(
  selectedValue: string,
  children: React.ReactNode,
): number {
  return useMemo(
    () =>
      React.Children.toArray(children).findIndex((child) => {
        if (React.isValidElement(child) && child.props != null) {
          return (child.props as { value?: string }).value === selectedValue;
        }
        return false;
      }),
    [selectedValue, children],
  );
}

type UsePillLayoutParams = {
  selectedIndex: number;
  children: React.ReactNode;
};

export function usePillLayout({
  selectedIndex,
  children,
}: UsePillLayoutParams) {
  const pillTranslateX = useSharedValue(0);
  const pillWidth = useSharedValue(0);
  const pillHeight = useSharedValue(0);
  const hasLayoutRef = useRef(false);

  const onLayout = (e: LayoutChangeEvent): void => {
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
  };

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

  return { onLayout, animatedPillStyle };
}
