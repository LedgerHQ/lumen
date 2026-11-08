import type plugin from 'tailwindcss/plugin.js';
import { describe, it, expect, vi } from 'vitest';

import { createScreensPlugin } from './createScreensPlugin';

type PluginAPI = Parameters<ReturnType<typeof plugin>['handler']>[0];

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

  it('does not register any utility or base style', () => {
    const api = { addBase: vi.fn(), addUtilities: vi.fn() };

    createScreensPlugin().handler(api as unknown as PluginAPI);

    expect(api.addBase).not.toHaveBeenCalled();
    expect(api.addUtilities).not.toHaveBeenCalled();
  });
});
