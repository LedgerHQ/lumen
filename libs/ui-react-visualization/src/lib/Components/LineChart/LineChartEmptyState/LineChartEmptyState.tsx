import {
  CHART_GRID_LINE_COLOR,
  CHART_HAIRLINE_STROKE_WIDTH,
  CHART_LINE_STROKE_WIDTH,
  CHART_MUTED_LINE_COLOR,
  EMPTY_STATE_GRID_LINE_RATIOS,
  PLACEHOLDER_LINE_PATH,
} from '../../../config';
import { useCartesianChartContext } from '../../CartesianChart/context';
import { useShimmerAnimation } from '../../CartesianChart/hooks/useShimmerAnimation';
import { usePathReveal } from '../../CartesianChart/RevealAnimation';

import type { LineChartEmptyStateProps } from './types';
import { buildPlaceholderTransform } from './utils';

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
          {EMPTY_STATE_GRID_LINE_RATIOS.map((ratio) => {
            const y = drawingArea.y + drawingArea.height * ratio;

            return (
              <line
                key={ratio}
                x1={drawingArea.x}
                y1={y}
                x2={drawingArea.x + drawingArea.width}
                y2={y}
                style={{
                  stroke: CHART_GRID_LINE_COLOR,
                }}
                strokeWidth={CHART_HAIRLINE_STROKE_WIDTH}
              />
            );
          })}
        </g>
        <g clipPath={clipPath}>
          <g style={loading ? { animation: animationStyle } : undefined}>
            <path
              data-testid='chart-empty-state-line'
              d={PLACEHOLDER_LINE_PATH}
              transform={buildPlaceholderTransform(drawingArea)}
              vectorEffect='non-scaling-stroke'
              fill='none'
              stroke={CHART_MUTED_LINE_COLOR}
              strokeWidth={CHART_LINE_STROKE_WIDTH}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </g>
        </g>
      </g>
    </>
  );
}
