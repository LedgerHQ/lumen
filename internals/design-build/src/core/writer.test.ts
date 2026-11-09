import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  mkdirSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { checkRendered, isClean } from './check.js';
import type { Target } from './target.js';
import { listFiles, renderTarget, writeRendered } from './writer.js';

const target: Target<string[]> = {
  name: 'fake',
  outDir: 'out',
  emit: (names) => names.map((name) => ({ path: name, contents: `${name}\n` })),
};

describe('writer and check', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(path.join(os.tmpdir(), 'design-build-'));
  });
  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it('writes what a target emits and prunes what it stopped emitting', async () => {
    mkdirSync(path.join(root, 'out/old'), { recursive: true });
    writeFileSync(path.join(root, 'out/old/stale.ts'), 'stale');

    const rendered = await renderTarget(target, ['a.ts', 'nested/b.ts'], root);
    const report = writeRendered(target, rendered, root);

    expect(report).toEqual({
      written: ['out/a.ts', 'out/nested/b.ts'],
      deleted: ['out/old/stale.ts'],
    });
    expect(listFiles('out', root).sort()).toEqual([
      'out/a.ts',
      'out/nested/b.ts',
    ]);
    expect(readFileSync(path.join(root, 'out/a.ts'), 'utf8')).toBe('a.ts\n');
  });

  it('never prunes or flags the files a target does not own', async () => {
    const partial: Target<string[]> = {
      ...target,
      owns: (file) => file !== 'lumen.css',
    };
    mkdirSync(path.join(root, 'out'), { recursive: true });
    writeFileSync(path.join(root, 'out/lumen.css'), 'hand-written');
    writeFileSync(path.join(root, 'out/removed-brand.css'), 'stale');

    const rendered = await renderTarget(partial, ['theme.css'], root);
    const { deleted } = writeRendered(partial, rendered, root);

    expect(deleted).toEqual(['out/removed-brand.css']);
    expect(readdirSync(path.join(root, 'out')).sort()).toEqual([
      'lumen.css',
      'theme.css',
    ]);
    expect(isClean(checkRendered(partial, rendered, root))).toBe(true);
  });

  it('only rewrites files whose contents changed', async () => {
    const rendered = await renderTarget(target, ['a.ts'], root);
    writeRendered(target, rendered, root);

    expect(writeRendered(target, rendered, root).written).toEqual([]);
  });

  it('flags hand edits, missing files and leftovers', async () => {
    const rendered = await renderTarget(target, ['a.ts', 'b.ts'], root);
    writeRendered(target, rendered, root);
    writeFileSync(path.join(root, 'out/a.ts'), 'edited by hand');
    rmSync(path.join(root, 'out/b.ts'));
    writeFileSync(path.join(root, 'out/c.ts'), 'leftover');

    const report = checkRendered(target, rendered, root);

    expect(report).toEqual({
      changed: ['out/a.ts'],
      missing: ['out/b.ts'],
      extra: ['out/c.ts'],
    });
    expect(isClean(report)).toBe(false);
    expect(readdirSync(path.join(root, 'out')).sort()).toEqual([
      'a.ts',
      'c.ts',
    ]);
  });

  it('refuses a target that emits the same file twice', async () => {
    await expect(renderTarget(target, ['a.ts', 'a.ts'], root)).rejects.toThrow(
      'emits out/a.ts twice',
    );
  });
});
