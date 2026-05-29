import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useCartesianChartContext } from '../CartesianChart/context';
import { useMagneticPointsContext } from '../Point/pointContext';
import { ScrubberContextProvider } from './context';
import type { ScrubberProviderProps } from './types';
import {
  applyMagnetisation,
  getDataIndexFromPosition,
  resolvePixelX,
  buildSortedMagnets,
} from './utils';

const LONG_PRESS_MIN_DURATION_MS = 50;

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
  magnetRadius = 6,
}: Readonly<ScrubberProviderProps>) {
  const [scrubberPosition, setScrubberPosition] = useState<
    number | undefined
  >();

  const { getXScale, getXAxisConfig, dataLength } = useCartesianChartContext();
  const { getMagneticPoints, version } = useMagneticPointsContext();

  // All values touched by the gesture's JS-thread callback live in a single
  // ref. Reading via `latest.current` keeps the callbacks reference-stable
  // across data, scale, and prop updates, which in turn keeps `composed` and
  // the gesture surface JSX stable so re-rendering the provider on each
  // index change never tears down the GestureDetector or the View tree.
  const latest = useRef({
    getXScale,
    getXAxisConfig,
    dataLength,
    onChange: onScrubberPositionChange,
    lastIndex: undefined as number | undefined,
  });
  latest.current.getXScale = getXScale;
  latest.current.getXAxisConfig = getXAxisConfig;
  latest.current.dataLength = dataLength;
  latest.current.onChange = onScrubberPositionChange;

  const sortedMagnets = useMemo(() => {
    const magneticIndices = getMagneticPoints();
    return buildSortedMagnets({
      magneticIndices,
      getPixelForIndex: (index) =>
        resolvePixelX(index, getXScale, getXAxisConfig()),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, getXScale, getXAxisConfig, getMagneticPoints]);

  const setScrubberPositionAndNotify = useCallback(
    (index: number | undefined) => {
      const ref = latest.current;
      const clamped =
        index === undefined || ref.dataLength <= 0
          ? undefined
          : Math.max(0, Math.min(index, ref.dataLength - 1));
      if (clamped === ref.lastIndex) return;
      ref.lastIndex = clamped;
      setScrubberPosition(clamped);
      ref.onChange?.(clamped);
    },
    [],
  );

  const handlePositionChange = useCallback(
    (pixelX: number | null) => {
      if (pixelX === null) {
        setScrubberPositionAndNotify(undefined);
        return;
      }
      const ref = latest.current;
      const scale = ref.getXScale();
      if (!scale || ref.dataLength <= 0) return;

      const xAxisConfig = ref.getXAxisConfig();

      let index = getDataIndexFromPosition(
        pixelX,
        scale,
        xAxisConfig,
        ref.dataLength,
      );

      if (magnetRadius > 0) {
        index = applyMagnetisation({
          resolvedIndex: index,
          pixelX,
          sortedMagnets,
          magnetRadius,
        });
      }

      setScrubberPositionAndNotify(index);
    },
    [magnetRadius, setScrubberPositionAndNotify, sortedMagnets],
  );

  const isScrubbing = useSharedValue(false);

  const resetScrubber = useCallback((): void => {
    'worklet';
    isScrubbing.value = false;
    scheduleOnRN(handlePositionChange, null);
  }, [isScrubbing, handlePositionChange]);

  const composed = useMemo(() => {
    const longPress = Gesture.LongPress()
      .minDuration(LONG_PRESS_MIN_DURATION_MS)
      .onStart((e) => {
        'worklet';
        isScrubbing.value = true;
        scheduleOnRN(handlePositionChange, e.x);
      });

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

  // Memoizing the surface lets React's element-identity bailout skip
  // reconciling the View / GestureDetector / chart `children` subtree when
  // only `scrubberPosition` changes. The Scrubber consumer still updates via
  // context as expected.
  const surface = useMemo(
    () => (
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
    ),
    [width, height, children, enableScrubbing, composed],
  );

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
      {surface}
    </ScrubberContextProvider>
  );
}
