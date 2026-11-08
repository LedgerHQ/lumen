import { describe, expect, it } from 'vitest';
import {
  enterpriseThemes,
  ledgerLiveThemes,
  websitesThemes,
} from '../generated/js/index.js';

/**
 * Freezes the resolved React Native theme, so generating it (DLS-1177) can
 * prove it changed nothing. Keys are sorted, so only values and the key set
 * matter, not the order in the source file.
 */

const sortKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value === null || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortKeys((value as Record<string, unknown>)[key])]),
  );
};

const toJson = (value: unknown): string =>
  `${JSON.stringify(sortKeys(value), null, 2)}\n`;

const brands = {
  enterprise: enterpriseThemes,
  'ledger-live': ledgerLiveThemes,
  websites: websitesThemes,
};

describe('JS theme snapshots', () => {
  it('shares the same core tokens across every brand and mode', async () => {
    const { colors: _colors, ...core } = enterpriseThemes.light;

    for (const themes of Object.values(brands)) {
      for (const theme of [themes.light, themes.dark]) {
        const { colors: _themeColors, ...themeCore } = theme;
        expect(themeCore).toEqual(core);
      }
    }

    await expect(toJson(core)).toMatchFileSnapshot('__snapshots__/core.json');
  });

  it.each(
    Object.entries(brands).flatMap(([brand, themes]) => [
      [brand, 'light', themes.light.colors] as const,
      [brand, 'dark', themes.dark.colors] as const,
    ]),
  )('freezes the %s %s colors', async (brand, mode, colors) => {
    await expect(toJson(colors)).toMatchFileSnapshot(
      `__snapshots__/colors.${brand}.${mode}.json`,
    );
  });
});
