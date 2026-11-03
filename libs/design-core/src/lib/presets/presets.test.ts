import type plugin from 'tailwindcss/plugin.js';
import { describe, expect, it, vi } from 'vitest';
import {
  allBrandsCSSTheme,
  enterpriseCSSTheme,
  ledgerLiveCSSTheme,
  primitivesTheme,
  websitesCSSTheme,
} from '../themes/css/index.js';
import {
  allBrandsPreset,
  enterprisePreset,
  ledgerLivePreset,
  websitesPreset,
} from './index.js';

type TailwindPlugin = ReturnType<typeof plugin>;
type PluginAPI = Parameters<TailwindPlugin['handler']>[0];

const runPlugins = (plugins: TailwindPlugin[]) => {
  const themeConfig = Object.assign(
    {},
    ...plugins.map(({ config }) => config?.theme),
  );
  const api = {
    addBase: vi.fn(),
    addUtilities: vi.fn(),
    matchUtilities: vi.fn(),
    theme: (key: string) => themeConfig[key],
  };
  plugins.forEach(({ handler }) => handler(api as unknown as PluginAPI));
  return api;
};

describe('presets', () => {
  it.each([
    ['ledgerLivePreset', ledgerLivePreset, ledgerLiveCSSTheme],
    ['enterprisePreset', enterprisePreset, enterpriseCSSTheme],
    ['websitesPreset', websitesPreset, websitesCSSTheme],
    ['allBrandsPreset', allBrandsPreset, allBrandsCSSTheme],
  ])(
    '%s should register the primitive and brand tokens as base styles',
    (_, preset, brandCSSTheme) => {
      const { addBase } = runPlugins(preset.plugins as TailwindPlugin[]);

      expect(addBase).toHaveBeenCalledWith(primitivesTheme);
      expect(addBase).toHaveBeenCalledWith(brandCSSTheme);
    },
  );

  it.each([
    ['ledgerLivePreset', ledgerLivePreset],
    ['enterprisePreset', enterprisePreset],
    ['websitesPreset', websitesPreset],
    ['allBrandsPreset', allBrandsPreset],
  ])('%s should toggle dark mode with a class', (_, preset) => {
    expect(preset.darkMode).toBe('class');
  });

  it('should register the same utilities for every brand', () => {
    const utilityNames = (preset: typeof ledgerLivePreset): string[] =>
      runPlugins(preset.plugins as TailwindPlugin[])
        .addUtilities.mock.calls.flatMap(([utilities]) =>
          Object.keys(utilities),
        )
        .filter((name) => !name.startsWith('.bg-gradient-'))
        .sort();

    expect(utilityNames(enterprisePreset)).toEqual(
      utilityNames(ledgerLivePreset),
    );
    expect(utilityNames(websitesPreset)).toEqual(
      utilityNames(ledgerLivePreset),
    );
  });
});
