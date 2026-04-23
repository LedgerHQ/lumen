import { useMemo } from 'react';

import {
  computeDataLength,
  computeXDomain,
  computeYDomain,
} from '../../../utils/domain/domain';
import {
  getCategoricalScale,
  getNumericScale,
  isBandScaleType,
} from '../../../utils/scales/scales';
import type {
  AxisBounds,
  AxisConfigProps,
  CartesianChartContextValue,
  ChartInset,
  ChartScaleFunction,
  DrawingArea,
  Series,
} from '../../../utils/types';

type UseBuildChartContextParams = {
  series: Series[];
  xAxis?: Partial<AxisConfigProps>;
  yAxis?: Partial<AxisConfigProps>;
  width: number;
  height: number;
  inset: ChartInset;
  axisPadding: ChartInset;
};

type AxisRange = { min: number; max: number };

export const computeAxisRange = (
  drawingArea: DrawingArea,
): { xRange: AxisRange; yRange: AxisRange } => ({
  xRange: { min: drawingArea.x, max: drawingArea.x + drawingArea.width },
  yRange: {
    min: drawingArea.y + drawingArea.height,
    max: drawingArea.y,
  },
});

export const buildScale = (
  domain: AxisBounds,
  range: AxisRange,
  scaleType: AxisConfigProps['scaleType'] = 'linear',
): ChartScaleFunction =>
  isBandScaleType(scaleType)
    ? getCategoricalScale({ domain, range })
    : getNumericScale({ scaleType, domain, range });

export const computeDrawingArea = (
  width: number,
  height: number,
  inset: ChartInset,
  axisPadding: ChartInset,
): DrawingArea => {
  const totalInset = {
    top: inset.top + axisPadding.top,
    right: inset.right + axisPadding.right,
    bottom: inset.bottom + axisPadding.bottom,
    left: inset.left + axisPadding.left,
  };
  return {
    x: totalInset.left,
    y: totalInset.top,
    width: Math.max(0, width - totalInset.left - totalInset.right),
    height: Math.max(0, height - totalInset.top - totalInset.bottom),
  };
};

export const useBuildChartContext = ({
  series,
  xAxis,
  yAxis,
  width,
  height,
  inset,
  axisPadding,
}: UseBuildChartContextParams): CartesianChartContextValue => {
  const drawingArea = useMemo(
    () => computeDrawingArea(width, height, inset, axisPadding),
    [width, height, inset, axisPadding],
  );

  return useMemo(() => {
    const { xRange, yRange } = computeAxisRange(drawingArea);

    let xScale: ChartScaleFunction | undefined;
    let yScale: ChartScaleFunction | undefined;

    if (drawingArea.width > 0 && drawingArea.height > 0) {
      const xDomain = computeXDomain(series, xAxis);
      const yDomain = computeYDomain(series, yAxis);
      xScale = buildScale(xDomain, xRange, xAxis?.scaleType);
      yScale = buildScale(yDomain, yRange, yAxis?.scaleType);
    }

    const dataLength = computeDataLength(series, xAxis);
    const seriesMap = new Map(series.map((s) => [s.id, s]));

    return {
      series,
      seriesMap,
      getXScale: (_id?: string) => xScale,
      getYScale: (_id?: string) => yScale,
      getXAxisConfig: (_id?: string) => xAxis,
      getYAxisConfig: (_id?: string) => yAxis,
      drawingArea,
      dataLength,
    };
  }, [series, xAxis, yAxis, drawingArea]);
};
