import { createIconModel, createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { iconTargets, tokenTargets } from './config.js';
import { checkRendered } from './core/check.js';
import type { Target } from './core/target.js';
import { renderTarget } from './core/writer.js';

/** The same guarantee as \`design-build:check\`, run with the tests. */
describe('committed outputs', () => {
  const cases = [
    ...tokenTargets.map(
      (target) => [target.name, target, createTokenModel] as const,
    ),
    ...iconTargets.map(
      (target) => [target.name, target, createIconModel] as const,
    ),
  ];

  it.each(cases)(
    '%s matches what the sources build',
    async (_, target, load) => {
      const rendered = await renderTarget(
        target as Target<never>,
        load() as never,
      );

      expect(checkRendered(target, rendered)).toEqual({
        changed: [],
        missing: [],
        extra: [],
      });
    },
    120_000,
  );
});
