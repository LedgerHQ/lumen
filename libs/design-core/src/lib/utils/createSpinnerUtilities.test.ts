import { describe, expect, it } from 'vitest';
import { createSpinnerUtilities } from './createSpinnerUtilities.js';

const themeValues: Record<string, Record<string, string>> = {
  spinnerStrokeWidth: {
    12: 'var(--spinner-border-width-12)',
    16: 'var(--spinner-border-width-16)',
    24: 'var(--spinner-border-width-24)',
    56: 'var(--spinner-border-width-56)',
  },
};

const theme = ((key: string) => themeValues[key]) as Parameters<
  typeof createSpinnerUtilities
>[0];

describe('createSpinnerUtilities', () => {
  it.each([
    { size: 12, renderScale: 0.75 },
    { size: 16, renderScale: 1 },
    { size: 24, renderScale: 1.5 },
    { size: 56, renderScale: 3.5 },
  ])(
    'should divide the size $size stroke token by its viewBox render scale',
    ({ size, renderScale }) => {
      const utilities = createSpinnerUtilities(theme);

      expect(utilities[`.spinner-stroke-${size}`]).toEqual({
        strokeWidth: `calc(var(--spinner-border-width-${size}) / ${renderScale})`,
      });
    },
  );
});
