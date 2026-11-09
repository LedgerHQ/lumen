import { describe, expect, it } from 'vitest';
import type { DtcgColor, DtcgGroup } from './dtcg.js';
import { loadTokenSources, type SourceFile } from './load.js';
import { validateSources } from './validate.js';

const source = (
  file: string,
  tokens: DtcgGroup,
  { collection = file.split('.')[1], mode = null as string | null } = {},
): SourceFile => ({
  file,
  origin: 'figma',
  order: 1,
  collection,
  mode,
  tokens,
});

const px = (value: number) => ({ value, unit: 'px' as const });
const black: DtcgColor = {
  colorSpace: 'srgb',
  components: [0, 0, 0],
  hex: '#000000',
};
const white: DtcgColor = {
  colorSpace: 'srgb',
  components: [1, 1, 1],
  hex: '#ffffff',
};

describe('validateSources', () => {
  it('accepts the committed sources, with naming warnings for designers', () => {
    const { errors, warnings } = validateSources(loadTokenSources());

    expect(errors).toEqual([]);
    expect(warnings).toContain(
      'figma/1.primitives.value.tokens.json: color.dark.crypto.Zcash-0%: segment "Zcash-0%" is not lowercase kebab-case',
    );
  });

  it('reports values that do not match their type', () => {
    const { errors } = validateSources([
      source('1.primitives.tokens.json', {
        spacing: { 4: { $type: 'dimension', $value: 4 } },
        color: { white: { $type: 'color', $value: '#ffffff' } },
      }),
    ]);

    expect(errors).toEqual([
      '1.primitives.tokens.json: spacing.4: 4 is not a valid dimension',
      '1.primitives.tokens.json: color.white: "#ffffff" is not a valid color',
    ]);
  });

  it('reports missing references, type mismatches and cycles', () => {
    const { errors } = validateSources([
      source('1.primitives.tokens.json', {
        size: { 4: { $type: 'dimension', $value: px(4) } },
        a: { $type: 'color', $value: '{b}' },
        b: { $type: 'color', $value: '{a}' },
        gap: { $type: 'color', $value: '{size.4}' },
        ghost: { $type: 'dimension', $value: '{size.5}' },
      }),
    ]);

    expect(errors).toEqual([
      '1.primitives.tokens.json: gap: is a color but {size.4} is a dimension',
      '1.primitives.tokens.json: ghost: references missing token {size.5}',
      'reference cycle: a → b → a',
    ]);
  });

  it('requires the same tokens in every mode of a collection', () => {
    const { errors } = validateSources([
      source(
        '2.theme.light.tokens.json',
        {
          bg: { $type: 'color', $value: white },
          fg: { $type: 'color', $value: black },
        },
        { collection: 'theme', mode: 'light' },
      ),
      source(
        '2.theme.dark.tokens.json',
        { bg: { $type: 'color', $value: black } },
        { collection: 'theme', mode: 'dark' },
      ),
    ]);

    expect(errors).toEqual([
      '2.theme.dark.tokens.json: mode "dark" lacks 1 token(s) its siblings define: fg',
    ]);
  });

  it('checks references nested in shadows', () => {
    const { errors } = validateSources([
      source('shadow.tokens.json', {
        size: { 1: { $type: 'dimension', $value: px(1) } },
        shadow: {
          sm: {
            $type: 'shadow',
            $value: [
              {
                color: '{grey.10}',
                offsetX: px(0),
                offsetY: px(1),
                blur: px(2),
                spread: px(0),
              },
            ],
          },
          md: {
            $type: 'shadow',
            $value: [
              {
                color: '{size.1}',
                offsetX: px(0),
                offsetY: px(1),
                blur: px(2),
                spread: px(0),
              },
            ],
          },
        },
      }),
    ]);

    expect(errors).toEqual([
      'shadow.tokens.json: shadow.sm: references missing token {grey.10}',
      'shadow.tokens.json: shadow.md: {size.1} is a dimension, not a color',
    ]);
  });

  it('rejects a token defined by two collections, such as a Figma file and a code file', () => {
    const ms = (value: number) => ({ value, unit: 'ms' as const });
    const { errors } = validateSources([
      source(
        '7.motion.tokens.json',
        { duration: { 75: { $type: 'duration', $value: ms(75) } } },
        { collection: 'duration' },
      ),
      {
        ...source(
          'duration.tokens.json',
          { duration: { 75: { $type: 'duration', $value: ms(80) } } },
          { collection: 'duration' },
        ),
        file: 'code/duration.tokens.json',
        origin: 'code',
      },
    ]);

    expect(errors).toEqual([
      '7.motion.tokens.json: duration.75: also defined in code/duration.tokens.json; a token belongs to one collection',
    ]);
  });

  it('rejects a reference to a later collection', () => {
    const { errors } = validateSources([
      source('1.primitives.tokens.json', {
        gap: { $type: 'dimension', $value: '{space}' },
      }),
      {
        ...source('3.brand.tokens.json', {
          space: { $type: 'dimension', $value: px(4) },
        }),
        order: 3,
      },
    ]);

    expect(errors).toEqual([
      '1.primitives.tokens.json: gap: {space} is in 3.brand.tokens.json, a later collection; references point to the same or an earlier one',
    ]);
  });

  it('requires a token to keep its type in every mode', () => {
    const { errors } = validateSources([
      source(
        '2.theme.light.tokens.json',
        { bg: { $type: 'color', $value: white } },
        { collection: 'theme', mode: 'light' },
      ),
      source(
        '2.theme.dark.tokens.json',
        { bg: { $type: 'number', $value: 0 } },
        { collection: 'theme', mode: 'dark' },
      ),
    ]);

    expect(errors).toEqual([
      '2.theme.dark.tokens.json: bg: is a number here but a color in 2.theme.light.tokens.json',
    ]);
  });

  it('rejects unknown types', () => {
    const { errors } = validateSources([
      source('1.primitives.tokens.json', {
        flag: { $type: 'boolean' as never, $value: 'true' },
      }),
    ]);

    expect(errors).toEqual([
      '1.primitives.tokens.json: flag: unknown $type "boolean"',
    ]);
  });
});
