import Animated from 'react-native-reanimated';
import { G, Line as SvgLine, Path } from 'react-native-svg';

import { chartConfig, useChartTokens } from '../../../config';
import { useCartesianChartContext } from '../../CartesianChart/context';
import { useShimmerAnimation } from '../../CartesianChart/hooks/useShimmerAnimation';
import { usePathReveal } from '../../CartesianChart/RevealAnimation';

import type { LineChartEmptyStateProps } from './types';
import { buildPlaceholderTransform } from './utils';

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
  const tokens = useChartTokens();
  const { animatedProps } = useShimmerAnimation(loading);
  const clipPath = usePathReveal();

  if (drawingArea.width <= 0 || drawingArea.height <= 0) {
    return null;
  }

  return (
    <G testID='chart-empty-state'>
      <G testID='chart-empty-state-grid'>
        {chartConfig.emptyState.gridLineRatios.map((ratio) => {
          const y = drawingArea.y + drawingArea.height * ratio;

          return (
            <SvgLine
              key={ratio}
              x1={drawingArea.x}
              y1={y}
              x2={drawingArea.x + drawingArea.width}
              y2={y}
              stroke={tokens.color.gridLine}
              strokeWidth={tokens.stroke.hairline}
            />
          );
        })}
      </G>
      <G clipPath={clipPath}>
        <AnimatedG animatedProps={animatedProps}>
          <Path
            testID='chart-empty-state-line'
            d={chartConfig.emptyState.placeholderLinePath}
            transform={buildPlaceholderTransform(drawingArea)}
            vectorEffect='non-scaling-stroke'
            fill='none'
            stroke={tokens.color.stroke}
            strokeWidth={tokens.stroke.line}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </AnimatedG>
      </G>
    </G>
  );
}
