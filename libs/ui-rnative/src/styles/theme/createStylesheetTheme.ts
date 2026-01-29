import { LumenStyleSheetTheme, LumenTheme } from '../types';
import { AddEntriesNegative } from '../types/utility.types';

/**
 *
 */
export const getNegativeSpacings = <
  Input extends LumenTheme['spacings'],
  Output = AddEntriesNegative<Input>,
>(
  spacings: Input = {} as Input,
): Output => {
  return Object.fromEntries(
    Object.entries(spacings).map(([key, value]) => [`-${key}`, value * -1]),
  ) as Output;
};

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
    spacings: {
      ...theme?.spacings,
      ...getNegativeSpacings(theme?.spacings),
    },
    typographies: {
      heading0: theme.typographies.xs.heading0,
      heading0SemiBold: theme.typographies.xs.heading0SemiBold,
      heading1: theme.typographies.xs.heading1,
      heading1SemiBold: theme.typographies.xs.heading1SemiBold,
      heading2: theme.typographies.xs.heading2,
      heading2SemiBold: theme.typographies.xs.heading2SemiBold,
      heading3: theme.typographies.xs.heading3,
      heading3SemiBold: theme.typographies.xs.heading3SemiBold,
      heading4: theme.typographies.xs.heading4,
      heading4SemiBold: theme.typographies.xs.heading4SemiBold,
      heading5: theme.typographies.xs.heading5,
      heading5SemiBold: theme.typographies.xs.heading5SemiBold,
      body1: theme.typographies.xs.body1,
      body1SemiBold: theme.typographies.xs.body1SemiBold,
      body2: theme.typographies.xs.body2,
      body2SemiBold: theme.typographies.xs.body2SemiBold,
      body3: theme.typographies.xs.body3,
      body3SemiBold: theme.typographies.xs.body3SemiBold,
      body4: theme.typographies.xs.body4,
      body4SemiBold: theme.typographies.xs.body4SemiBold,
    },
  };
};
