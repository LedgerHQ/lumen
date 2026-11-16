import { createTokenModel, type Token } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { groupOf } from './groups.js';

const token = (collection: string, path: string): Token =>
  ({ path: path.split('.'), source: { collection } }) as unknown as Token;

describe('groupOf', () => {
  it('picks the longest matching prefix', () => {
    expect(groupOf(token('primitives', 'color.light.grey.100')).key).toBe(
      'color.light',
    );
    expect(groupOf(token('theme', 'color.crypto.bitcoin')).key).toBe(
      'color.crypto',
    );
  });

  it('prefers a row narrowed to the token collection', () => {
    expect(groupOf(token('brand', 'border-width.active')).key).toBe(
      'brand:border-width',
    );
    expect(groupOf(token('border-width', 'border-width.1')).key).toBe(
      'border-width',
    );
  });

  it('matches whole path segments only', () => {
    expect(groupOf(token('primitives', 'font-family.font')).key).toBe(
      'font-family',
    );
  });

  it('fails on a token no row covers', () => {
    expect(() => groupOf(token('primitives', 'opacity.50'))).toThrow(
      /No group for primitives:opacity\.50/,
    );
  });

  it('covers every token of the sources', () => {
    const model = createTokenModel();
    const built = model.tokens(
      model.sources.filter(
        ({ collection }) => !['icon', 'spot'].includes(collection),
      ),
    );
    expect(() => built.forEach(groupOf)).not.toThrow();
  });
});
