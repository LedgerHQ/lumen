import { describe, it, expect } from 'vitest';

import { allBrandsCSSTheme } from '../themes/css/index.js';
import {
  createGradientPlugin,
  createPrimitivesPlugin,
  createThemePlugin,
  createTypographyPlugin,
} from '../utils/index.js';
import { cn } from './cn.js';

type Plugin = ReturnType<typeof createThemePlugin>;

const themeKeys = (scale: unknown): string[] =>
  Object.keys((scale ?? {}) as Record<string, string>);

const addedUtilities = (plugin: Plugin): string[] => {
  const classes: string[] = [];
  const handler = plugin.handler as (api: Record<string, unknown>) => void;
  handler({
    addUtilities: (utilities: Record<string, unknown>) =>
      classes.push(...Object.keys(utilities).map((s) => s.slice(1))),
  });
  return classes;
};

const primitives = createPrimitivesPlugin().config?.theme ?? {};
const colors = createThemePlugin(allBrandsCSSTheme).config?.theme ?? {};

const scales: { name: string; utilities: string[]; tokens: string[] }[] = [
  {
    name: 'spacing',
    utilities: ['p', 'px', 'pt', 'm', '-m', 'gap', 'space-x', 'inset'],
    tokens: themeKeys(primitives.spacing),
  },
  {
    name: 'size',
    utilities: ['w', 'h', 'size', 'min-w', 'max-w', 'min-h', 'max-h'],
    tokens: themeKeys(primitives.extend?.size),
  },
  {
    name: 'radius',
    utilities: ['rounded', 'rounded-t', 'rounded-tl'],
    tokens: themeKeys(primitives.borderRadius),
  },
  {
    name: 'backdrop blur',
    utilities: ['backdrop-blur'],
    tokens: themeKeys(primitives.backdropBlur),
  },
  {
    name: 'background color',
    utilities: ['bg', 'from', 'to', 'fill'],
    tokens: themeKeys(colors.backgroundColor),
  },
  {
    name: 'text color',
    utilities: ['text', 'caret', 'placeholder'],
    tokens: themeKeys(colors.textColor),
  },
  {
    name: 'border color',
    utilities: ['border', 'border-t', 'outline', 'ring', 'stroke'],
    tokens: themeKeys(colors.borderColor),
  },
];

const typography = addedUtilities(createTypographyPlugin());
const gradients = addedUtilities(createGradientPlugin(allBrandsCSSTheme));

/** Pairs every class with a sibling, in both orders: the later one must win. */
const unmerged = (classes: string[]): string[] =>
  classes.flatMap((current, i) => {
    const previous = classes[i === 0 ? 1 : 0];
    return [
      [previous, current],
      [current, previous],
    ]
      .filter(([a, b]) => cn(a, b) !== b)
      .map(([a, b]) => `cn('${a}', '${b}') → '${cn(a, b)}'`);
  });

// The preset is the source of truth for Lumen's utilities. These tests read it
// directly, so a new token the cn config cannot merge fails here instead of
// silently keeping both classes and leaving the winner to CSS order.
describe('cn covers every utility the Lumen preset generates', () => {
  describe.each(scales)('$name tokens', ({ utilities, tokens }) => {
    it('reads tokens from the preset', () => {
      expect(tokens.length).toBeGreaterThan(1);
    });

    it.each(utilities)('merges %s-*', (utility) => {
      expect(unmerged(tokens.map((token) => `${utility}-${token}`))).toEqual(
        [],
      );
    });
  });

  describe('typography utilities', () => {
    it('reads utilities from the preset', () => {
      expect(typography.length).toBeGreaterThan(1);
    });

    it('merges with each other', () => {
      expect(unmerged(typography)).toEqual([]);
    });

    it('keeps the text color', () => {
      const kept = typography.filter(
        (name) => cn('text-muted', name) !== `text-muted ${name}`,
      );
      expect(kept).toEqual([]);
    });
  });

  describe('gradient utilities', () => {
    it('reads utilities from the preset', () => {
      expect(gradients.length).toBeGreaterThan(1);
    });

    it('merges with each other', () => {
      expect(unmerged(gradients)).toEqual([]);
    });

    it('keeps the background color', () => {
      const dropped = gradients.filter(
        (name) => cn(name, 'bg-muted') !== `${name} bg-muted`,
      );
      expect(dropped).toEqual([]);
    });
  });
});
