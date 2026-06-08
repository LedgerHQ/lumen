import { useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { G } from 'react-native-svg';

import type { ChartInset } from '../../utils/types';
import { defaultXAxisProps, defaultYAxisProps } from '../Axis';
import { DEFAULT_AXIS_HEIGHT, XAxis } from '../Axis/XAxis';
import { YAxis } from '../Axis/YAxis';
import { CartesianChart } from '../CartesianChart';
import { ChartEmptyLabel } from '../CartesianChart/ChartEmptyLabel';
import { useShimmerAnimation } from '../CartesianChart/ShimmerAnimation';
import { Line } from '../Line';

import { LineChartEmptyState } from './LineChartEmptyState';
import type { LineChartProps } from './types';

const AnimatedG = Animated.createAnimatedComponent(G);

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
}: LineChartProps) => {
  const { animatedProps: transitionShimmerProps } =
    useShimmerAnimation(loading);
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

  const hasData = (series ?? []).some((s) => {
    let validPoints = 0;
    for (const value of s.data ?? []) {
      if (value !== null) validPoints++;
      if (validPoints >= 2) return true;
    }
    return false;
  });
  const isInitialLoading = loading && !hasData;
  const isEmpty = !loading && !hasData;
  const isTransitionLoading = loading && hasData;
  const isPlaceholder = isInitialLoading || isEmpty;

  let ariaLabel: string | undefined;
  if (isEmpty) {
    ariaLabel = emptyLabel;
  } else if (loading) {
    ariaLabel = 'Loading chart';
  }

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
        isEmpty ? <ChartEmptyLabel>{emptyLabel}</ChartEmptyLabel> : undefined
      }
    >
      {isPlaceholder ? (
        <LineChartEmptyState loading={isInitialLoading} />
      ) : (
        <>
          {showXAxis && <XAxis {...xAxisConfig} />}
          {showYAxis && <YAxis {...yAxisConfig} />}
          {isTransitionLoading ? (
            <AnimatedG animatedProps={transitionShimmerProps}>
              {series?.map((s) => (
                <Line
                  key={s.id}
                  seriesId={s.id}
                  stroke={s.stroke}
                  showArea={showArea}
                  areaType={areaType}
                />
              ))}
            </AnimatedG>
          ) : (
            series?.map((s) => (
              <Line
                key={s.id}
                seriesId={s.id}
                showArea={showArea}
                areaType={areaType}
              />
            ))
          )}
          {children}
        </>
      )}
    </CartesianChart>
  );
};
