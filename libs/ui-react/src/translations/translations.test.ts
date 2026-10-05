import { describe, expect, it } from 'vitest';
import { dictionaries } from './translations';

type Dictionary = { [key: string]: string | Dictionary };

const flatten = (dictionary: Dictionary, prefix = ''): Record<string, string> =>
  Object.entries(dictionary).reduce<Record<string, string>>(
    (entries, [key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof value === 'string'
        ? { ...entries, [path]: value }
        : { ...entries, ...flatten(value, path) };
    },
    {},
  );

const placeholdersOf = (value: string): string[] =>
  [...value.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map(([, name]) => name).sort();

// Keys that are allowed to fall back to en until they are translated.
const UNTRANSLATED_KEYS = [
  'components.chart.emptyLabel',
  'components.chart.loadingAriaLabel',
  'components.chart.defaultAriaLabel',
  'components.select.searchPlaceholder',
  'components.subheader.moreInfoAriaLabel',
];
const source = flatten(dictionaries.en);
const locales = Object.entries(dictionaries)
  .filter(([locale]) => locale !== 'en')
  .map(([locale, dictionary]) => [locale, flatten(dictionary)] as const);

describe('translation dictionaries', () => {
  it.each(locales)('%s has no key that en lacks', (_, entries) => {
    expect(Object.keys(entries).filter((key) => !(key in source))).toEqual([]);
  });

  it.each(locales)('%s translates every en key', (_, entries) => {
    const missing = Object.keys(source).filter(
      (key) => !(key in entries) && !UNTRANSLATED_KEYS.includes(key),
    );
    expect(missing).toEqual([]);
  });

  it.each(locales)('%s uses the same placeholders as en', (_, entries) => {
    const mismatches = Object.entries(entries).filter(
      ([key, value]) =>
        placeholdersOf(value).join() !==
        placeholdersOf(source[key] ?? '').join(),
    );
    expect(mismatches).toEqual([]);
  });
});
