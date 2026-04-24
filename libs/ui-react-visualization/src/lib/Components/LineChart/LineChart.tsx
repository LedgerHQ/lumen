import { useMemo } from 'react';

import type { AxisConfigProps, ChartInset } from '../../utils/types';
import { DEFAULT_AXIS_HEIGHT, XAxis } from '../Axis/XAxis';
import { DEFAULT_AXIS_WIDTH, YAxis } from '../Axis/YAxis';
import { CartesianChart } from '../CartesianChart';
import { Line } from '../Line';

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
    const xAxisPosition =
      xAxisVisualProps.position === 'top' ? 'top' : 'bottom';
    const yAxisPosition =
      yAxisVisualProps.position === 'end' ? 'right' : 'left';
    const yAxisWidth = yAxisVisualProps.width ?? DEFAULT_AXIS_WIDTH;

    return {
      top: showXAxis && xAxisPosition === 'top' ? DEFAULT_AXIS_HEIGHT : 0,
      bottom: showXAxis && xAxisPosition === 'bottom' ? DEFAULT_AXIS_HEIGHT : 0,
      left: showYAxis && yAxisPosition === 'left' ? yAxisWidth : 0,
      right: showYAxis && yAxisPosition === 'right' ? yAxisWidth : 0,
    };
  }, [
    showXAxis,
    showYAxis,
    xAxisVisualProps.position,
    yAxisVisualProps.position,
    yAxisVisualProps.width,
  ]);

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
      {showXAxis && <XAxis {...xAxisVisualProps} />}
      {showYAxis && <YAxis {...yAxisVisualProps} />}
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
