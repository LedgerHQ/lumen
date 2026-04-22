import { useMemo } from 'react';

import type { AxisConfigProps, ChartInset } from '../../utils/types';
import { CartesianChart } from '../CartesianChart';
import { Line } from '../Line';
import { DEFAULT_AXIS_HEIGHT, XAxis } from '../XAxis';
import { DEFAULT_AXIS_WIDTH, YAxis } from '../YAxis';

import type { LineChartProps } from './types';

export function LineChart({
  series,
  showArea = false,
  areaType = 'gradient',
  showXAxis = false,
  showYAxis = false,
  xAxis,
  yAxis,
  width = '100%',
  height = 160,
  inset,
  children,
}: LineChartProps) {
  const {
    scaleType: xScaleType,
    data: xData,
    domain: xDomain,
    ...xAxisVisualProps
  } = xAxis ?? {};

  const {
    scaleType: yScaleType,
    data: yData,
    domain: yDomain,
    ...yAxisVisualProps
  } = yAxis ?? {};

  const xAxisConfig: Partial<AxisConfigProps> = {
    scaleType: xScaleType,
    data: xData,
    domain: xDomain,
  };

  const yAxisConfig: Partial<AxisConfigProps> = {
    scaleType: yScaleType,
    data: yData,
    domain: yDomain,
  };

  const axisPadding: Partial<ChartInset> | undefined = useMemo(() => {
    if (!showXAxis && !showYAxis) return undefined;
    return {
      bottom: showXAxis ? DEFAULT_AXIS_HEIGHT : 0,
      left: showYAxis ? DEFAULT_AXIS_WIDTH : 0,
    };
  }, [showXAxis, showYAxis]);

  return (
    <CartesianChart
      series={series ?? []}
      xAxis={xAxisConfig}
      yAxis={yAxisConfig}
      width={width}
      height={height}
      inset={inset}
      axisPadding={axisPadding}
    >
      {showXAxis && xAxisVisualProps.showGrid && (
        <XAxis {...xAxisVisualProps} showLine={false} showTickMark={false} />
      )}
      {showYAxis && yAxisVisualProps.showGrid && (
        <YAxis {...yAxisVisualProps} showLine={false} showTickMark={false} />
      )}
      {showXAxis && <XAxis {...xAxisVisualProps} showGrid={false} />}
      {showYAxis && <YAxis {...yAxisVisualProps} showGrid={false} />}
      {series?.map((s) => (
        <Line
          key={s.id}
          seriesId={s.id}
          showArea={showArea}
          areaType={areaType}
        />
      ))}
      {children}
    </CartesianChart>
  );
}
