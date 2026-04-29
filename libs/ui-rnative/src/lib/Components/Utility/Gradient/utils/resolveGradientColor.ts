import type { LumenStyleSheetTheme } from '../../../../../styles';
import type { BackgroundColorToken, GradientStop } from '../gradient.types';

type BackgroundColors = LumenStyleSheetTheme['colors']['bg'];
const DEFAULT_OPACITY = 1;
const DEFAULT_OFFSET = 0;

/**
 * Resolves a gradient stop color to a concrete color value.
 * If the color is a design token, it's resolved from the theme.
 * If it's a raw color string, it's returned as-is.
 */
export const resolveGradientColor = (
  color: string,
  bgColors: BackgroundColors,
): string => {
  const isBackgroundToken = color in bgColors;
  if (isBackgroundToken) {
    return bgColors[color as BackgroundColorToken];
  }
  return color;
};

/**
 * Processes gradient stops by:
 * 1. Resolving color tokens to actual values
 * 2. Auto-spreading offsets if not provided
 */
export const processGradientStops = (
  stops: GradientStop[],
  bgColors: BackgroundColors,
): {
  color: string;
  offset: number;
  opacity: number;
}[] => {
  const stopCount = stops.length;

  return stops.map((stop, index) => {
    const resolvedColor = resolveGradientColor(stop.color, bgColors);

    // Auto-spread offsets if not provided
    // For n stops: 0, 1/(n-1), 2/(n-1), ..., 1
    const offset =
      stop.offset !== undefined
        ? stop.offset
        : stopCount === 1
          ? DEFAULT_OFFSET
          : index / (stopCount - 1);

    const opacity = stop.opacity !== undefined ? stop.opacity : DEFAULT_OPACITY;

    return {
      color: resolvedColor,
      offset,
      opacity,
    };
  });
};
