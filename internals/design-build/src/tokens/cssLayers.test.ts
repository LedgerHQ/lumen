import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { cssDeclarations, cssLayers, cssValue } from './cssLayers.js';
import { orderedBreakpoints } from './selections.js';

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

describe('cssLayers', () => {
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

  it('has a layer per brand × theme and per breakpoint, base first', () => {
    const model = createTokenModel();
    const layers = cssLayers(model, orderedBreakpoints(model));

    expect(
      layers.themes.map(({ brand, theme }) => `${brand}/${theme}`),
    ).toEqual([
      'enterprise/dark',
      'enterprise/light',
      'ledger-live/dark',
      'ledger-live/light',
      'websites/dark',
      'websites/light',
    ]);
    expect(layers.breakpoints.map(({ breakpoint }) => breakpoint)).toEqual([
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
    ]);
  });

  it('keeps references as var()', () => {
    const model = createTokenModel();
    const dark = cssLayers(model, orderedBreakpoints(model)).themes.find(
      ({ brand, theme }) => brand === 'enterprise' && theme === 'dark',
    );

    expect(dark?.declarations['--color-background-canvas']).toBe(
      'var(--color-dark-grey-050)',
    );
  });
});
