import { cssVar } from '@ledgerhq/lumen-design-core';

import { useCartesianChartContext } from '../../CartesianChart/context';
import { useShimmerAnimation } from '../../CartesianChart/hooks/useShimmerAnimation';
import { useRevealClip } from '../../CartesianChart/RevealClip';

import type { LineChartEmptyStateProps } from './types';
import { buildPlaceholderTransform, PLACEHOLDER_LINE_PATH } from './utils';

const GRID_LINE_RATIOS = [0.3, 0.5, 0.7];

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
  const clipPath = useRevealClip();

  if (drawingArea.width <= 0 || drawingArea.height <= 0) {
    return null;
  }

  return (
    <>
      {loading && <style>{keyframe}</style>}
      <g data-testid='chart-empty-state'>
        <g data-testid='chart-empty-state-grid'>
          {GRID_LINE_RATIOS.map((ratio) => {
            const y = drawingArea.y + drawingArea.height * ratio;

            return (
              <line
                key={ratio}
                x1={drawingArea.x}
                y1={y}
                x2={drawingArea.x + drawingArea.width}
                y2={y}
                style={{
                  stroke: cssVar('var(--border-muted-subtle-transparent)'),
                }}
                strokeWidth={cssVar('var(--stroke-1)')}
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
              stroke={cssVar('var(--border-muted-subtle)')}
              strokeWidth={cssVar('var(--stroke-2)')}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </g>
        </g>
      </g>
    </>
  );
}
