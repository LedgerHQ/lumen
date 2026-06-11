import { useMemo } from 'react';

import type { ChartInset } from '../../utils/types';
import { defaultXAxisProps, defaultYAxisProps } from '../Axis';
import { DEFAULT_AXIS_HEIGHT, XAxis } from '../Axis/XAxis';
import { YAxis } from '../Axis/YAxis';
import { CartesianChart } from '../CartesianChart';
import { Line } from '../Line';

import type { LineChartProps } from './types';

export const LineChart = ({
  series,
  showArea = false,
  areaType = 'gradient',
  showXAxis = false,
  showYAxis = false,
  xAxis,
  yAxis,
  width,
  height = 228,
  inset,
  children,
  enableScrubbing = false,
  onScrubberPositionChange,
  animate,
  magnetRadius,
}: LineChartProps) => {
  const xAxisConfig = {
    ...defaultXAxisProps,
    ...xAxis,
  };
  const yAxisConfig = {
    ...defaultYAxisProps,
    ...yAxis,
  };

  const axisPadding: Partial<ChartInset> | undefined = useMemo(() => {
    if (!showXAxis && !showYAxis) {
      return undefined;
    }

    return {
      top:
        showXAxis && xAxisConfig.position === 'top' ? DEFAULT_AXIS_HEIGHT : 0,
      bottom:
        showXAxis && xAxisConfig.position === 'bottom'
          ? DEFAULT_AXIS_HEIGHT
          : 0,
      left:
        showYAxis && yAxisConfig.position === 'start' ? yAxisConfig.width : 0,
      right:
        showYAxis && yAxisConfig.position === 'end' ? yAxisConfig.width : 0,
    };
  }, [
    showXAxis,
    showYAxis,
    xAxisConfig?.position,
    yAxisConfig?.position,
    yAxisConfig?.width,
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
      enableScrubbing={enableScrubbing}
      onScrubberPositionChange={onScrubberPositionChange}
      animate={animate}
      magnetRadius={magnetRadius}
    >
      {showXAxis && <XAxis {...xAxisConfig} />}
      {showYAxis && <YAxis {...yAxisConfig} />}
      {series?.map((s) => (
        <Line
          key={s.id}
          stroke={s.stroke}
          seriesId={s.id}
          showArea={showArea}
          areaType={areaType}
        />
      ))}
      {children}
    </CartesianChart>
  );
};
