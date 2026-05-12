import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useCartesianChartContext } from '../CartesianChart/context';
import { ScrubberContextProvider } from './context';
import type { ScrubberProviderProps } from './types';
import { getDataIndexFromPosition } from './utils';

/**
 * Provides scrubbing interaction for a chart.
 *
 * Must be placed as a child of `CartesianChartProvider` (so it can access the
 * x-scale) but outside the `<Svg>` element (so it can render a transparent
 * gesture-capture `View` overlay). `CartesianChart` handles this positioning
 * automatically when `enableScrubbing` is true.
 *
 * Activation requires a 50 ms long press before panning begins. This prevents
 * accidental scrubbing when the user is scrolling a parent `ScrollView` or
 * `FlatList`. The `isScrubbing` shared value gates the pan via manual activation
 * so scroll and scrub gestures never compete.
 */
export function ScrubberProvider({
  children,
  width,
  height,
  enableScrubbing,
  onScrubberPositionChange,
}: Readonly<ScrubberProviderProps>) {
  const [scrubberPosition, setScrubberPosition] = useState<
    number | undefined
  >();
  const lastPositionRef = useRef<number | undefined>(undefined);

  const { getXScale, getXAxisConfig, dataLength } = useCartesianChartContext();

  const isScrubbing = useSharedValue(false);

  const setScrubberPositionAndNotify = useCallback(
    (index: number | undefined) => {
      const clamped =
        index === undefined || dataLength <= 0
          ? undefined
          : Math.max(0, Math.min(index, dataLength - 1));
      if (clamped === lastPositionRef.current) return;
      lastPositionRef.current = clamped;
      setScrubberPosition(clamped);
      onScrubberPositionChange?.(clamped);
    },
    [dataLength, onScrubberPositionChange],
  );

  const handlePositionChange = useCallback(
    (pixelX: number | null) => {
      if (pixelX === null) {
        setScrubberPositionAndNotify(undefined);
        return;
      }

      const scale = getXScale();
      if (!scale || dataLength <= 0) return;

      const axisConfig = getXAxisConfig();
      const index = getDataIndexFromPosition(
        pixelX,
        scale,
        axisConfig,
        dataLength,
      );
      setScrubberPositionAndNotify(index);
    },
    [getXScale, getXAxisConfig, dataLength, setScrubberPositionAndNotify],
  );

  const resetScrubber = useCallback((): void => {
    'worklet';
    isScrubbing.value = false;
    scheduleOnRN(handlePositionChange, null);
  }, [isScrubbing, handlePositionChange]);

  const composed = useMemo(() => {
    const longPress = Gesture.LongPress()
      .minDuration(50)
      .onStart((e) => {
        'worklet';
        isScrubbing.value = true;
        scheduleOnRN(handlePositionChange, e.x);
      })
      .onEnd(resetScrubber)
      .onFinalize(resetScrubber);

    const pan = Gesture.Pan()
      .manualActivation(true)
      .onTouchesMove((_, manager) => {
        'worklet';
        if (isScrubbing.value) manager.activate();
      })
      .onUpdate((e) => {
        'worklet';
        scheduleOnRN(handlePositionChange, e.x);
      })
      .onEnd(resetScrubber)
      .onFinalize(resetScrubber);

    return Gesture.Simultaneous(longPress, pan);
  }, [isScrubbing, handlePositionChange, resetScrubber]);

  const contextValue = useMemo(
    () => ({
      enableScrubbing,
      scrubberPosition,
      onScrubberPositionChange: setScrubberPositionAndNotify,
    }),
    [enableScrubbing, scrubberPosition, setScrubberPositionAndNotify],
  );

  return (
    <ScrubberContextProvider value={contextValue}>
      <View style={{ width, height }}>
        {children}
        {enableScrubbing && (
          <GestureDetector gesture={composed}>
            <Animated.View
              testID='scrubber-gesture-overlay'
              style={StyleSheet.absoluteFill}
            />
          </GestureDetector>
        )}
      </View>
    </ScrubberContextProvider>
  );
}
