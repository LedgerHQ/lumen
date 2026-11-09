import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadTokenSources } from './load.js';
import { checkDtcgStandard } from './standard.js';

describe('checkDtcgStandard', () => {
  it('finds nothing to report in the committed sources', async () => {
    expect(await checkDtcgStandard()).toEqual([]);
  });

  it('reports forms the standard deprecates', async () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'dtcg-'));
    mkdirSync(path.join(dir, 'figma'));
    writeFileSync(
      path.join(dir, 'figma', '1.legacy.tokens.json'),
      JSON.stringify({
        old: { $type: 'color', $value: '#ffffff' },
      }),
    );

    const problems = await checkDtcgStandard(loadTokenSources(dir), dir);

    expect(problems.join('\n')).toMatch(/string colors will be deprecated/);
    rmSync(dir, { recursive: true, force: true });
  });
});
