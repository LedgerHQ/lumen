import { cssVar } from '@ledgerhq/lumen-design-core';

import { useCartesianChartContext } from '../../CartesianChart/context';
import { useRevealClip } from '../../CartesianChart/RevealClip';
import { useShimmerAnimation } from '../../CartesianChart/ShimmerAnimation';

import type { LineChartEmptyStateProps } from './types';
import { buildPlaceholderTransform, PLACEHOLDER_LINE_PATH } from './utils';

/**
 * SVG placeholder line shown when a LineChart is loading with no data yet (with
 * a shimmer) or has no data to display (static). Uses a fixed line shape scaled
 * into the chart's reserved drawing area, so axes are not needed.
 */
export function LineChartEmptyState({
  loading = false,
}: LineChartEmptyStateProps) {
  const { drawingArea } = useCartesianChartContext();
  const { animationStyle, keyframe } = useShimmerAnimation();
  const clipPath = useRevealClip();

  if (drawingArea.width <= 0 || drawingArea.height <= 0) {
    return null;
  }

  return (
    <g data-testid='chart-empty-state'>
      {loading && <style>{keyframe}</style>}
      <g clipPath={clipPath}>
        <g style={loading ? { animation: animationStyle } : undefined}>
          <path
            data-testid='chart-empty-state-line'
            d={PLACEHOLDER_LINE_PATH}
            transform={buildPlaceholderTransform(drawingArea)}
            vectorEffect='non-scaling-stroke'
            fill='none'
            stroke={cssVar('var(--border-muted)')}
            strokeWidth={cssVar('var(--stroke-2)')}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
      </g>
    </g>
  );
}
