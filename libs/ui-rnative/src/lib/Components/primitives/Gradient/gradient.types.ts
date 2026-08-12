import type { LumenStyleSheetTheme } from '../../../../styles';

/**
 * Background color token from the theme
 */
export type BackgroundColorToken = keyof LumenStyleSheetTheme['colors']['bg'];

export type GradientStop = {
  /**
   * Color value - can be a design token key (e.g., 'accent', 'error')
   * or a raw color string (e.g., '#FF6B6B', 'rgba(...)')
   */
  color: BackgroundColorToken | (string & {});
  /**
   * Position of the stop (0-1). If omitted, stops are auto-spread evenly.
   */
  offset?: number;
  /**
   * Opacity of the color (0-1).
   */
  opacity?: number;
};
