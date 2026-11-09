import { beforeAll, describe, expect, it } from 'vitest';
import { allBrandsCSSTheme, primitivesTheme } from '../generated/css/index.js';
import {
  loadDesignSystem,
  lumenCss,
} from '../tailwind/testing/loadTailwind.js';
import { cn } from './cn.js';

/** `--spacing-16` → `16` for the variables with a prefix, in any layer. */
const keys = (
  layers: Record<string, Record<string, unknown>>,
  prefix: string,
  exclude?: string,
): string[] => [
  ...new Set(
    Object.values(layers).flatMap((layer) =>
      Object.keys(layer)
        .filter((name) => name.startsWith(prefix))
        .filter((name) => !exclude || !name.startsWith(exclude))
        .map((name) => name.slice(prefix.length)),
    ),
  ),
];

const primitives = primitivesTheme as Record<string, Record<string, unknown>>;
const semantic = allBrandsCSSTheme as Record<string, Record<string, unknown>>;

const scales: { name: string; utilities: string[]; tokens: string[] }[] = [
  {
    name: 'spacing',
    utilities: ['p', 'px', 'pt', 'm', '-m', 'gap', 'space-x', 'inset'],
    tokens: keys(primitives, '--spacing-'),
  },
  {
    name: 'size',
    utilities: ['w', 'h', 'size', 'min-w', 'max-w', 'min-h', 'max-h'],
    tokens: keys(primitives, '--size-'),
  },
  {
    name: 'radius',
    utilities: ['rounded', 'rounded-t', 'rounded-tl'],
    tokens: keys(primitives, '--border-radius-'),
  },
  {
    name: 'backdrop blur',
    utilities: ['backdrop-blur'],
    tokens: keys(primitives, '--backdrop-blur-'),
  },
  {
    name: 'background color',
    utilities: ['bg', 'from', 'to', 'fill'],
    tokens: keys(semantic, '--background-'),
  },
  {
    name: 'text color',
    utilities: ['text', 'caret', 'placeholder'],
    tokens: keys(semantic, '--text-'),
  },
  {
    name: 'border color',
    utilities: ['border', 'border-t', 'outline', 'ring', 'stroke'],
    tokens: keys(semantic, '--border-', '--border-width'),
  },
];

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

// The generated tokens and the Tailwind CSS are the source of truth for
// Lumen's utilities. A new token the cn config cannot merge fails here instead
// of silently keeping both classes and leaving the winner to CSS order.
describe('cn covers every utility the Lumen Tailwind CSS generates', () => {
  let typography: string[] = [];
  let gradients: string[] = [];

  beforeAll(async () => {
    const classes = (await loadDesignSystem(lumenCss('all-brands.css')))
      .getClassList()
      .map(([className]) => className);
    typography = classes.filter((name) =>
      /^(heading|body|responsive-display)-\d/.test(name),
    );
    // `bg-gradient-0` and siblings are background colors, not gradients.
    const colors = new Set(
      keys(semantic, '--background-').map((key) => `bg-${key}`),
    );
    gradients = classes.filter(
      (name) => name.startsWith('bg-gradient-') && !colors.has(name),
    );
  });

  describe.each(scales)('$name tokens', ({ utilities, tokens }) => {
    it('reads tokens from the generated CSS', () => {
      expect(tokens.length).toBeGreaterThan(1);
    });

    it.each(utilities)('merges %s-*', (utility) => {
      expect(unmerged(tokens.map((token) => `${utility}-${token}`))).toEqual(
        [],
      );
    });
  });

  describe('typography utilities', () => {
    it('reads utilities from the Tailwind CSS', () => {
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
    it('reads utilities from the Tailwind CSS', () => {
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
