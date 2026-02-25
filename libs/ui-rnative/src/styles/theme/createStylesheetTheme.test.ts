import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { RuntimeConstants } from '../../lib/utils';
import { createStylesheetTheme } from './createStylesheetTheme';

describe('createStylesheetTheme', () => {
  describe('createStylesheetTheme', () => {
    it('should include both positive and negative spacings', () => {
      const theme = ledgerLiveThemes.dark;

      const result = createStylesheetTheme(theme);

      expect(result.spacings.s16).toBe(16);
      expect(result.spacings['-s16']).toBe(-16);
    });

    it('should flatten heading/body typography tokens', () => {
      jest.spyOn(RuntimeConstants, 'isIOS', 'get').mockReturnValue(true);
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
