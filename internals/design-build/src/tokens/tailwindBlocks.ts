/**
 * Tailwind-shaped building blocks the Tailwind target serializes: typography
 * classes and motion values.
 */
import type { Token } from '@lumen/design-sources';
import { cssVariableName, outputSegment, typographyStyles } from './naming.js';

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
  for (const { group, step, weights } of typographyStyles(breakpointTokens)) {
    const base = ['font-style', group, step];
    const name = `.${outputSegment(group)}-${outputSegment(step)}`;

    for (const { weight, semiBold } of weights) {
      utilities[semiBold ? `${name}-semi-bold` : name] = {
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
