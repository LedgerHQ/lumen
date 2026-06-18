import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { G } from 'react-native-svg';

import { defaultXAxisProps, defaultYAxisProps } from '../Axis';
import { XAxis } from '../Axis/XAxis';
import { YAxis } from '../Axis/YAxis';
import { CartesianChart } from '../CartesianChart';
import { ChartEmptyLabel } from '../CartesianChart/ChartEmptyLabel';
import { useShimmerAnimation } from '../CartesianChart/hooks/useShimmerAnimation';
import { Line } from '../Line';

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

const AnimatedG = Animated.createAnimatedComponent(G);

const LineChartLines = ({
  series,
  showArea,
  areaType,
  stroke,
  connectNulls,
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
  const { theme } = useTheme();
  const { animatedProps } = useShimmerAnimation();

  return (
    <AnimatedG animatedProps={animatedProps}>
      <LineChartLines
        series={series}
        showArea={showArea}
        areaType={areaType}
        stroke={theme.colors.border.mutedSubtle}
        connectNulls={connectNulls}
      />
    </AnimatedG>
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
  connectNulls,
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
  loading = false,
  emptyLabel = 'No data',
  connectNulls,
}: Readonly<LineChartProps>) => {
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
      animate={isTransitionLoading ? false : animate}
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
          connectNulls={connectNulls}
        >
          {children}
        </LineChartContent>
      )}
    </CartesianChart>
  );
};
