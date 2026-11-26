import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { cssVarNamesTarget } from './cssVarNames.js';

describe('cssVarNamesTarget', () => {
  it('types every primitive, typography and semantic name, not the raw palettes', async () => {
    const [file] = await cssVarNamesTarget('out').emit(createTokenModel());

    expect(file.path).toBe('cssVarName.ts');
    for (const prefix of [
      '--spacing-',
      '--font-style-',
      '--color-background-',
    ]) {
      expect(file.contents).toMatch(new RegExp(`^  \\| '${prefix}`, 'm'));
    }
    expect(file.contents).not.toMatch(/--color-(light|dark)-/);
  });
});
