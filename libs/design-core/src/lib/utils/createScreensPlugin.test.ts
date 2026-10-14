import { describe, it, expect } from 'vitest';

import { createScreensPlugin } from './createScreensPlugin';

describe('createScreensPlugin', () => {
  it('derives the Tailwind screens from the breakpoint primitives', () => {
    expect(createScreensPlugin().config?.theme?.screens).toEqual({
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    });
  });
});
