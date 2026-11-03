import { describe, expect, it } from 'vitest';
import { enterpriseLightColorTokens } from './enterprise/theme.light.js';
import { ledgerLiveDarkColorTokens } from './ledger-live/theme.dark.js';
import { primitiveColorTokens } from './primitives/primitive.colors.js';
import { primitiveTypographyTokens } from './primitives/primitive.typographies.js';
import { primitiveMotionTokens } from './primitives/primitives.motion.js';
import { primitiveLayoutTokens } from './primitives/primitives.others.js';
import { primitiveShadowTokens } from './primitives/primitives.shadows.js';
import { typographyTokens } from './typographies/index.js';
import { enterpriseThemes, ledgerLiveThemes, websitesThemes } from './index.js';

describe('JS themes', () => {
  describe.each([
    ['ledgerLiveThemes', ledgerLiveThemes],
    ['enterpriseThemes', enterpriseThemes],
    ['websitesThemes', websitesThemes],
  ])('%s', (_, themes) => {
    it.each(['dark', 'light'] as const)(
      'should build the %s theme from the shared core tokens',
      (scheme) => {
        expect(themes[scheme]).toMatchObject({
          ...primitiveLayoutTokens,
          fontFamilies: primitiveTypographyTokens.fontFamily,
          shadows: primitiveShadowTokens,
          typographies: typographyTokens,
          motion: primitiveMotionTokens,
        });
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

  it('should define every shadow from the dark grey primitives', () => {
    const shadowColors = Object.values(primitiveShadowTokens).flatMap(
      (layers) => layers.map(({ color }) => color),
    );

    expect(new Set(shadowColors)).toEqual(
      new Set([
        primitiveColorTokens.dark.grey['050-10'],
        primitiveColorTokens.dark.grey['050-20'],
      ]),
    );
  });
});
