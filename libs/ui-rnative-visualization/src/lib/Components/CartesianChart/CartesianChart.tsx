import { useCallback, useMemo, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { Svg } from 'react-native-svg';

import { MagneticPointsProvider } from '../Point/pointContext';
import { ScrubberProvider } from '../Scrubber/ScrubberProvider';
import { CartesianChartProvider, useBuildChartContext } from './context';
import { RevealClipDefs } from './RevealClip';
import type { CartesianChartProps } from './types';
import {
  DEFAULT_HEIGHT,
  OVERFLOW_BUFFER,
  OVERFLOW_OFFSET,
  resolveAxisPadding,
  resolveInset,
} from './utils';

export function CartesianChart({
  series,
  xAxis,
  yAxis,
  width,
  height = DEFAULT_HEIGHT,
  inset,
  axisPadding,
  ariaLabel = 'Chart',
  children,
  enableScrubbing = false,
  onScrubberPositionChange,
  animate = true,
  magnetRadius,
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

  // The SVG canvas is enlarged by the overflow buffer on every side so edge
  // content (labels, points, ticks) is not clipped, then shifted back by the
  // negative margin so the drawing area still spans the container footprint.
  const svgWidth =
    resolvedWidth > 0
      ? resolvedWidth + OVERFLOW_BUFFER.left + OVERFLOW_BUFFER.right
      : 0;
  const svgHeight = height + OVERFLOW_BUFFER.top + OVERFLOW_BUFFER.bottom;

  const resolvedInset = useMemo(() => resolveInset(inset), [inset]);
  const resolvedAxisPadding = useMemo(
    () => resolveAxisPadding(axisPadding),
    [axisPadding],
  );

  const contextValue = useBuildChartContext({
    series,
    xAxis,
    yAxis,
    width: svgWidth,
    height: svgHeight,
    inset: resolvedInset,
    axisPadding: resolvedAxisPadding,
  });

  return (
    <View
      testID='chart-container'
      onLayout={needsMeasurement ? handleLayout : undefined}
      accessibilityRole='image'
      accessibilityLabel={ariaLabel}
      style={{
        width: needsMeasurement ? undefined : resolvedWidth,
        height,
        overflow: 'visible',
      }}
    >
      {resolvedWidth > 0 && (
        <CartesianChartProvider value={contextValue}>
          <MagneticPointsProvider>
            <ScrubberProvider
              width={svgWidth}
              height={svgHeight}
              enableScrubbing={enableScrubbing}
              onScrubberPositionChange={onScrubberPositionChange}
              style={OVERFLOW_OFFSET}
              magnetRadius={magnetRadius}
            >
              <Svg
                testID='chart-svg'
                width={svgWidth}
                height={svgHeight}
                style={{ overflow: 'visible' }}
              >
                <RevealClipDefs
                  drawingArea={contextValue.drawingArea}
                  series={series}
                  animate={animate}
                >
                  {children}
                </RevealClipDefs>
              </Svg>
            </ScrubberProvider>
          </MagneticPointsProvider>
        </CartesianChartProvider>
      )}
    </View>
  );
}
