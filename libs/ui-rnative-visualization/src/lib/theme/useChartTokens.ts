import { useTheme } from '@ledgerhq/lumen-ui-rnative';

type Theme = ReturnType<typeof useTheme>['theme'];

/**
 * Chart tokens resolved from the active theme, aliased by concept (not raw
 * token) so two aliases can diverge later even if equal today. Mirrors the
 * groups the web config wraps in `cssVar`.
 */
const resolve = (t: Theme) =>
  ({
    color: {
      stroke: t.colors.border.muted,
      gridLine: t.colors.border.mutedSubtleTransparent,
      mutedLine: t.colors.border.mutedSubtle,
      markOutline: t.colors.bg.canvas,
      markFill: t.colors.bg.mutedStrong,
      surface: t.colors.bg.muted,
      text: t.colors.text.base,
      textMuted: t.colors.text.muted,
      scrubberLine: t.colors.border.base,
      scrubberOverlay: t.colors.bg.base,
    },
    stroke: {
      hairline: t.stroke.s1,
      line: t.stroke.s2,
    },
    font: {
      family: t.fontFamilies.sans,
      labelSize: t.typographies.body4.fontSize,
      labelWeight: t.typographies.body4.fontWeight,
      bodySize: t.typographies.body3.fontSize,
    },
    radius: {
      sm: t.borderRadius.sm,
    },
  }) as const;

export type ChartTokens = ReturnType<typeof resolve>;

/**
 * The theme reference is stable per color scheme (memoized by the provider), so
 * caching by theme yields a single resolved object per theme app-wide with a
 * stable identity -- keeping primitive props stable for memoized SVG children.
 */
const cache = new WeakMap<Theme, ChartTokens>();

export const useChartTokens = (): ChartTokens => {
  const { theme } = useTheme();
  let tokens = cache.get(theme);
  if (!tokens) {
    tokens = resolve(theme);
    cache.set(theme, tokens);
  }
  return tokens;
};
