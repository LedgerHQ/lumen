import { RuntimeConstants } from '../../../lib/utils';
import { LumenTypographyTokens } from '../../types';

export const FONT_WEIGHT_SUFFIX_MAP = {
  '100': 'Thin',
  '200': 'ExtraLight',
  '300': 'Light',
  '400': '',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black',
};

export const resolveFontWeights = (typographies: LumenTypographyTokens) => {
  if (RuntimeConstants.isAndroid || RuntimeConstants.isBrowser) {
    return typographies;
  }

  return Object.fromEntries(
    Object.entries(typographies).map(([key, value]) => {
      const reactNativeFontWeight =
        FONT_WEIGHT_SUFFIX_MAP[
          value.fontWeight as keyof typeof FONT_WEIGHT_SUFFIX_MAP
        ];
      const concatenatedFontFamily = reactNativeFontWeight
        ? [value.fontFamily, reactNativeFontWeight].join('-')
        : value.fontFamily;

      return [
        key,
        {
          ...value,
          fontFamily: concatenatedFontFamily,
        },
      ];
    }),
  ) as LumenTypographyTokens;
};
