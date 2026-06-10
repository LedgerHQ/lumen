import { useMemo } from 'react';

import { defaultXAxisProps, defaultYAxisProps } from '../Axis';
import { XAxis } from '../Axis/XAxis';
import { YAxis } from '../Axis/YAxis';
import { CartesianChart } from '../CartesianChart';
import { ChartEmptyLabel } from '../CartesianChart/ChartEmptyLabel/ChartEmptyLabel';
import { useShimmerAnimation } from '../CartesianChart/hooks/useShimmerAnimation';
import { Line } from '../Line';

import { LineChartEmptyState } from './LineChartEmptyState';
import type {
  LineChartContentProps,
  LineChartLinesProps,
  LineChartProps,
} from './types';
import {
  canRenderLine,
  computeAxisPadding,
  getChartDisplayState,
} from './utils';

const LineChartLines = ({
  series,
  showArea,
  areaType,
}: Readonly<LineChartLinesProps>) => {
  return (
    <>
      {series.map((s) => (
        <Line
          key={s.id}
          seriesId={s.id}
          stroke={s.stroke}
          showArea={showArea}
          areaType={areaType}
        />
      ))}
    </>
  );
};

const LineChartTransitionLines = ({
  series,
  showArea,
  areaType,
}: Readonly<Omit<LineChartLinesProps, 'stroke'>>) => {
  const { animationStyle, keyframe } = useShimmerAnimation();

  return (
    <>
      <style>{keyframe}</style>
      <g style={{ animation: animationStyle }}>
        <LineChartLines
          series={series}
          showArea={showArea}
          areaType={areaType}
        />
      </g>
    </>
  );
};

const LineChartContent = ({
  series,
  showArea,
  areaType,
  showXAxis,
  showYAxis,
  xAxisConfig,
  yAxisConfig,
  isTransitionLoading,
  children,
}: Readonly<LineChartContentProps>) => {
  return (
    <>
      {showXAxis && <XAxis {...xAxisConfig} />}
      {showYAxis && <YAxis {...yAxisConfig} />}
      {isTransitionLoading ? (
        <LineChartTransitionLines
          series={series}
          showArea={showArea}
          areaType={areaType}
        />
      ) : (
        <LineChartLines
          series={series}
          showArea={showArea}
          areaType={areaType}
        />
      )}
      {children}
    </>
  );
};

export function LineChart({
  series,
  showArea = false,
  areaType = 'gradient',
  showXAxis = false,
  showYAxis = false,
  xAxis,
  yAxis,
  width = '100%',
  height = 240,
  inset,
  enableScrubbing,
  onScrubberPositionChange,
  animate,
  magnetRadius,
  loading = false,
  emptyLabel = 'No data',
  children,
}: Readonly<LineChartProps>) {
  const xAxisConfig = {
    ...defaultXAxisProps,
    ...xAxis,
    position: xAxis?.position ?? defaultXAxisProps.position,
  };
  const yAxisConfig = {
    ...defaultYAxisProps,
    ...yAxis,
    position: yAxis?.position ?? defaultYAxisProps.position,
    width: yAxis?.width ?? defaultYAxisProps.width,
  };

  const xAxisPosition = xAxisConfig.position;
  const yAxisPosition = yAxisConfig.position;
  const yAxisWidth = yAxisConfig.width;

  const axisPadding = useMemo(
    () =>
      computeAxisPadding({
        showXAxis,
        showYAxis,
        xAxisPosition,
        yAxisPosition,
        yAxisWidth,
      }),
    [showXAxis, showYAxis, xAxisPosition, yAxisPosition, yAxisWidth],
  );

  const hasData = canRenderLine(series, xAxisConfig.data);

  const { status, ariaLabel } = getChartDisplayState({
    loading,
    hasData,
    emptyLabel,
  });

  const isTransitionLoading = status === 'transition-loading';
  const isPlaceholder = status === 'initial-loading' || status === 'empty';

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
      ariaLabel={ariaLabel}
      ariaBusy={loading}
      overlay={
        status === 'empty' ? (
          <ChartEmptyLabel>{emptyLabel}</ChartEmptyLabel>
        ) : undefined
      }
    >
      {isPlaceholder ? (
        <LineChartEmptyState loading={status === 'initial-loading'} />
      ) : (
        <LineChartContent
          series={series ?? []}
          showArea={showArea}
          areaType={areaType}
          showXAxis={showXAxis}
          showYAxis={showYAxis}
          xAxisConfig={xAxisConfig}
          yAxisConfig={yAxisConfig}
          isTransitionLoading={isTransitionLoading}
        >
          {children}
        </LineChartContent>
      )}
    </CartesianChart>
  );
}
