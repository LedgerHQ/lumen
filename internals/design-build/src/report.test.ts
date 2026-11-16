import { cpSync, mkdtempSync, rmSync, unlinkSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TOKENS_DIR } from '@lumen/design-sources';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isBreaking } from './core/diffReport.js';
import { sourcesDiff, tokenEntries } from './report.js';

describe('sourcesDiff', () => {
  let before: string;

  beforeEach(() => {
    before = mkdtempSync(path.join(os.tmpdir(), 'sources-before-'));
    cpSync(TOKENS_DIR, path.join(before, 'tokens'), { recursive: true });
  });
  afterEach(() => rmSync(before, { recursive: true, force: true }));

  it('reports nothing when the sources did not change', () => {
    const { Tokens } = sourcesDiff(before);

    expect(isBreaking(Tokens)).toBe(false);
    expect(Tokens.changed).toEqual([]);
  });

  it('only diffs the kinds the copy holds', () => {
    expect(Object.keys(sourcesDiff(before))).toEqual(['Tokens']);
  });
});

describe('tokenEntries', () => {
  it('counts a mode that disappeared as removals, which break consumers', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'sources-after-'));
    cpSync(TOKENS_DIR, dir, { recursive: true });
    unlinkSync(path.join(dir, 'figma/4.breakpoint.2xl.tokens.json'));

    const removed = [...tokenEntries(TOKENS_DIR).keys()].filter(
      (id) => !tokenEntries(dir).has(id),
    );

    expect(removed.length).toBeGreaterThan(0);
    expect(removed.every((id) => id.startsWith('breakpoint/2xl/'))).toBe(true);
    rmSync(dir, { recursive: true, force: true });
  });
});
