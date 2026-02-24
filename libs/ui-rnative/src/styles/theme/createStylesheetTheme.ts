import { LumenStyleSheetTheme, LumenTheme } from '../types';
import { resolveFontWeights } from './resolvers/resolveFontWeights';
import { resolveNegativeSpacing } from './resolvers/resolveNegativeSpacing';

/**
 * The theme object from design-core is not directly compatible with React Native's StyleSheet.
 *
 * We must transform and extend the theme so it can be easily used with
 * utilities like `useStyleSheet`, as well as components such as
 * `createStyledText` and `createStyledView`. This process augments the design system
 * theme with React Native–specific structure and shorthand.
 */
export const createStylesheetTheme = (
  theme: LumenTheme,
): LumenStyleSheetTheme => {
  return {
    ...theme,
    spacings: resolveNegativeSpacing(theme?.spacings),
    typographies: resolveFontWeights({
      ...theme.typographies.xs.heading,
      ...theme.typographies.xs.body,
    }),
  };
};
