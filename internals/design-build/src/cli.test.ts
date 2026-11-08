import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TOKENS_DIR } from '@lumen/design-sources';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WORKSPACE_ROOT } from './core/writer.js';

const CLI = path.join(import.meta.dirname, 'cli.ts');
const TSX = path.join(WORKSPACE_ROOT, 'node_modules/.bin/tsx');

const run = (...args: string[]): { status: number | null; output: string } => {
  const result = spawnSync(TSX, [CLI, ...args], {
    cwd: WORKSPACE_ROOT,
    encoding: 'utf8',
  });
  return { status: result.status, output: result.stdout + result.stderr };
};

// The removal gate relies on these exit codes: 0 passes the PR, 1 blocks it.
describe('cli report', () => {
  let before: string;

  beforeEach(() => {
    before = mkdtempSync(path.join(os.tmpdir(), 'cli-before-'));
    cpSync(TOKENS_DIR, path.join(before, 'tokens'), { recursive: true });
  });
  afterEach(() => rmSync(before, { recursive: true, force: true }));

  it('passes when nothing was removed', () => {
    const { status, output } = run(
      'report',
      '--before',
      before,
      '--fail-on-removal',
    );

    expect(output).toContain('### Tokens: no change');
    expect(status).toBe(0);
  });

  it('blocks a removal with --fail-on-removal, and only reports it without', () => {
    // The base had a token the working tree lacks: the copy gains one.
    cpSync(
      path.join(TOKENS_DIR, 'code/delay.tokens.json'),
      path.join(before, 'tokens/code/pause.tokens.json'),
    );

    expect(run('report', '--before', before).status).toBe(0);
    const gated = run('report', '--before', before, '--fail-on-removal');
    expect(gated.output).toContain('approve removals');
    expect(gated.status).toBe(1);
  });

  it('explains its usage when --before is missing', () => {
    const { status, output } = run('report');

    expect(output).toContain('Usage: cli.ts report --before <dir>');
    expect(status).toBe(1);
  });
});
