/**
 * Tailwind-shaped building blocks the v4 CSS target serializes: typography
 * classes, shadow utilities and motion values.
 */
import {
  colorToHex,
  type DtcgDimension,
  type DtcgShadowLayer,
  type Token,
} from '@lumen/design-sources';
import { cssVariableName, outputSegment } from './naming.js';

type Declarations = Record<string, string>;

const FONT_SMOOTHING: Declarations = {
  '-webkit-font-smoothing': 'antialiased',
  '-moz-osx-font-smoothing': 'grayscale',
};

const cssVar = (path: string[]): string => `var(${cssVariableName(path)})`;

/**
 * One class per text style: `.responsive-display-1`, `.heading-0`,
 * `.heading-0-semi-bold`, `.body-1`… Each reads the breakpoint-aware
 * variables, so the class itself never changes per screen size.
 */
export const typographyUtilities = (
  breakpointTokens: Token[],
): Record<string, Declarations> => {
  const utilities: Record<string, Declarations> = {};
  for (const token of breakpointTokens) {
    const [root, group, step, property] = token.path;
    if (root !== 'font-style' || property !== 'size') continue;
    const base = ['font-style', group, step];
    const name = `.${outputSegment(group)}-${outputSegment(step)}`;
    const variants: [string, string][] =
      group === 'responsive-display'
        ? [[name, 'weight']]
        : [
            [name, 'weight-medium'],
            [`${name}-semi-bold`, 'weight-semi-bold'],
          ];

    for (const [className, weight] of variants) {
      utilities[className] = {
        'font-family': cssVar(['font-family', 'font']),
        'font-size': cssVar([...base, 'size']),
        'font-weight': cssVar([...base, weight]),
        'line-height': cssVar([...base, 'line-height']),
        'letter-spacing': cssVar([...base, 'letter-spacing']),
        ...FONT_SMOOTHING,
      };
    }
  }
  return utilities;
};

const length = (value: DtcgDimension | string): string => {
  const { value: amount, unit } = value as DtcgDimension;
  return amount === 0 ? '0' : `${amount}${unit}`;
};

/** `#0000001a` → `rgba(0, 0, 0, 0.10)`, the form Tailwind shadows always used. */
export const hexToRgba = (hex: string): string => {
  const [r, g, b, a = 255] = [1, 3, 5, 7].map((index) =>
    hex.length > index
      ? Number.parseInt(hex.slice(index, index + 2), 16)
      : undefined,
  ) as number[];
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
};

/**
 * `.shadow-<size>` utilities. The color goes through `--tw-shadow-color`, so
 * `shadow-<color>` still tints any elevation.
 */
export const shadowUtilities = (
  tokens: Token[],
  resolve: (token: Token) => unknown,
): Record<string, Declarations> => {
  return Object.fromEntries(
    tokens
      .filter((token) => token.path[0] === 'shadow' && token.$type === 'shadow')
      .map((token) => {
        const layers = resolve(token) as DtcgShadowLayer[];
        const shadow = layers
          .map(
            (layer) =>
              `${length(layer.offsetX)} ${length(layer.offsetY)} ${length(layer.blur)} ${length(layer.spread)} var(--tw-shadow-color, ${hexToRgba(colorToHex(layer.color))})`,
          )
          .join(', ');
        return [
          `.shadow-${outputSegment(token.path[1])}`,
          { '--tw-shadow': shadow, 'box-shadow': 'var(--tw-shadow)' },
        ];
      }),
  );
};

/** Durations as CSS times and easings as `cubic-bezier()`, keyed like the tokens. */
export const motion = (
  tokens: Token[],
  resolve: (token: Token) => unknown,
): { durations: Declarations; easings: Declarations } => {
  const durations: Declarations = {};
  const easings: Declarations = {};
  for (const token of tokens) {
    const [group, key] = token.path;
    if (group === 'duration') {
      durations[key] = `${(resolve(token) as { value: number }).value}ms`;
    } else if (group === 'easing') {
      easings[key] = `cubic-bezier(${(resolve(token) as number[]).join(', ')})`;
    }
  }
  return { durations, easings };
};
