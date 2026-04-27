import { useCallback, useMemo, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { Svg } from 'react-native-svg';

import type { ChartInset } from '../../utils/types';

import { CartesianChartProvider, useBuildChartContext } from './context';
import type { CartesianChartProps } from './types';

const DEFAULT_HEIGHT = 160;
const DEFAULT_INSET: ChartInset = {
  top: 5,
  right: 20,
  bottom: 0,
  left: 20,
};
const ZERO_PADDING: ChartInset = { top: 0, right: 0, bottom: 0, left: 0 };

const resolveInset = (inset: CartesianChartProps['inset']): ChartInset => {
  if (inset === undefined) return DEFAULT_INSET;
  if (typeof inset === 'number') {
    return {
      top: inset + DEFAULT_INSET.top,
      right: inset + DEFAULT_INSET.right,
      bottom: inset + DEFAULT_INSET.bottom,
      left: inset + DEFAULT_INSET.left,
    };
  }
  return {
    top: (inset.top ?? 0) + DEFAULT_INSET.top,
    right: (inset.right ?? 0) + DEFAULT_INSET.right,
    bottom: (inset.bottom ?? 0) + DEFAULT_INSET.bottom,
    left: (inset.left ?? 0) + DEFAULT_INSET.left,
  };
};

const resolveAxisPadding = (
  padding: CartesianChartProps['axisPadding'],
): ChartInset => {
  if (padding === undefined) return ZERO_PADDING;
  return {
    top: padding.top ?? 0,
    right: padding.right ?? 0,
    bottom: padding.bottom ?? 0,
    left: padding.left ?? 0,
  };
};

export const CartesianChart = ({
  series,
  xAxis,
  yAxis,
  width,
  height = DEFAULT_HEIGHT,
  inset,
  axisPadding,
  ariaLabel = 'Chart',
  children,
}: CartesianChartProps) => {
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
          marginLeft: -20,
          marginRight: -20,
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
        marginLeft: -20,
        marginRight: -20,
      }}
    >
      {svgContent}
    </View>
  );
};
