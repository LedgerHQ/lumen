import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { cssTarget } from './css.js';
import { cssDeclarations, cssValue } from './cssLayers.js';

describe('cssValue', () => {
  it('writes dimensions with their unit and everything else as a string', () => {
    expect(cssValue('dimension', { value: 0, unit: 'px' })).toBe('0px');
    expect(cssValue('fontWeight', 600)).toBe('600');
    expect(
      cssValue('color', {
        colorSpace: 'srgb',
        components: [1, 1, 1],
        alpha: 0.102,
        hex: '#ffffff',
      }),
    ).toBe('#ffffff1a');
  });
});

describe('cssTarget', () => {
  it('emits the primitives, every brand × theme, every breakpoint and the barrel', async () => {
    const files = await cssTarget('out').emit(createTokenModel());

    expect(files.map(({ path }) => path).sort()).toEqual([
      'enterprise/theme.dark-css.ts',
      'enterprise/theme.light-css.ts',
      'index.ts',
      'ledger-live/theme.dark-css.ts',
      'ledger-live/theme.light-css.ts',
      'primitives-css.ts',
      'typographies/typography.2xl-css.ts',
      'typographies/typography.lg-css.ts',
      'typographies/typography.md-css.ts',
      'typographies/typography.sm-css.ts',
      'typographies/typography.xl-css.ts',
      'typographies/typography.xs-css.ts',
      'websites/theme.dark-css.ts',
      'websites/theme.light-css.ts',
    ]);
  });

  it('fails when two tokens build to the same CSS name', () => {
    const model = createTokenModel([
      {
        file: 'figma/1.primitives.value.tokens.json',
        origin: 'figma',
        order: 1,
        collection: 'primitives',
        mode: 'value',
        tokens: {
          'gap large': { $type: 'dimension', $value: { value: 1, unit: 'px' } },
          'gap-large': { $type: 'dimension', $value: { value: 2, unit: 'px' } },
        },
      },
    ]);

    expect(() =>
      cssDeclarations(model, model.select(['primitives']), ['primitives']),
    ).toThrow('gap large and gap-large both build to --gap-large');
  });

  it('keeps references as var() and scopes dark tokens to .dark', async () => {
    const files = await cssTarget('out').emit(createTokenModel());
    const dark = files.find(
      ({ path }) => path === 'enterprise/theme.dark-css.ts',
    );

    expect(dark?.contents).toContain('".dark": {');
    expect(dark?.contents).toContain(
      '"--color-background-canvas": "var(--color-dark-grey-050)"',
    );
  });
});
