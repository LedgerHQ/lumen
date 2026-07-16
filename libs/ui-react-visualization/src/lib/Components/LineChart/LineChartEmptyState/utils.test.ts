import { describe, expect, it } from 'vitest';

import { chartConfig } from '../../../config';
import { buildPlaceholderTransform } from './utils';

describe('placeholderLinePath', () => {
  it('is an svg path starting with a move command', () => {
    expect(chartConfig.emptyState.placeholderLinePath).toMatch(/^M/);
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
