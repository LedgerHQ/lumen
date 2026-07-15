import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { G } from 'react-native-svg';

import { XAxis, type XAxisProps } from '../Axis/XAxis';
import { YAxis, DEFAULT_AXIS_WIDTH, type YAxisProps } from '../Axis/YAxis';
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
  getChartAriaLabel,
  getChartDisplayStates,
  mergeDefaults,
} from './utils';

const AnimatedG = Animated.createAnimatedComponent(G);

const defaultXAxisProps: XAxisProps = {
  position: 'bottom',
  showGrid: false,
  showLine: false,
  showTickMark: false,
  scaleType: 'linear',
  nice: false,
};

const defaultYAxisProps: YAxisProps = {
  position: 'start',
  showGrid: false,
  showLine: false,
  showTickMark: false,
  scaleType: 'linear',
  nice: true,
  width: DEFAULT_AXIS_WIDTH,
};

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
  const xAxisConfig = useMemo(
    () => mergeDefaults(defaultXAxisProps, xAxis),
    [xAxis],
  );

  const yAxisConfig = useMemo(
    () => mergeDefaults(defaultYAxisProps, yAxis),
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

  const states = getChartDisplayStates({ loading, hasData });
  const ariaLabel = getChartAriaLabel({ loading, hasData, emptyLabel });

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
      animate={states.isTransitionLoading ? false : animate}
      magnetRadius={magnetRadius}
      ariaLabel={ariaLabel}
      ariaBusy={loading}
      overlay={
        states.showEmptyOverlay ? (
          <ChartEmptyLabel>{emptyLabel}</ChartEmptyLabel>
        ) : undefined
      }
    >
      {states.showPlaceholder ? (
        <LineChartEmptyState loading={states.placeholderLoading} />
      ) : (
        <LineChartContent
          series={series ?? []}
          showArea={showArea}
          areaType={areaType}
          showXAxis={showXAxis}
          showYAxis={showYAxis}
          xAxisConfig={xAxisConfig}
          yAxisConfig={yAxisConfig}
          isTransitionLoading={states.isTransitionLoading}
          connectNulls={connectNulls}
        >
          {children}
        </LineChartContent>
      )}
    </CartesianChart>
  );
};
