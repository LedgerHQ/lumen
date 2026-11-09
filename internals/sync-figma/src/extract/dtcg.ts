import type { RGB, RGBA } from '@figma/rest-api-spec';
import type {
  DtcgColor,
  DtcgCubicBezier,
  DtcgType,
  DtcgValue,
} from '@lumen/design-sources';

/** What the type mapping needs to know about a concrete (non-alias) variable. */
export type VariableShape = {
  name: string;
  resolvedType: string;
  scopes: readonly string[];
  value: unknown;
};

export class UnsupportedVariableError extends Error {}

const NUMBER_GROUPS = new Set(['opacity', 'z-index', 'ratio']);

/** What a FLOAT's Figma scope says it is. */
const FLOAT_SCOPE_TYPES: Record<string, DtcgType> = {
  CORNER_RADIUS: 'dimension',
  WIDTH_HEIGHT: 'dimension',
  GAP: 'dimension',
  STROKE_FLOAT: 'dimension',
  EFFECT_FLOAT: 'dimension',
  FONT_SIZE: 'dimension',
  LINE_HEIGHT: 'dimension',
  LETTER_SPACING: 'dimension',
  PARAGRAPH_SPACING: 'dimension',
  PARAGRAPH_INDENT: 'dimension',
  OPACITY: 'number',
  FONT_WEIGHT: 'fontWeight',
};

/** Group names that make a FLOAT a length when its scopes say nothing. */
const DIMENSION_WORDS = [
  'size',
  'width',
  'height',
  'spacing',
  'gap',
  'radius',
  'stroke',
  'blur',
  'breakpoint',
];

const segments = (name: string): string[] =>
  name.toLowerCase().replace(/\s+/g, '-').split('/');

/**
 * A scoped FLOAT is typed by its scope. Primitives are hidden from Figma's
 * pickers, so their scopes are empty or `ALL_SCOPES`, and their group name
 * decides instead. `undefined` when neither says, or two scopes disagree.
 */
const floatTypeOf = (
  path: string[],
  scopes: readonly string[],
): DtcgType | undefined => {
  const byScope = new Set(
    scopes.flatMap((scope) => FLOAT_SCOPE_TYPES[scope] ?? []),
  );
  if (byScope.size > 1) return undefined;
  if (byScope.size === 1) return [...byScope][0];
  if (path.includes('duration')) return 'duration';
  if (path.some((segment) => NUMBER_GROUPS.has(segment))) return 'number';
  if (
    path.some((segment) =>
      DIMENSION_WORDS.some((word) => segment.includes(word)),
    )
  ) {
    return 'dimension';
  }
  return undefined;
};

/**
 * Figma numbers easing types in the order of its `EasingType` enum: up to 7
 * (`CUSTOM_CUBIC_BEZIER`) they are Bézier curves, from 8 (`GENTLE`) springs.
 * A spring still carries the `bezierValues` it had before, and DTCG has no
 * spring type, so a spring must fail rather than ship that stale curve.
 */
const LAST_BEZIER_EASING_TYPE = 7;
const BEZIER_EASING_NAMES = new Set([
  'EASE_IN',
  'EASE_OUT',
  'EASE_IN_AND_OUT',
  'LINEAR',
  'EASE_IN_BACK',
  'EASE_OUT_BACK',
  'EASE_IN_AND_OUT_BACK',
  'CUSTOM_CUBIC_BEZIER',
]);

const isBezierEasing = (easingType: unknown): boolean =>
  easingType === undefined ||
  (typeof easingType === 'number' && easingType <= LAST_BEZIER_EASING_TYPE) ||
  (typeof easingType === 'string' && BEZIER_EASING_NAMES.has(easingType));

/**
 * Maps a Figma variable to its DTCG type, or `null` for types no output reads
 * (booleans). Anything else unknown throws: a silently skipped variable is how
 * designers' changes got lost before.
 */
export const dtcgTypeOf = ({
  name,
  resolvedType,
  scopes,
  value,
}: VariableShape): DtcgType | null => {
  const path = segments(name);

  switch (resolvedType) {
    case 'COLOR':
      return 'color';
    case 'BOOLEAN':
      return null;
    case 'EASING':
      return 'cubicBezier';
    case 'TIMING':
      return 'duration';
    case 'FLOAT': {
      const type = floatTypeOf(path, scopes);
      if (type) return type;
      break;
    }
    case 'STRING':
      if (typeof value === 'string' && value.startsWith('cubic-bezier(')) {
        return 'cubicBezier';
      }
      if (scopes.includes('FONT_FAMILY') || path.includes('font-family')) {
        return 'fontFamily';
      }
      if (
        scopes.includes('FONT_STYLE') ||
        scopes.includes('FONT_WEIGHT') ||
        path.some((segment) => segment.includes('weight'))
      ) {
        return 'fontWeight';
      }
      break;
  }

  throw new UnsupportedVariableError(
    `${name}: no DTCG type for a ${resolvedType} variable with scopes [${scopes.join(', ')}]`,
  );
};

const byte = (channel: number): number => Math.round(channel * 255);
const toHexByte = (value: number): string =>
  value.toString(16).padStart(2, '0');

/**
 * Figma floats carry float32 noise (`0.4000000059604645`): round to what a
 * design value means, so a re-export never shows a spurious diff.
 */
const clean = (value: number, decimals = 6): number =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

/**
 * A DTCG sRGB color from Figma channels (0–1) or a legacy hex string. Channels
 * are stored at 8-bit precision, so the hex every output writes is exactly the
 * one the export always produced.
 */
export const dtcgColor = (value: RGB | RGBA | string): DtcgColor => {
  const bytes =
    typeof value === 'string'
      ? [1, 3, 5, 7]
          .filter((index) => index < value.length)
          .map((index) => Number.parseInt(value.slice(index, index + 2), 16))
      : [value.r, value.g, value.b, 'a' in value ? value.a : 1].map(byte);
  const [r, g, b, a = 255] = bytes;
  const toUnit = (channel: number): number => clean(channel / 255, 4);

  return {
    colorSpace: 'srgb',
    components: [toUnit(r), toUnit(g), toUnit(b)],
    ...(a === 255 ? {} : { alpha: toUnit(a) }),
    hex: `#${[r, g, b].map(toHexByte).join('')}`,
  };
};

const parseCubicBezier = (value: string): DtcgCubicBezier => {
  const numbers = value
    .replace(/^cubic-bezier\(|\)$/g, '')
    .split(',')
    .map((part) => Number(part.trim()));
  if (numbers.length !== 4 || numbers.some(Number.isNaN)) {
    throw new UnsupportedVariableError(`Invalid cubic-bezier: ${value}`);
  }
  return numbers as DtcgCubicBezier;
};

/** Converts a concrete Figma value to the DTCG value for its type. */
export const dtcgValueOf = (
  type: DtcgType,
  { name, resolvedType, value }: VariableShape,
): DtcgValue => {
  switch (type) {
    case 'color':
      return dtcgColor(value as RGB | RGBA | string);
    case 'dimension':
      return { value: Number(value), unit: 'px' };
    case 'duration':
      // TIMING variables are seconds; legacy FLOAT durations were already ms.
      return resolvedType === 'TIMING'
        ? { value: clean(Number(value) * 1000, 3), unit: 'ms' }
        : { value: Number(value), unit: 'ms' };
    case 'number':
      return Number(value);
    case 'cubicBezier':
      if (typeof value === 'string') return parseCubicBezier(value);
      if (value && typeof value === 'object' && 'bezierValues' in value) {
        const { easingType, bezierValues } = value as {
          easingType?: unknown;
          bezierValues: Record<string, number>;
        };
        if (!isBezierEasing(easingType)) {
          throw new UnsupportedVariableError(
            `${name}: easing type ${String(easingType)} is a spring, which DTCG has no type for`,
          );
        }
        const { p1x, p1y, p2x, p2y } = bezierValues;
        return [p1x, p1y, p2x, p2y].map((point) =>
          clean(point),
        ) as DtcgCubicBezier;
      }
      break;
    case 'fontWeight':
      return /^\d+$/.test(String(value)) ? Number(value) : String(value);
    case 'fontFamily':
      return String(value);
  }

  throw new UnsupportedVariableError(
    `${name}: cannot convert ${JSON.stringify(value)} to ${type}`,
  );
};

/** Figma alias syntax: `font/size/64` → `{font.size.64}`. */
export const aliasReference = (variableName: string): string =>
  `{${variableName.replace(/\//g, '.')}}`;
