import { describe, expect, it } from '@jest/globals';

import { buildPlaceholderTransform, PLACEHOLDER_LINE_PATH } from './utils';

describe('PLACEHOLDER_LINE_PATH', () => {
  it('is an svg path starting with a move command', () => {
    expect(PLACEHOLDER_LINE_PATH).toMatch(/^M/);
  });
});

describe('buildPlaceholderTransform', () => {
  it('translates to the drawing area origin and scales the viewBox to fit', () => {
    const transform = buildPlaceholderTransform({
      x: 10,
      y: 20,
      width: 364,
      height: 104,
    });

    expect(transform).toBe('translate(10, 20) scale(0.5, 0.5)');
  });
});
