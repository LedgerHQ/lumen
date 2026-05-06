import { useCallback, useState } from 'react';
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
 * Activation requires a 150 ms long press before panning begins. This prevents
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
}: ScrubberProviderProps) {
  const [scrubberPosition, setScrubberPosition] = useState<
    number | undefined
  >();

  const { getXScale, getXAxisConfig, dataLength } = useCartesianChartContext();

  const isScrubbing = useSharedValue(false);

  const handlePositionChange = useCallback(
    (pixelX: number | null) => {
      if (pixelX === null) {
        setScrubberPosition(undefined);
        onScrubberPositionChange?.(undefined);
        return;
      }

      const scale = getXScale();
      if (!scale) return;

      const axisConfig = getXAxisConfig();
      const index = getDataIndexFromPosition(
        pixelX,
        scale,
        axisConfig,
        dataLength,
      );
      setScrubberPosition(index);
      onScrubberPositionChange?.(index);
    },
    [getXScale, getXAxisConfig, dataLength, onScrubberPositionChange],
  );

  const longPress = Gesture.LongPress()
    .minDuration(100)
    .onStart((e) => {
      isScrubbing.value = true;
      scheduleOnRN(handlePositionChange, e.x);
    });

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((_, manager) => {
      if (isScrubbing.value) manager.activate();
    })
    .onUpdate((e) => {
      scheduleOnRN(handlePositionChange, e.x);
    })
    .onEnd(() => {
      isScrubbing.value = false;
      scheduleOnRN(handlePositionChange, null);
    })
    .onFinalize(() => {
      isScrubbing.value = false;
      scheduleOnRN(handlePositionChange, null);
    });

  const composed = Gesture.Simultaneous(longPress, pan);

  const contextValue = {
    enableScrubbing,
    scrubberPosition,
    onScrubberPositionChange: handlePositionChange as (
      index: number | undefined,
    ) => void,
  };

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
