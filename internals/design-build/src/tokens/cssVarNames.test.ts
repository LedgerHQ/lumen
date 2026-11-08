import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { cssVarNamesTarget } from './cssVarNames.js';

describe('cssVarNamesTarget', () => {
  it('types every primitive, typography and semantic name, not the raw palettes', async () => {
    const [file] = await cssVarNamesTarget('out').emit(createTokenModel());

    expect(file.path).toBe('cssVarName.ts');
    expect(file.contents).toContain(`  | '--spacing-16'`);
    expect(file.contents).toContain(`  | '--font-style-heading-0-size'`);
    expect(file.contents).toContain(`  | '--color-background-canvas'`);
    expect(file.contents).not.toMatch(/--color-(light|dark)-/);
  });
});
