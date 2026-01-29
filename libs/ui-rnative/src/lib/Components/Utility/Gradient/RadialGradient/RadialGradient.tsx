import { memo, useId, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, {
  Defs,
  RadialGradient as SvgRadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../../../../../styles';
import { Box } from '../../Box';
import { processGradientStops } from '../utils/resolveGradientColor';
import type { RadialGradientProps } from './types';

const DEFAULT_CENTER = { x: 0.5, y: 0.5 };

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});

/**
 * RadialGradient - A container component that renders a radial gradient background.
 *
 * Uses react-native-svg to render gradients that work consistently across platforms.
 * Extends Box, so it supports all lx style props for layout and sizing.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/utility-radialgradient--docs Storybook}
 *
 * @example
 * ```tsx
 * import { RadialGradient } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Basic usage (center to edge)
 * <RadialGradient
 *   lx={{ height: 's200', borderRadius: 'lg' }}
 *   stops={[
 *     { color: '#845EC2', offset: 0 },
 *     { color: '#FF6F91', offset: 1 },
 *   ]}
 * />
 * ```
 */
export const RadialGradient = memo(
  ({
    center = DEFAULT_CENTER,
    stops,
    children,
    lx = {},
    ref,
    ...props
  }: RadialGradientProps) => {
    const gradientId = useId();
    const { theme } = useTheme();

    const processedStops = useMemo(() => {
      return processGradientStops(stops, theme.colors.bg);
    }, [stops, theme.colors.bg]);

    const centerCoordinates = useMemo(() => {
      return {
        cx: `${center.x * 100}%`,
        cy: `${center.y * 100}%`,
      };
    }, [center]);

    return (
      <Box ref={ref} lx={{ overflow: 'hidden', ...lx }} {...props}>
        <Svg style={styles.gradient} preserveAspectRatio='none'>
          <Defs>
            <SvgRadialGradient
              id={gradientId}
              cx={centerCoordinates.cx}
              cy={centerCoordinates.cy}
              rx='50%'
              ry='50%'
              fx={centerCoordinates.cx}
              fy={centerCoordinates.cy}
            >
              {processedStops.map((stop, index) => (
                <Stop
                  key={index}
                  offset={`${stop.offset * 100}%`}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity}
                />
              ))}
            </SvgRadialGradient>
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

RadialGradient.displayName = 'RadialGradient';
