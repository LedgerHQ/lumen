import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { hexToRgba, tailwindTarget } from './tailwind.js';

describe('hexToRgba', () => {
  it.each([
    ['#0000001a', 'rgba(0, 0, 0, 0.10)'],
    ['#00000040', 'rgba(0, 0, 0, 0.25)'],
    ['#ffffff', 'rgba(255, 255, 255, 1.00)'],
  ])('%s → %s', (hex, rgba) => {
    expect(hexToRgba(hex)).toBe(rgba);
  });
});

describe('tailwindTarget', () => {
  it('emits the typography classes, shadows and motion the plugins read', async () => {
    const files = await tailwindTarget('out').emit(createTokenModel());
    const byPath = Object.fromEntries(files.map((f) => [f.path, f.contents]));

    expect(Object.keys(byPath).sort()).toEqual([
      'index.ts',
      'motion.ts',
      'shadows.ts',
      'typography.ts',
    ]);
    expect(byPath['typography.ts']).toContain('".heading-0-semi-bold": {');
    expect(byPath['typography.ts']).toContain(
      '"font-weight": "var(--font-style-responsive-display-1-weight)"',
    );
    expect(byPath['shadows.ts']).toContain(
      '"--tw-shadow": "0 25px 50px -12px var(--tw-shadow-color, rgba(0, 0, 0, 0.25))"',
    );
    expect(byPath['motion.ts']).toContain(
      '"ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)"',
    );
  });
});
