import { useId, useMemo } from 'react';

import { isNumericScale } from '../../utils/scales/scales';
import { useCartesianChartContext } from '../CartesianChart/context';
import { useRevealClip } from '../CartesianChart/RevealClip';

import {
  LINE_AREA_GRADIENT_OPACITY,
  LINE_DEFAULT_STROKE_COLOR,
  LINE_STROKE_WIDTH,
} from './constants';
import type { LineProps } from './types';
import { toScaledPoints, buildLinePath, buildAreaPath } from './utils';

export function Line({
  seriesId,
  stroke,
  showArea = false,
  areaType: _areaType = 'gradient',
  curve,
}: LineProps) {
  const { getXScale, getYScale, getXAxisConfig, drawingArea, seriesMap } =
    useCartesianChartContext();
  const clipPath = useRevealClip();

  const xScale = getXScale();
  const yScale = getYScale();
  const xAxisConfig = getXAxisConfig();

  const gradientId = useId();
  const seriesData = seriesMap.get(seriesId);
  const resolvedStroke =
    (stroke ?? seriesData?.stroke) || LINE_DEFAULT_STROKE_COLOR;
  const resolvedCurve = curve ?? seriesData?.curve;

  const points = useMemo(
    () =>
      seriesData?.data && xScale && yScale && isNumericScale(yScale)
        ? toScaledPoints(seriesData.data, xScale, yScale, xAxisConfig?.data)
        : null,
    [seriesData, xScale, yScale, xAxisConfig],
  );

  const linePath = useMemo(
    () => (points ? buildLinePath(points, resolvedCurve) : null),
    [points, resolvedCurve],
  );

  const areaPath = useMemo(
    () =>
      showArea && points && drawingArea
        ? buildAreaPath(points, drawingArea, resolvedCurve)
        : null,
    [showArea, points, drawingArea, resolvedCurve],
  );

  if (!linePath) {
    return null;
  }

  return (
    <g clipPath={clipPath}>
      {showArea && areaPath && resolvedStroke && (
        <>
          <defs>
            <linearGradient
              data-testid='line-gradient'
              id={gradientId}
              x1='0'
              y1='0'
              x2='0'
              y2='1'
            >
              <stop
                offset='0%'
                stopColor={resolvedStroke}
                stopOpacity={LINE_AREA_GRADIENT_OPACITY}
              />
              <stop offset='100%' stopColor={resolvedStroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path
            data-testid='line-area'
            d={areaPath}
            fill={`url(#${gradientId})`}
            stroke='none'
          />
        </>
      )}
      <path
        data-testid='line-path'
        d={linePath}
        fill='none'
        stroke={resolvedStroke}
        strokeWidth={LINE_STROKE_WIDTH}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
  );
}
