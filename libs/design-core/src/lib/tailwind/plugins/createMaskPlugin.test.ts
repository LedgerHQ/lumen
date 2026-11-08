import type plugin from 'tailwindcss/plugin.js';
import { describe, expect, it, vi } from 'vitest';
import { createMaskPlugin } from './createMaskPlugin.js';

type PluginAPI = Parameters<ReturnType<typeof plugin>['handler']>[0];

describe('createMaskPlugin', () => {
  it('should register the mask fade utilities', () => {
    const addUtilities = vi.fn();

    createMaskPlugin().handler({ addUtilities } as unknown as PluginAPI);

    expect(addUtilities).toHaveBeenCalledTimes(1);
    expect(addUtilities).toHaveBeenCalledWith({
      '.mask-fade-y': {
        '-webkit-mask-image':
          'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        'mask-image':
          'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
      },
      '.mask-fade-x': {
        '-webkit-mask-image':
          'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
        'mask-image':
          'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
      },
      '.mask-fade-none': {
        '-webkit-mask-image': 'none',
        'mask-image': 'none',
      },
    });
  });
});
