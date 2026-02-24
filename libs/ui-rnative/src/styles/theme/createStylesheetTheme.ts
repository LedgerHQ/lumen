import { Platform } from 'react-native';
import {
  LumenStyleSheetTheme,
  LumenTheme,
  LumenTypographyTokens,
} from '../types';
import { AddEntriesNegative } from '../types/utility.types';

export const resolveNegativeSpacing = <
  Input extends LumenTheme['spacings'],
  Output = AddEntriesNegative<Input>,
>(
  spacings: Input = {} as Input,
): Output => {
  return Object.fromEntries(
    Object.entries(spacings).map(([key, value]) => [`-${key}`, value * -1]),
  ) as Output;
};

const FONT_WEIGHT_RN_SYNTAX_MAP = {
  '400': '',
  '500': '-Medium',
  '600': '-SemiBold',
  '700': '-Bold',
};

const resolveTypographies = (typographies: LumenTypographyTokens) => {
  if (Platform.OS !== 'android') {
    return typographies;
  }

  return Object.fromEntries(
    Object.entries(typographies).map(([key, value]) => {
      const reactNativeFontWeight =
        FONT_WEIGHT_RN_SYNTAX_MAP[
          value.fontWeight as keyof typeof FONT_WEIGHT_RN_SYNTAX_MAP
        ];

      return [
        key,
        { ...value, fontFamily: `${value.fontFamily}${reactNativeFontWeight}` },
      ];
    }),
  ) as LumenTypographyTokens;
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
      ...resolveNegativeSpacing(theme?.spacings),
    },
    typographies: resolveTypographies({
      ...theme.typographies.xs.heading,
      ...theme.typographies.xs.body,
    }),
  };
};
