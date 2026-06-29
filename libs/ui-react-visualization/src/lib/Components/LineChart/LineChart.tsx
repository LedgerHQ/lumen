import { cssVar } from '@ledgerhq/lumen-design-core';
import { useMemo } from 'react';

import { defaultXAxisProps, defaultYAxisProps } from '../Axis';
import { XAxis } from '../Axis/XAxis';
import { YAxis } from '../Axis/YAxis';
import { CartesianChart } from '../CartesianChart';
import { ChartEmptyLabel } from '../CartesianChart/ChartEmptyLabel/ChartEmptyLabel';
import { DEFAULT_HEIGHT } from '../CartesianChart/constants';
import { useShimmerAnimation } from '../CartesianChart/hooks/useShimmerAnimation';
import { Line } from '../Line';

import { DEFAULT_EMPTY_LABEL } from './constants';
import { LineChartEmptyState } from './LineChartEmptyState';
import type {
  LineChartContentProps,
  LineChartLinesProps,
  LineChartProps,
  LineChartTransitionLinesProps,
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
  connectNulls,
  stroke,
}: Readonly<LineChartLinesProps>) => {
  return (
    <>
      {series.map((s) => (
        <Line
          key={s.id}
          seriesId={s.id}
          stroke={stroke ?? s.stroke}
          showArea={showArea}
          areaType={areaType}
          connectNulls={connectNulls}
        />
      ))}
    </>
  );
};

const LineChartTransitionLines = ({
  series,
  showArea,
  areaType,
  connectNulls,
}: Readonly<LineChartTransitionLinesProps>) => {
  const { animationStyle, keyframe } = useShimmerAnimation();

  return (
    <>
      <style>{keyframe}</style>
      <g style={{ animation: animationStyle }}>
        <LineChartLines
          series={series}
          showArea={showArea}
          areaType={areaType}
          connectNulls={connectNulls}
          stroke={cssVar('var(--border-muted-subtle)')}
        />
      </g>
    </>
  );
};

const LineChartContent = ({
  series,
  showArea,
  areaType,
  connectNulls,
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
          connectNulls={connectNulls}
        />
      ) : (
        <LineChartLines
          series={series}
          showArea={showArea}
          areaType={areaType}
          connectNulls={connectNulls}
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
  connectNulls,
  showXAxis = false,
  showYAxis = false,
  xAxis,
  yAxis,
  width = '100%',
  height = DEFAULT_HEIGHT,
  inset,
  enableScrubbing,
  onScrubberPositionChange,
  animate,
  magnetRadius,
  loading = false,
  emptyLabel = DEFAULT_EMPTY_LABEL,
  children,
}: Readonly<LineChartProps>) {
  const xAxisConfig = useMemo(
    () => ({
      ...defaultXAxisProps,
      ...xAxis,
      position: xAxis?.position ?? defaultXAxisProps.position,
    }),
    [xAxis],
  );
  const yAxisConfig = useMemo(
    () => ({
      ...defaultYAxisProps,
      ...yAxis,
      position: yAxis?.position ?? defaultYAxisProps.position,
      width: yAxis?.width ?? defaultYAxisProps.width,
    }),
    [yAxis],
  );

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
          connectNulls={connectNulls}
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
