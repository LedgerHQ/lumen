import { describe, expect, it } from 'vitest';
import { createIconUtilities } from './createIconUtilities';

const themeValues: Record<string, Record<string, string>> = {
  iconWidth: { 24: 'var(--icon-width-24)' },
  iconHeight: { 24: 'var(--icon-height-24)' },
  iconStrokeWidth: {
    12: 'var(--icon-border-width-12)',
    16: 'var(--icon-border-width-16)',
    24: 'var(--icon-border-width-24)',
    56: 'var(--icon-border-width-56)',
  },
};

const theme = ((key: string) => themeValues[key]) as Parameters<
  typeof createIconUtilities
>[0];

describe('createIconUtilities', () => {
  it.each([
    { size: 12, renderScale: 0.75 },
    { size: 16, renderScale: 1 },
    { size: 24, renderScale: 1.5 },
    { size: 56, renderScale: 3.5 },
  ])(
    'should divide the size $size stroke token by its viewBox render scale',
    ({ size, renderScale }) => {
      const utilities = createIconUtilities(theme);

      expect(utilities[`.icon-stroke-${size}`]).toEqual({
        strokeWidth: `calc(var(--icon-border-width-${size}) / ${renderScale})`,
      });
    },
  );
});
