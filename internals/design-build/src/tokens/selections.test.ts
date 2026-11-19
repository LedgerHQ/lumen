import {
  createTokenModel,
  loadTokenSources,
  type SourceFile,
} from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { assertEveryCollectionBuilt } from './selections.js';

const densityMode = (mode: string, gap: number): SourceFile => ({
  file: `figma/8.density.${mode}.tokens.json`,
  origin: 'figma',
  order: 8,
  collection: 'density',
  mode,
  tokens: { gap: { $type: 'dimension', $value: { value: gap, unit: 'px' } } },
});

describe('assertEveryCollectionBuilt', () => {
  it('accepts the committed sources', () => {
    expect(() => assertEveryCollectionBuilt(createTokenModel())).not.toThrow();
  });

  it('fails on a new multi-mode collection that no output builds', () => {
    const model = createTokenModel([
      ...loadTokenSources(),
      densityMode('compact', 4),
      densityMode('comfortable', 8),
    ]);

    expect(() => assertEveryCollectionBuilt(model)).toThrow(
      'No output builds the collection(s) density',
    );
  });
});
