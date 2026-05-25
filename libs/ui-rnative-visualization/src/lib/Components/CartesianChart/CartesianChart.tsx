import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Svg } from 'react-native-svg';

import { ScrubberProvider } from '../Scrubber/ScrubberProvider';
import { CartesianChartProvider, useBuildChartContext } from './context';
import { RevealClipDefs } from './RevealClip';
import type { CartesianChartProps } from './types';
import {
  DEFAULT_HEIGHT,
  OVERFLOW_NEGATIVE_MARGIN,
  resolveAxisPadding,
  resolveInset,
} from './utils';

const styles = StyleSheet.create({
  decorationsLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'visible',
  },
});

export function CartesianChart({
  series,
  xAxis,
  yAxis,
  width,
  height = DEFAULT_HEIGHT,
  inset,
  axisPadding,
  ariaLabel = 'Chart',
  decorations,
  children,
  enableScrubbing = false,
  onScrubberPositionChange,
  animate = true,
}: Readonly<CartesianChartProps>) {
  const [measuredWidth, setMeasuredWidth] = useState<number | undefined>(width);

  const needsMeasurement = width === undefined;

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (needsMeasurement) {
        setMeasuredWidth(e.nativeEvent.layout.width);
      }
    },
    [needsMeasurement],
  );

  const resolvedWidth = width ?? measuredWidth ?? 0;

  const resolvedInset = useMemo(() => resolveInset(inset), [inset]);
  const resolvedAxisPadding = useMemo(
    () => resolveAxisPadding(axisPadding),
    [axisPadding],
  );

  const contextValue = useBuildChartContext({
    series,
    xAxis,
    yAxis,
    width: resolvedWidth,
    height,
    inset: resolvedInset,
    axisPadding: resolvedAxisPadding,
  });

  // Backwards compatibility: when only `children` is provided (no `decorations`),
  // render `children` in the chrome layer with no reveal animation. This
  // preserves the behavior of older consumers that pass mixed content as
  // children directly to `<CartesianChart>`.
  const usingLegacyChildrenOnly = decorations === undefined;
  const chromeContent = usingLegacyChildrenOnly ? children : decorations;
  const dataContent = usingLegacyChildrenOnly ? null : children;

  return (
    <View
      testID='chart-container'
      onLayout={needsMeasurement ? handleLayout : undefined}
      accessibilityRole='image'
      accessibilityLabel={ariaLabel}
      style={{
        width: needsMeasurement ? undefined : resolvedWidth,
        height,
        ...OVERFLOW_NEGATIVE_MARGIN,
      }}
    >
      {resolvedWidth > 0 && (
        <CartesianChartProvider value={contextValue}>
          <ScrubberProvider
            width={resolvedWidth}
            height={height}
            enableScrubbing={enableScrubbing}
            onScrubberPositionChange={onScrubberPositionChange}
          >
            <Svg
              testID='chart-svg'
              width={resolvedWidth}
              height={height}
              style={styles.decorationsLayer}
            >
              {chromeContent}
            </Svg>
            {dataContent != null && (
              <RevealClipDefs
                width={resolvedWidth}
                height={height}
                series={series}
                animate={animate}
              >
                <Svg
                  testID='chart-data-svg'
                  width={resolvedWidth}
                  height={height}
                  style={{ overflow: 'visible' }}
                >
                  {dataContent}
                </Svg>
              </RevealClipDefs>
            )}
          </ScrubberProvider>
        </CartesianChartProvider>
      )}
    </View>
  );
}
