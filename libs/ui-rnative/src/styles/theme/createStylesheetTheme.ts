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
      ...theme.typographies.xs.heading,
      ...theme.typographies.xs.body,
    },
  };
};
