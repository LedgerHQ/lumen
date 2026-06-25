import { triggerHapticFeedback } from '@ledgerhq/lumen-ui-rnative';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { clamp } from '../../utils/numbers';
import { useCartesianChartContext } from '../CartesianChart/context';
import { useMagneticSnapshot } from '../Point/pointContext';
import { ScrubberContextProvider } from './context';
import type { ScrubberProviderProps } from './types';
import {
  applyMagnetisation,
  getDataIndexFromPosition,
  resolvePixelX,
  buildSortedMagnets,
} from './utils';

const LONG_PRESS_MIN_DURATION_MS = 100;

// Travel (px) past which a horizontal drag scrubs and a vertical drag fails
// the pan (yielding to an ancestor scroll view). Also bounds the long press.
const PAN_AXIS_THRESHOLD_PX = 10;

/**
 * Provides scrubbing interaction for a chart.
 *
 * Must be placed as a child of `CartesianChartProvider` (so it can access the
 * x-scale) but outside the `<Svg>` element (so it can render a transparent
 * gesture-capture `View` overlay). `CartesianChart` handles this positioning
 * automatically when `enableScrubbing` is true.
 *
 * Scrubbing engages on horizontal panning (`activeOffsetX`) or a press-and-hold
 * (`LongPress`); vertical movement fails the pan (`failOffsetY`) so an ancestor
 * vertical scroll view keeps scrolling.
 */
export function ScrubberProvider({
  children,
  width,
  height,
  enableScrubbing,
  onScrubberPositionChange,
  magnetRadius = 6,
  style,
}: Readonly<ScrubberProviderProps>) {
  const [scrubberPosition, setScrubberPosition] = useState<
    number | undefined
  >();

  const { getXScale, getXAxisConfig, dataLength } = useCartesianChartContext();
  const { getMagneticPoints, version } = useMagneticSnapshot();

  // Gesture callbacks read everything through this ref so they stay
  // reference-stable, keeping `composed` and the surface JSX from re-creating
  // (which would tear down the GestureDetector) on each index change.
  const sortedMagnets = useMemo(() => {
    const magneticIndices = getMagneticPoints();
    return buildSortedMagnets({
      magneticIndices,
      getPixelForIndex: (index) =>
        resolvePixelX(index, getXScale, getXAxisConfig()),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, getXScale, getXAxisConfig, getMagneticPoints]);

  const latest = useRef({
    getXScale,
    getXAxisConfig,
    dataLength,
    onChange: onScrubberPositionChange,
    lastIndex: undefined as number | undefined,
    magnetRadius,
    sortedMagnets,
  });
  latest.current.getXScale = getXScale;
  latest.current.getXAxisConfig = getXAxisConfig;
  latest.current.dataLength = dataLength;
  latest.current.onChange = onScrubberPositionChange;
  latest.current.magnetRadius = magnetRadius;
  latest.current.sortedMagnets = sortedMagnets;

  const handleHapticFeedback = useCallback(
    (ref: typeof latest.current, clamped: number | undefined) => {
      if (ref.lastIndex === undefined && clamped !== undefined) {
        triggerHapticFeedback('light');
      }
    },
    [],
  );

  const setScrubberPositionAndNotify = useCallback(
    (index: number | undefined) => {
      const ref = latest.current;
      const clamped =
        index === undefined || ref.dataLength <= 0
          ? undefined
          : clamp(index, 0, ref.dataLength - 1);
      if (clamped === ref.lastIndex) return;

      handleHapticFeedback(ref, clamped);

      ref.lastIndex = clamped;

      setScrubberPosition(clamped);
      ref.onChange?.(clamped);
    },
    [handleHapticFeedback],
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

      if (ref.magnetRadius > 0) {
        index = applyMagnetisation({
          resolvedIndex: index,
          pixelX,
          sortedMagnets: ref.sortedMagnets,
          magnetRadius: ref.magnetRadius,
        });
      }

      setScrubberPositionAndNotify(index);
    },
    [setScrubberPositionAndNotify],
  );

  const resetScrubber = useCallback((): void => {
    'worklet';
    scheduleOnRN(handlePositionChange, null);
  }, [handlePositionChange]);

  const composed = useMemo(() => {
    const longPress = Gesture.LongPress()
      .minDuration(LONG_PRESS_MIN_DURATION_MS)
      .maxDistance(PAN_AXIS_THRESHOLD_PX)
      .onStart((e) => {
        'worklet';
        scheduleOnRN(handlePositionChange, e.x);
      })
      .onEnd(resetScrubber);

    const pan = Gesture.Pan()
      .activeOffsetX([-PAN_AXIS_THRESHOLD_PX, PAN_AXIS_THRESHOLD_PX])
      .failOffsetY([-PAN_AXIS_THRESHOLD_PX, PAN_AXIS_THRESHOLD_PX])
      .onUpdate((e) => {
        'worklet';
        scheduleOnRN(handlePositionChange, e.x);
      })
      .onFinalize(resetScrubber);

    return Gesture.Simultaneous(longPress, pan);
  }, [handlePositionChange, resetScrubber]);

  // Memoized so a `scrubberPosition` change doesn't re-render the chart
  // subtree; the Scrubber still updates through context.
  const surface = useMemo(
    () => (
      <View style={[{ width, height }, style]}>
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
    [width, height, style, children, enableScrubbing, composed],
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
