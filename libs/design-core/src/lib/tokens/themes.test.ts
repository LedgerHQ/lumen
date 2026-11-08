import { describe, expect, it } from 'vitest';
import {
  enterpriseLightColorTokens,
  enterpriseThemes,
  ledgerLiveDarkColorTokens,
  ledgerLiveThemes,
  websitesThemes,
} from '../generated/js/index.js';
import {
  coreTokens,
  primitiveColorTokens,
} from '../generated/js/primitives.js';

describe('JS themes', () => {
  describe.each([
    ['ledgerLiveThemes', ledgerLiveThemes],
    ['enterpriseThemes', enterpriseThemes],
    ['websitesThemes', websitesThemes],
  ])('%s', (_, themes) => {
    it.each(['dark', 'light'] as const)(
      'should build the %s theme from the shared core tokens',
      (scheme) => {
        expect(themes[scheme]).toMatchObject(coreTokens);
      },
    );

    it('should give each color scheme its own color tokens', () => {
      expect(themes.dark.colors).toEqual(
        expect.objectContaining({
          bg: expect.any(Object),
          text: expect.any(Object),
          border: expect.any(Object),
        }),
      );
      expect(themes.dark.colors).not.toBe(themes.light.colors);
    });
  });

  it('should wire each brand to its own color tokens', () => {
    expect(ledgerLiveThemes.dark.colors).toBe(ledgerLiveDarkColorTokens);
    expect(enterpriseThemes.light.colors).toBe(enterpriseLightColorTokens);
  });

  it('should fade every crypto gradient to its transparent twin', () => {
    const { bitcoin } = enterpriseLightColorTokens.gradients.crypto;

    expect(bitcoin).toEqual([
      { color: primitiveColorTokens.light.crypto.bitcoin },
      { color: primitiveColorTokens.light.cryptoTransparent.bitcoin },
    ]);
  });
});
