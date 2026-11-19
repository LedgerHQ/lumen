import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TOKENS_DIR } from '@lumen/design-sources';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isBreaking } from './core/diffReport.js';
import { WORKSPACE_ROOT } from './core/writer.js';
import {
  publicNameEntries,
  publicNamesDiff,
  sourcesDiff,
  tokenEntries,
} from './report.js';

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

describe('publicNamesDiff', () => {
  // A checkout root with the two files public names come from.
  const outputsRoot = (extra: Record<string, unknown> = {}): string => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'outputs-'));
    mkdirSync(path.join(root, 'internals/design-build/generated'), {
      recursive: true,
    });
    writeFileSync(
      path.join(root, 'internals/design-build/generated/code-syntax.json'),
      JSON.stringify({
        '2.theme': {
          'background/canvas/default': {
            WEB: 'var(--background-canvas);',
            iOS: 't.colors.bg.canvas',
            ANDROID: 't.colors.bg.canvas',
          },
          ...extra,
        },
      }),
    );
    return root;
  };
  const roots: string[] = [];
  const root = (extra?: Record<string, unknown>): string => {
    roots.push(outputsRoot(extra));
    return roots[roots.length - 1];
  };
  afterEach(() => {
    for (const dir of roots.splice(0))
      rmSync(dir, { recursive: true, force: true });
  });

  it('reads CSS variables and React Native paths', () => {
    expect(Object.fromEntries(publicNameEntries(root()))).toEqual({
      '--background-canvas': 'css',
      't.colors.bg.canvas': 'react-native',
    });
  });

  it('reads the committed code syntax', () => {
    expect(publicNameEntries(WORKSPACE_ROOT).get('--background-canvas')).toBe(
      'css',
    );
  });

  it('flags a name the outputs no longer define, though no source token changed', () => {
    const before = root({
      'background/legacy': {
        WEB: 'var(--background-legacy);',
        iOS: 't.colors.bg.legacy',
        ANDROID: 't.colors.bg.legacy',
      },
    });

    const diff = publicNamesDiff(before, root());

    expect(diff.removed).toEqual(['--background-legacy', 't.colors.bg.legacy']);
    expect(isBreaking(diff)).toBe(true);
  });

  it('skips what the base branch did not have yet', () => {
    const empty = mkdtempSync(path.join(os.tmpdir(), 'outputs-none-'));
    roots.push(empty);

    expect(publicNameEntries(empty).size).toBe(0);
  });
});
