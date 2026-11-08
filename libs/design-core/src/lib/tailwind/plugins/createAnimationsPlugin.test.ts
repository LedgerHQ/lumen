import type plugin from 'tailwindcss/plugin.js';
import { describe, expect, it, vi } from 'vitest';
import { createAnimationsPlugin } from './createAnimationsPlugin.js';

type PluginAPI = Parameters<ReturnType<typeof plugin>['handler']>[0];

describe('createAnimationsPlugin', () => {
  const { handler, config } = createAnimationsPlugin();
  const keyframes = config?.theme?.extend?.keyframes as Record<string, object>;
  const animation = config?.theme?.extend?.animation as Record<string, string>;

  it('should not register any utility or base style', () => {
    const api = {
      addBase: vi.fn(),
      addUtilities: vi.fn(),
      matchUtilities: vi.fn(),
    };

    handler(api as unknown as PluginAPI);

    expect(api.addBase).not.toHaveBeenCalled();
    expect(api.addUtilities).not.toHaveBeenCalled();
    expect(api.matchUtilities).not.toHaveBeenCalled();
  });

  it('should define one animation per keyframe', () => {
    expect(Object.keys(animation).sort()).toEqual(
      Object.keys(keyframes).sort(),
    );
  });

  it.each(Object.entries(animation))(
    'should run the %s animation on its own keyframes',
    (name, value) => {
      expect(value.split(' ')[0]).toBe(name);
      expect(keyframes[name]).toHaveProperty('from');
      expect(keyframes[name]).toHaveProperty('to');
    },
  );

  it('should extend the theme rather than replace it', () => {
    expect(config?.theme).toEqual({
      extend: { keyframes, animation },
    });
  });
});
