import React, {
  Children,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { LayoutChangeEvent } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTimingConfig } from '../../Animations/useTimingConfig';
import type { ButtonLayout } from './SegmentedControlContext';

export function useSegmentedControlSelectedIndex(
  selectedValue: string,
  children: ReactNode,
): number {
  return useMemo(
    () =>
      Children.toArray(children).findIndex((child) => {
        if (isValidElement(child) && child.props != null) {
          return (child.props as { value?: string }).value === selectedValue;
        }
        return false;
      }),
    [selectedValue, children],
  );
}

type UsePillLayoutParams = {
  selectedIndex: number;
  selectedValue: string;
  children: React.ReactNode;
  tabLayout: 'fit' | 'fixed';
};

export function usePillLayout({
  selectedIndex,
  selectedValue,
  children,
  tabLayout,
}: UsePillLayoutParams) {
  const pillTranslateX = useSharedValue(0);
  const pillWidth = useSharedValue(0);
  const pillHeight = useSharedValue(0);
  const hasLayoutRef = useRef(false);
  const buttonLayoutsRef = useRef(new Map<string, ButtonLayout>());

  const timingConfig = useTimingConfig({
    duration: 300,
    easing: 'easeInOut',
  });

  const onLayout = (e: LayoutChangeEvent): void => {
    const { width, height } = e.nativeEvent.layout;
    pillHeight.value = height;

    if (tabLayout === 'fixed') {
      const count = React.Children.count(children);
      const slotWidth = count > 0 ? width / count : 0;
      pillWidth.value = slotWidth;

      if (!hasLayoutRef.current) {
        hasLayoutRef.current = true;
        if (selectedIndex >= 0) {
          pillTranslateX.value = selectedIndex * slotWidth;
        }
      }
    }
  };

  const registerButtonLayout = useCallback(
    (value: string, layout: ButtonLayout): void => {
      buttonLayoutsRef.current.set(value, layout);

      if (tabLayout === 'fit' && !hasLayoutRef.current) {
        hasLayoutRef.current = true;
        if (value === selectedValue) {
          pillTranslateX.value = layout.x;
          pillWidth.value = layout.width;
        }
      }
    },
    [tabLayout, selectedValue, pillTranslateX, pillWidth],
  );

  useEffect(() => {
    if (!hasLayoutRef.current) return;

    if (tabLayout === 'fit') {
      const layout = buttonLayoutsRef.current.get(selectedValue);
      if (layout) {
        pillTranslateX.value = withTiming(layout.x, timingConfig);
        pillWidth.value = withTiming(layout.width, timingConfig);
      }
    } else {
      if (selectedIndex >= 0 && pillWidth.value > 0) {
        pillTranslateX.value = withTiming(
          selectedIndex * pillWidth.value,
          timingConfig,
        );
      }
    }
  }, [
    selectedIndex,
    selectedValue,
    tabLayout,
    pillWidth,
    pillTranslateX,
    timingConfig,
  ]);

  const animatedPillStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: pillTranslateX.value }],
      width: pillWidth.value,
      height: pillHeight.value,
    }),
    [pillTranslateX, pillWidth, pillHeight],
  );

  return { onLayout, animatedPillStyle, registerButtonLayout };
}
