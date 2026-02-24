import { describe, it, expect, afterEach } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { Platform } from 'react-native';
import {
  resolveNegativeSpacing,
  createStylesheetTheme,
} from './createStylesheetTheme';

describe('createStylesheetTheme', () => {
  describe('resolveNegativeSpacing', () => {
    it('should create negative entries for each spacing', () => {
      const spacings = {
        s4: 4,
        s8: 8,
        s16: 16,
      } as typeof ledgerLiveThemes.dark.spacings;

      const result = resolveNegativeSpacing(spacings);

      expect(result['-s4']).toBe(-4);
      expect(result['-s8']).toBe(-8);
      expect(result['-s16']).toBe(-16);
    });
  });

  describe('createStylesheetTheme', () => {
    it('should include both positive and negative spacings', () => {
      const theme = ledgerLiveThemes.dark;

      const result = createStylesheetTheme(theme);

      expect(result.spacings.s16).toBe(16);
      expect(result.spacings['-s16']).toBe(-16);
    });

    it('should flatten heading/body typography tokens', () => {
      const theme = ledgerLiveThemes.dark;

      const result = createStylesheetTheme(theme);

      const typographyTokens = theme.typographies.xs ?? theme.typographies.sm;
      expect(result.typographies).toEqual({
        ...typographyTokens.heading,
        ...typographyTokens.body,
      });
    });
  });

  describe('resolveTypographies (android)', () => {
    const originalOS = Platform.OS;

    afterEach(() => {
      Platform.OS = originalOS;
    });

    it('should not modify fontFamily on iOS', () => {
      Platform.OS = 'ios';
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

    it('should append weight suffix to fontFamily on android', () => {
      Platform.OS = 'android';
      const theme = ledgerLiveThemes.dark;

      const result = createStylesheetTheme(theme);

      Object.values(result.typographies).forEach((typography) => {
        const { fontFamily, fontWeight } = typography as {
          fontFamily: string;
          fontWeight: string;
        };
        const suffixMap: Record<string, string> = {
          '400': '',
          '500': '-Medium',
          '600': '-SemiBold',
          '700': '-Bold',
        };
        const expectedSuffix = suffixMap[fontWeight] ?? '';
        expect(fontFamily).toContain(expectedSuffix);
      });
    });

    it('should not modify other typography properties on android', () => {
      Platform.OS = 'android';
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
});
