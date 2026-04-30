import { useCallback, useMemo, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { Svg } from 'react-native-svg';

import { CartesianChartProvider, useBuildChartContext } from './context';
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
}: CartesianChartProps) {
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

  const svgContent = resolvedWidth > 0 && (
    <Svg
      testID='chart-svg'
      width={resolvedWidth}
      height={height}
      style={{ overflow: 'visible' }}
    >
      <CartesianChartProvider value={contextValue}>
        {children}
      </CartesianChartProvider>
    </Svg>
  );

  if (needsMeasurement) {
    return (
      <View
        testID='chart-container'
        onLayout={handleLayout}
        style={{
          height,
          ...OVERFLOW_NEGATIVE_MARGIN,
        }}
        accessibilityRole='image'
        accessibilityLabel={ariaLabel}
      >
        {svgContent}
      </View>
    );
  }

  return (
    <View
      testID='chart-container'
      accessibilityRole='image'
      accessibilityLabel={ariaLabel}
      style={{
        width: resolvedWidth,
        height,
        ...OVERFLOW_NEGATIVE_MARGIN,
      }}
    >
      {svgContent}
    </View>
  );
}
