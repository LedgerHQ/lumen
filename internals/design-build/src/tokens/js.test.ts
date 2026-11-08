import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { jsTarget } from './js.js';

describe('jsTarget', () => {
  it('emits the shared primitives, one module per brand and the barrel', async () => {
    const files = await jsTarget('out').emit(createTokenModel());

    expect(files.map(({ path }) => path)).toEqual([
      'primitives.ts',
      'enterprise.ts',
      'ledger-live.ts',
      'websites.ts',
      'index.ts',
    ]);
    expect(files.at(-1)?.contents).toContain(
      "export * from './ledger-live.js';",
    );
  });

  it('writes the crypto gradients once and points every brand at them', async () => {
    const files = await jsTarget('out').emit(createTokenModel());

    expect(files[0].contents).toContain(
      'export const primitiveGradientTokens = {',
    );
    expect(files[1].contents).toContain(
      '"gradients": { "crypto": primitiveGradientTokens.light.crypto }',
    );
  });

  it('keeps React Native values that wait for a design decision', async () => {
    const files = await jsTarget('out').emit(createTokenModel());
    const primitives = files[0].contents;

    expect(primitives).toMatch(/"blur": \{[^}]*"lg": 64/);
  });
});
