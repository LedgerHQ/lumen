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
  OVERFLOW_NEGATIVE_MARGIN,
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
          <MagneticPointsProvider>
            <ScrubberProvider
              width={resolvedWidth}
              height={height}
              enableScrubbing={enableScrubbing}
              onScrubberPositionChange={onScrubberPositionChange}
              magnetRadius={magnetRadius}
            >
              <Svg
                testID='chart-svg'
                width={resolvedWidth}
                height={height}
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
