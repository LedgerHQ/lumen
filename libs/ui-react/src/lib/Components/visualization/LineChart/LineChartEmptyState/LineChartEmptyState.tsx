import { chartConfig } from '../../../config';
import { useCartesianChartContext } from '../../CartesianChart/context';
import { useShimmerAnimation } from '../../CartesianChart/hooks/useShimmerAnimation';
import { usePathReveal } from '../../CartesianChart/RevealAnimation';

import type { LineChartEmptyStateProps } from './types';
import { buildPlaceholderTransform } from './utils';

const { color, strokeWidth, emptyState } = chartConfig;

/**
 * SVG placeholder line shown when a LineChart is loading with no data yet (with
 * a shimmer) or has no data to display (static). Uses a fixed line shape scaled
 * into the chart's reserved drawing area, plus static horizontal grid lines, so
 * axes are not needed.
 */
export function LineChartEmptyState({
  loading = false,
}: Readonly<LineChartEmptyStateProps>) {
  const { drawingArea } = useCartesianChartContext();
  const { animationStyle, keyframe } = useShimmerAnimation();
  const clipPath = usePathReveal();

  if (drawingArea.width <= 0 || drawingArea.height <= 0) {
    return null;
  }

  return (
    <>
      {loading && <style>{keyframe}</style>}
      <g data-testid='chart-empty-state'>
        <g data-testid='chart-empty-state-grid'>
          {emptyState.gridLineRatios.map((ratio) => {
            const y = drawingArea.y + drawingArea.height * ratio;

            return (
              <line
                key={ratio}
                x1={drawingArea.x}
                y1={y}
                x2={drawingArea.x + drawingArea.width}
                y2={y}
                style={{
                  stroke: color.gridLine,
                }}
                strokeWidth={strokeWidth.hairline}
              />
            );
          })}
        </g>
        <g clipPath={clipPath}>
          <g style={loading ? { animation: animationStyle } : undefined}>
            <path
              data-testid='chart-empty-state-line'
              d={emptyState.placeholderLinePath}
              transform={buildPlaceholderTransform(drawingArea)}
              vectorEffect='non-scaling-stroke'
              fill='none'
              stroke={color.mutedLine}
              strokeWidth={strokeWidth.line}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </g>
        </g>
      </g>
    </>
  );
}
