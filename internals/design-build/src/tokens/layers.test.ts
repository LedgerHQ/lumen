import { createTokenModel, loadTokenSources } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { breakpointLayers, layerTokens, themeLayers } from './layers.js';

describe('themeLayers', () => {
  it('builds every brand × theme from the committed sources', () => {
    const layers = themeLayers(createTokenModel());

    expect(layers.map(({ brand, theme }) => `${brand}/${theme}`)).toEqual([
      'enterprise/dark',
      'enterprise/light',
      'ledger-live/dark',
      'ledger-live/light',
      'websites/dark',
      'websites/light',
    ]);
  });

  it('fails when Figma renames a theme, instead of building half of it', () => {
    const model = createTokenModel(
      loadTokenSources().map((source) =>
        source.collection === 'theme' && source.mode === 'light'
          ? { ...source, mode: 'day', file: 'figma/2.theme.day.tokens.json' }
          : source,
      ),
    );

    expect(() => themeLayers(model)).toThrow(
      'The theme modes must be dark and light, Figma has dark, day',
    );
  });
});

describe('layerTokens', () => {
  it('keeps the tokens a layer defines, not the primitives it references', () => {
    const model = createTokenModel();
    const [base] = breakpointLayers(model, ['xs']);

    const collections = new Set(
      layerTokens(model, base).map(({ source }) => source.collection),
    );
    expect([...collections]).toEqual(['breakpoint']);
  });
});
