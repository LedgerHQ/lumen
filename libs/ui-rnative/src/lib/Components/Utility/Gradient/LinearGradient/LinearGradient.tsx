import { memo, useId, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../../../../../styles';
import { Box } from '../../Box';
import { processGradientStops } from '../utils/resolveGradientColor';
import type {
  GradientCoordinates,
  LinearGradientDirection,
  LinearGradientProps,
} from './types';

const DIRECTION_MAP: Record<LinearGradientDirection, GradientCoordinates> = {
  'to-bottom': { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
  'to-top': { x1: '0%', y1: '100%', x2: '0%', y2: '0%' },
  'to-right': { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
  'to-left': { x1: '100%', y1: '0%', x2: '0%', y2: '0%' },
  'to-bottomright': { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
  'to-bottomleft': { x1: '100%', y1: '0%', x2: '0%', y2: '100%' },
  'to-topright': { x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
  'to-topleft': { x1: '100%', y1: '100%', x2: '0%', y2: '0%' },
};

const angleToCoordinates = (angle: number): GradientCoordinates => {
  const normalizedAngle = ((angle % 360) + 360) % 360;

  // Convert to radians (CSS: 0° is up, going clockwise)
  // SVG: we need to map this to x1,y1 -> x2,y2
  const radians = ((normalizedAngle - 90) * Math.PI) / 180;
  const x2 = Math.cos(radians) * 0.5 + 0.5;
  const y2 = Math.sin(radians) * 0.5 + 0.5;
  const x1 = 1 - x2;
  const y1 = 1 - y2;

  return {
    x1: `${Math.round(x1 * 100)}%`,
    y1: `${Math.round(y1 * 100)}%`,
    x2: `${Math.round(x2 * 100)}%`,
    y2: `${Math.round(y2 * 100)}%`,
  };
};

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});

/**
 * LinearGradient - A container component that renders a linear gradient background.
 *
 * Uses react-native-svg to render gradients that work consistently across platforms.
 * Extends Box, so it supports all lx style props for layout and sizing.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/utility-lineargradient--docs Storybook}
 *
 * @example
 * ```tsx
 * import { LinearGradient } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Basic usage with direction preset
 * <LinearGradient
 *   direction="to-bottomright"
 *   stops={[
 *     { color: '#FF6B6B', offset: 0 },
 *     { color: '#6BCB77', offset: 1 },
 *   ]}
 *   lx={{ height: 's200', borderRadius: 'lg' }}
 * />
 */
export const LinearGradient = memo(
  ({
    direction = 'to-bottom',
    stops,
    children,
    lx = {},
    ref,
    ...props
  }: LinearGradientProps) => {
    const gradientId = useId();
    const { theme } = useTheme();

    const coordinates = useMemo(() => {
      const isCustomAngle = typeof direction === 'number';
      return isCustomAngle
        ? angleToCoordinates(direction)
        : DIRECTION_MAP[direction];
    }, [direction]);

    const processedStops = useMemo(
      () => processGradientStops(stops, theme.colors.bg),
      [stops, theme.colors.bg],
    );

    return (
      <Box ref={ref} lx={{ overflow: 'hidden', ...lx }} {...props}>
        <Svg style={styles.gradient} preserveAspectRatio='none'>
          <Defs>
            <SvgLinearGradient id={gradientId} {...coordinates}>
              {processedStops.map((stop, index) => (
                <Stop
                  key={index}
                  offset={`${stop.offset * 100}%`}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity}
                />
              ))}
            </SvgLinearGradient>
          </Defs>
          <Rect
            x='0'
            y='0'
            width='100%'
            height='100%'
            fill={`url(#${gradientId})`}
          />
        </Svg>
        {children}
      </Box>
    );
  },
);

LinearGradient.displayName = 'LinearGradient';
