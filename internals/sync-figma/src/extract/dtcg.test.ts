import { describe, expect, it } from 'vitest';
import {
  colorToHex,
  dtcgColor,
  dtcgTypeOf,
  dtcgValueOf,
  UnsupportedVariableError,
} from './dtcg.js';

const float = (name: string, scopes: string[] = []) => ({
  name,
  resolvedType: 'FLOAT',
  scopes,
  value: 4,
});

describe('dtcgTypeOf', () => {
  it.each([
    ['font/weight/semi-bold', ['FONT_WEIGHT'], 'fontWeight'],
    ['overlay/dim', ['OPACITY'], 'number'],
    ['card/padding', ['GAP', 'WIDTH_HEIGHT'], 'dimension'],
  ])('types a scoped FLOAT by its scope: %s', (name, scopes, type) => {
    expect(dtcgTypeOf(float(name, scopes))).toBe(type);
  });

  it.each([
    ['font/size/12', 'dimension'],
    ['icon-border-width/16', 'dimension'],
    ['Breakpoint/Width', 'dimension'],
    ['duration/150', 'duration'],
    ['z-index/toast', 'number'],
  ])('types an unscoped primitive by its group name: %s', (name, type) => {
    expect(dtcgTypeOf(float(name, ['ALL_SCOPES']))).toBe(type);
  });

  it('fails on a FLOAT nothing describes, or whose scopes disagree', () => {
    expect(() => dtcgTypeOf(float('levels/max'))).toThrow(
      UnsupportedVariableError,
    );
    expect(() => dtcgTypeOf(float('mix', ['OPACITY', 'GAP']))).toThrow(
      UnsupportedVariableError,
    );
  });
});

describe('dtcgValueOf', () => {
  const easing = (value: unknown) => ({
    name: 'easing/ease-out',
    resolvedType: 'EASING',
    scopes: [],
    value,
  });
  const bezierValues = { p1x: 0.4000000059604645, p1y: 0, p2x: 0.2, p2y: 1 };

  it('converts TIMING seconds to milliseconds', () => {
    expect(
      dtcgValueOf('duration', {
        name: 'duration/75',
        resolvedType: 'TIMING',
        scopes: [],
        value: 0.07500000298023224,
      }),
    ).toEqual({ value: 75, unit: 'ms' });
  });

  it('reads a Bézier easing and rounds its float32 points', () => {
    expect(
      dtcgValueOf('cubicBezier', easing({ easingType: 7, bezierValues })),
    ).toEqual([0.4, 0, 0.2, 1]);
  });

  it('fails on a spring easing instead of shipping its leftover curve', () => {
    expect(() =>
      dtcgValueOf(
        'cubicBezier',
        easing({
          easingType: 12,
          springValues: { mass: 1, stiffness: 100, damping: 15 },
          bezierValues,
        }),
      ),
    ).toThrow('easing type 12 is a spring');
  });
});

describe('dtcgColor', () => {
  it('reads Figma channels and legacy hex strings to the same color', () => {
    const fromFigma = dtcgColor({ r: 1, g: 1, b: 1, a: 0.10196078431372549 });
    const fromHex = dtcgColor('#ffffff1a');

    expect(fromFigma).toEqual(fromHex);
    expect(fromHex).toEqual({
      colorSpace: 'srgb',
      components: [1, 1, 1],
      alpha: 0.102,
      hex: '#ffffff',
    });
  });

  it('omits alpha for opaque colors', () => {
    expect(dtcgColor({ r: 0, g: 0, b: 0 })).toEqual({
      colorSpace: 'srgb',
      components: [0, 0, 0],
      hex: '#000000',
    });
  });
});

describe('colorToHex', () => {
  it.each(['#f4b728', '#f4b72800', '#0000001a', '#ffffff33'])(
    'round-trips %s',
    (hex) => {
      expect(colorToHex(dtcgColor(hex))).toBe(hex);
    },
  );
});
