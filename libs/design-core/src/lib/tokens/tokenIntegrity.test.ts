import { describe, expect, it } from 'vitest';
import { themeCss } from './testing/themeCss.js';

// The one mistake no other check sees: a scheme wired to the other scheme's
// primitives still builds, types and matches its own regenerated output.
describe('ledger-live.css color schemes', () => {
  const { ':root': light, '.dark': dark } = themeCss('ledger-live.css');

  it('builds light from the light primitives', () => {
    expect(light['--color-background-canvas']).toMatch(
      /^var\(--color-light-.+\)$/,
    );
  });

  it('builds dark from the dark primitives', () => {
    expect(dark['--color-background-canvas']).toMatch(
      /^var\(--color-dark-.+\)$/,
    );
  });
});
