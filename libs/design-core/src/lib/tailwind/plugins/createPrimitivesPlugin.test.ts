import type plugin from 'tailwindcss/plugin.js';
import { describe, expect, it, vi } from 'vitest';
import { primitivesTheme } from '../../generated/css/index.js';
import { createPrimitivesPlugin } from './createPrimitivesPlugin.js';

type PluginAPI = Parameters<ReturnType<typeof plugin>['handler']>[0];

describe('createPrimitivesPlugin', () => {
  const { handler, config } = createPrimitivesPlugin();
  const themeConfig = config?.theme as Record<string, unknown>;

  const runHandler = () => {
    const api = {
      addBase: vi.fn(),
      addUtilities: vi.fn(),
      theme: (key: string) => themeConfig[key],
    };
    handler(api as unknown as PluginAPI);
    return api;
  };

  it('should register the primitive tokens as base styles', () => {
    const { addBase } = runHandler();

    expect(addBase).toHaveBeenCalledTimes(1);
    expect(addBase).toHaveBeenCalledWith(primitivesTheme);
  });

  it('should register icon and spot utilities from the theme', () => {
    const { addUtilities } = runHandler();

    expect(addUtilities).toHaveBeenCalledTimes(2);
    expect(addUtilities).toHaveBeenCalledWith(
      expect.objectContaining({
        '.icon-w-16': { width: 'var(--icon-width-16)' },
        '.icon-h-16': { height: 'var(--icon-height-16)' },
        '.icon-stroke-16': {
          strokeWidth: 'calc(var(--icon-border-width-16) / 1)',
        },
      }),
    );
    expect(addUtilities).toHaveBeenCalledWith(
      expect.objectContaining({
        '.spot-w-32': { width: 'var(--spot-width-32)' },
        '.spot-h-32': { height: 'var(--spot-height-32)' },
      }),
    );
  });

  it('should map the primitive tokens to theme scales', () => {
    expect(themeConfig).toMatchObject({
      spacing: expect.objectContaining({ 4: 'var(--spacing-4)' }),
      iconWidth: expect.objectContaining({ 16: 'var(--icon-width-16)' }),
      spotWidth: expect.objectContaining({ 32: 'var(--spot-width-32)' }),
    });
  });

  it('should reuse the size tokens for every sizing scale', () => {
    const extend = themeConfig.extend as Record<string, unknown>;

    expect(extend.size).toEqual(
      expect.objectContaining({ 16: 'var(--size-16)' }),
    );
    for (const key of [
      'height',
      'width',
      'maxHeight',
      'maxWidth',
      'minHeight',
      'minWidth',
    ]) {
      expect(extend[key]).toBe(extend.size);
    }
  });

  it('should layer overlays above the content they cover', () => {
    const { zIndex } = themeConfig.extend as {
      zIndex: Record<string, string>;
    };

    expect(Number(zIndex['dialog-content'])).toBeGreaterThan(
      Number(zIndex['dialog-overlay']),
    );
    expect(Number(zIndex.tooltip)).toBeGreaterThan(Number(zIndex.toast));
  });
});
