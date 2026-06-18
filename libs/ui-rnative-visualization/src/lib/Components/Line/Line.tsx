import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useId, useMemo } from 'react';
import { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';

import { isNumericScale } from '../../utils/scales/scales';
import { useCartesianChartContext } from '../CartesianChart/context';
import { usePathReveal } from '../CartesianChart/RevealAnimation';

import { LINE_AREA_GRADIENT_OPACITY, LINE_STROKE_WIDTH } from './constants';
import type { LineProps } from './types';
import { buildAreaPath, buildLinePath, toScaledPoints } from './utils';

export const Line = ({
  seriesId,
  stroke,
  showArea = false,
  areaType: _areaType = 'gradient',
  curve,
  connectNulls,
}: LineProps) => {
  const { getXScale, getYScale, getXAxisConfig, drawingArea, seriesMap } =
    useCartesianChartContext();
  const clipPath = usePathReveal();

  const xScale = getXScale();
  const yScale = getYScale();
  const xAxisConfig = getXAxisConfig();

  const { theme } = useTheme();
  const gradientId = useId();
  const seriesData = seriesMap.get(seriesId);
  const resolvedStroke =
    stroke ?? seriesData?.stroke ?? theme.colors.border.muted;
  const resolvedCurve = curve ?? seriesData?.curve;
  const resolvedConnectNulls =
    connectNulls ?? seriesData?.connectNulls ?? false;

  const points = useMemo(
    () =>
      seriesData?.data && xScale && yScale && isNumericScale(yScale)
        ? toScaledPoints(
            seriesData.data,
            xScale,
            yScale,
            xAxisConfig?.data,
            resolvedConnectNulls,
          )
        : null,
    [seriesData, xScale, yScale, xAxisConfig, resolvedConnectNulls],
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
    <G clipPath={clipPath}>
      {showArea && areaPath && resolvedStroke && (
        <>
          <Defs>
            <LinearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
              <Stop
                offset='0%'
                stopColor={resolvedStroke}
                stopOpacity={LINE_AREA_GRADIENT_OPACITY}
              />
              <Stop offset='100%' stopColor={resolvedStroke} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path
            testID='line-area'
            d={areaPath}
            fill={`url(#${gradientId})`}
            stroke='none'
          />
        </>
      )}
      <Path
        testID='line-path'
        d={linePath}
        fill='none'
        stroke={resolvedStroke}
        strokeWidth={LINE_STROKE_WIDTH}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </G>
  );
};
