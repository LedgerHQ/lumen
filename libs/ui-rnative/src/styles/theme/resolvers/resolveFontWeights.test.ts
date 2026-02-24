import { describe, it, expect, afterEach, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { RuntimeConstants } from '../../../lib/utils';
import { createStylesheetTheme } from '../createStylesheetTheme';
import { FONT_WEIGHT_SUFFIX_MAP } from './resolveFontWeights';

describe('resolveTypographies', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not modify fontFamily on android', () => {
    jest.spyOn(RuntimeConstants, 'isAndroid', 'get').mockReturnValue(true);
    const theme = ledgerLiveThemes.dark;

    const result = createStylesheetTheme(theme);

    const typographyTokens = theme.typographies.xs ?? theme.typographies.sm;
    const firstKey = Object.keys(
      typographyTokens.heading,
    )[0] as keyof typeof typographyTokens.heading;
    expect(result.typographies[firstKey].fontFamily).toBe(
      typographyTokens.heading[firstKey].fontFamily,
    );
  });

  it('should append weight suffix to fontFamily on non-android', () => {
    jest.spyOn(RuntimeConstants, 'isAndroid', 'get').mockReturnValue(false);
    const theme = ledgerLiveThemes.dark;

    const result = createStylesheetTheme(theme);

    Object.values(result.typographies).forEach((typography) => {
      const { fontFamily, fontWeight } = typography as {
        fontFamily: string;
        fontWeight: string;
      };

      const expectedSuffix =
        FONT_WEIGHT_SUFFIX_MAP[
          fontWeight as keyof typeof FONT_WEIGHT_SUFFIX_MAP
        ] ?? '';
      expect(fontFamily).toContain(expectedSuffix);
    });
  });

  it('should not modify other typography properties on non-android', () => {
    jest.spyOn(RuntimeConstants, 'isAndroid', 'get').mockReturnValue(false);
    const theme = ledgerLiveThemes.dark;

    const result = createStylesheetTheme(theme);
    const typographyTokens = theme.typographies.xs ?? theme.typographies.sm;
    const allTokens = {
      ...typographyTokens.heading,
      ...typographyTokens.body,
    };

    Object.entries(result.typographies).forEach(([key, resolved]) => {
      const original = allTokens[key as keyof typeof allTokens];
      const { fontFamily: _f, ...resolvedRest } = resolved as Record<
        string,
        unknown
      >;
      const { fontFamily: _o, ...originalRest } = original as Record<
        string,
        unknown
      >;
      expect(resolvedRest).toEqual(originalRest);
    });
  });
});
