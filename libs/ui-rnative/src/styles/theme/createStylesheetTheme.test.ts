import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import {
  getNegativeSpacings,
  createStylesheetTheme,
} from './createStylesheetTheme';

describe('createStylesheetTheme', () => {
  describe('getNegativeSpacings', () => {
    it('should create negative entries for each spacing', () => {
      const spacings = {
        s4: 4,
        s8: 8,
        s16: 16,
      } as typeof ledgerLiveThemes.dark.spacings;

      const result = getNegativeSpacings(spacings);

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
});
