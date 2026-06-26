import type { ReactNode } from 'react';
import React, {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { LayoutChangeEvent } from 'react-native';
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
  const animatePillRef = useRef(false);
  const buttonLayoutsRef = useRef(new Map<string, ButtonLayout>());
  const [layoutReady, setLayoutReady] = useState(false);

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
        setLayoutReady(true);
      }
    }
  };

  const registerButtonLayout = useCallback(
    (value: string, layout: ButtonLayout): void => {
      buttonLayoutsRef.current.set(value, layout);

      if (
        tabLayout === 'fit' &&
        !hasLayoutRef.current &&
        value === selectedValue
      ) {
        hasLayoutRef.current = true;
        setLayoutReady(true);
      }
    },
    [tabLayout, selectedValue],
  );

  useEffect(() => {
    if (!hasLayoutRef.current) return;

    const skipAnimation = !animatePillRef.current;
    if (skipAnimation) {
      animatePillRef.current = true;
    }
    const config = skipAnimation ? { duration: 0 } : timingConfig;

    if (tabLayout === 'fit') {
      const layout = buttonLayoutsRef.current.get(selectedValue);
      if (layout) {
        pillTranslateX.value = withTiming(layout.x, config);
        pillWidth.value = withTiming(layout.width, config);
      }
    } else {
      if (selectedIndex >= 0 && pillWidth.value > 0) {
        pillTranslateX.value = withTiming(
          selectedIndex * pillWidth.value,
          config,
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
    layoutReady,
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
