import { parseFileName } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { loadFixture } from '../testing/fixtures.js';
import { UnsupportedVariableError } from './dtcg.js';
import { extractTokenFiles, tokenFileName } from './tokens.js';

describe('extractTokenFiles', () => {
  it('writes one file per collection and mode', () => {
    const files = extractTokenFiles(
      loadFixture('get-local-variables-response.json'),
    );

    expect(Object.keys(files).sort()).toEqual([
      '1.primitives.value.tokens.json',
      '2.theme.dark.tokens.json',
      '2.theme.light.tokens.json',
      '3.brand.entreprise.tokens.json',
      '3.brand.ledger-live.tokens.json',
      '3.brand.websites.tokens.json',
      '4.breakpoint.lg.tokens.json',
      '4.breakpoint.md.tokens.json',
      '4.breakpoint.sm.tokens.json',
      '4.breakpoint.xl.tokens.json',
    ]);
  });

  // The export feeds design-sources directly: a name it can't parse would
  // fail the next stage, so check every recorded collection and mode.
  it.each([
    'get-local-variables-response.json',
    'motion-variables-response.json',
  ])('names every file so design-sources can read it: %s', (fixture) => {
    for (const name of Object.keys(extractTokenFiles(loadFixture(fixture)))) {
      expect(() => parseFileName(name), name).not.toThrow();
    }
  });

  it('exports the recorded library as DTCG', async () => {
    const files = extractTokenFiles(
      loadFixture('get-local-variables-response.json'),
    );

    await expect(`${JSON.stringify(files, null, 2)}\n`).toMatchFileSnapshot(
      '__snapshots__/foundations.tokens.json',
    );
  });

  it('maps numbers to px dimensions, and aliases to their target type', () => {
    const files = extractTokenFiles(
      loadFixture('get-local-variables-response.json'),
    );

    expect(files['1.primitives.value.tokens.json'].Radius).toMatchObject({
      4: { $type: 'dimension', $value: { value: 4, unit: 'px' } },
    });
    expect(files['4.breakpoint.md.tokens.json']).toMatchObject({
      'Font Style': {
        Display: {
          'Display 1': {
            Size: { $type: 'dimension', $value: '{Font Style.Size.80}' },
          },
        },
      },
    });
  });

  it('maps the motion collection to duration and cubicBezier, and drops booleans', () => {
    const files = extractTokenFiles(
      loadFixture('motion-variables-response.json'),
    );

    expect(Object.keys(files)).toEqual(['7.motion.tokens.json']);
    expect(files['7.motion.tokens.json']).toMatchObject({
      duration: {
        150: { $type: 'duration', $value: { value: 150, unit: 'ms' } },
      },
      easing: {
        'ease-in': { $type: 'cubicBezier', $value: [0.4, 0, 1, 1] },
        'ease-out': { $type: 'cubicBezier', $value: [0, 0, 0.2, 1] },
        'ease-in-out': { $type: 'cubicBezier', $value: [0.4, 0, 0.2, 1] },
      },
      font: { weight: { 'semi-bold': { $type: 'fontWeight', $value: 600 } } },
      'number-weight': {
        $type: 'fontWeight',
        $value: '{font.weight.semi-bold}',
      },
      transition: { fast: { $type: 'duration', $value: '{duration.150}' } },
    });
    expect(files['7.motion.tokens.json']).not.toHaveProperty('utility');
  });

  it('writes colors as DTCG 2025.10 sRGB objects, keeping the 8-bit hex', () => {
    const files = extractTokenFiles(
      loadFixture('get-local-variables-response.json'),
    );

    expect(files['1.primitives.value.tokens.json']).toMatchObject({
      Colors: {
        Dark: {
          Grey: {
            100: {
              $type: 'color',
              $value: {
                colorSpace: 'srgb',
                components: [0.098, 0.098, 0.098],
                hex: '#191919',
              },
            },
          },
        },
      },
    });
  });

  it('skips variables deleted in Figma that something still references', () => {
    const response = loadFixture('motion-variables-response.json');
    response.meta.variables['VariableID:9:9'].deletedButReferenced = true;

    const durations = Object.values(extractTokenFiles(response)).map((file) =>
      Object.keys((file.duration ?? {}) as object),
    );

    expect(durations.flat()).not.toContain('75');
    expect(durations.flat()).toContain('150');
  });

  it('fails on a variable with no DTCG mapping instead of skipping it', () => {
    const response = loadFixture('motion-variables-response.json');
    response.meta.variables['VariableID:9:3'].valuesByMode['9:0'] = 'fast';

    expect(() => extractTokenFiles(response)).toThrow(UnsupportedVariableError);
    expect(() => extractTokenFiles(response)).toThrow(
      'easing/ease-in: no DTCG type for a STRING variable',
    );
  });
});

describe('tokenFileName', () => {
  const collection = (modes: string[]) => ({
    name: '4.breakpoint',
    modes: modes.map((name, index) => ({ modeId: String(index), name })),
  });

  it('keeps the first word of a described mode name', () => {
    const breakpoints = collection(['XL - 1024 & more']);
    expect(tokenFileName(breakpoints, breakpoints.modes[0])).toBe(
      '4.breakpoint.xl.tokens.json',
    );
  });

  it('lowercases and hyphenates collection and mode names', () => {
    const brands = { ...collection(['Ledger Live']), name: '3.Brand' };
    expect(tokenFileName(brands, brands.modes[0])).toBe(
      '3.brand.ledger-live.tokens.json',
    );
  });

  it('drops Figma’s default mode name for single-mode collections', () => {
    const motion = { ...collection(['Mode 1']), name: '7.motion' };
    expect(tokenFileName(motion, motion.modes[0])).toBe('7.motion.tokens.json');
  });
});
