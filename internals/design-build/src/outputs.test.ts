import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { tokenTargets } from './config.js';
import { checkRendered } from './core/check.js';
import { renderTarget } from './core/writer.js';

/** The same guarantee as `design-build:check`, run with the tests. */
describe('committed outputs', () => {
  it.each(tokenTargets.map((target) => [target.name, target] as const))(
    '%s matches what the sources build',
    async (_, target) => {
      const rendered = await renderTarget(target, createTokenModel());

      expect(checkRendered(target.outDir, rendered)).toEqual({
        changed: [],
        missing: [],
        extra: [],
      });
    },
    60_000,
  );
});
