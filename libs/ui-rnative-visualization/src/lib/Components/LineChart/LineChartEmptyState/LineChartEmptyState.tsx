import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import Animated from 'react-native-reanimated';
import { G, Line as SvgLine, Path } from 'react-native-svg';

import { useCartesianChartContext } from '../../CartesianChart/context';
import { useShimmerAnimation } from '../../CartesianChart/hooks/useShimmerAnimation';
import { useRevealClip } from '../../CartesianChart/RevealClip';

import type { LineChartEmptyStateProps } from './types';
import { buildPlaceholderTransform, PLACEHOLDER_LINE_PATH } from './utils';

const GRID_LINE_RATIOS = [0.3, 0.5, 0.7];
const GRID_STROKE_WIDTH = 1;
const PLACEHOLDER_STROKE_WIDTH = 2;

const AnimatedG = Animated.createAnimatedComponent(G);

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
  const { theme } = useTheme();
  const { animatedProps } = useShimmerAnimation(loading);
  const clipPath = useRevealClip();

  if (drawingArea.width <= 0 || drawingArea.height <= 0) {
    return null;
  }

  return (
    <G testID='chart-empty-state'>
      <G testID='chart-empty-state-grid'>
        {GRID_LINE_RATIOS.map((ratio) => {
          const y = drawingArea.y + drawingArea.height * ratio;

          return (
            <SvgLine
              key={ratio}
              x1={drawingArea.x}
              y1={y}
              x2={drawingArea.x + drawingArea.width}
              y2={y}
              stroke={theme.colors.border.mutedSubtleTransparent}
              strokeWidth={GRID_STROKE_WIDTH}
            />
          );
        })}
      </G>
      <G clipPath={clipPath}>
        <AnimatedG animatedProps={animatedProps}>
          <Path
            testID='chart-empty-state-line'
            d={PLACEHOLDER_LINE_PATH}
            transform={buildPlaceholderTransform(drawingArea)}
            vectorEffect='non-scaling-stroke'
            fill='none'
            stroke={theme.colors.border.muted}
            strokeWidth={PLACEHOLDER_STROKE_WIDTH}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </AnimatedG>
      </G>
    </G>
  );
}
