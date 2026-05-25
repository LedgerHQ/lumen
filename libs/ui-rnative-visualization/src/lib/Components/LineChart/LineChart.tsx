import {
  Children,
  isValidElement,
  useMemo,
  type ReactElement,
  type ReactNode,
} from 'react';

import type { AxisConfigProps, ChartInset } from '../../utils/types';
import { DEFAULT_AXIS_HEIGHT, XAxis } from '../Axis/XAxis';
import { DEFAULT_AXIS_WIDTH, YAxis } from '../Axis/YAxis';
import { CartesianChart } from '../CartesianChart';
import { Line } from '../Line';
import { Point } from '../Point';

import type { LineChartProps } from './types';

/**
 * Components that should be rendered in the animated "data" layer of
 * `<CartesianChart>`, where they're progressively revealed by the reveal
 * animation. Anything else is routed to the always-visible "decorations" layer.
 */
const DATA_LAYER_COMPONENTS: ReadonlyArray<React.ElementType> = [Line, Point];

const isDataChild = (child: ReactNode): child is ReactElement => {
  if (!isValidElement(child)) return false;
  return DATA_LAYER_COMPONENTS.includes(child.type as React.ElementType);
};

const splitChildrenByLayer = (
  children: ReactNode,
): { decorations: ReactNode[]; data: ReactNode[] } => {
  const decorations: ReactNode[] = [];
  const data: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isDataChild(child)) {
      data.push(child);
    } else if (child != null && child !== false) {
      decorations.push(child);
    }
  });
  return { decorations, data };
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
  height = 160,
  inset,
  children,
  enableScrubbing = false,
  onScrubberPositionChange,
  animate,
}: LineChartProps) => {
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

  const { decorations: childDecorations, data: childData } = useMemo(
    () => splitChildrenByLayer(children),
    [children],
  );

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
      decorations={
        <>
          {showXAxis && <XAxis {...xAxisVisualProps} />}
          {showYAxis && <YAxis {...yAxisVisualProps} />}
          {childDecorations}
        </>
      }
    >
      {series?.map((s) => (
        <Line
          key={s.id}
          seriesId={s.id}
          showArea={showArea}
          areaType={areaType}
        />
      ))}
      {childData}
    </CartesianChart>
  );
};
