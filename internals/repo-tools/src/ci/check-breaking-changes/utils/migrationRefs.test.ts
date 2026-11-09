import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ApiChange } from '../apiDiff.ts';
import { migrationRefs, uncovered } from './migrationRefs.ts';

const removed = (ref: string): ApiChange => ({
  change: 'removed',
  surface: 'export',
  ref,
});

describe('migrationRefs', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'migration-refs-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('reads the refs of every migration file', () => {
    writeFileSync(
      join(dir, 'a.md'),
      "---\nchanges:\n  - ref: 'pkg#A'\n  - ref: 'pkg#B'\n---\n# A\n",
    );
    writeFileSync(
      join(dir, 'notes.txt'),
      "---\nchanges:\n  - ref: 'pkg#C'\n---\n",
    );

    expect(migrationRefs(dir)).toEqual(['pkg#A', 'pkg#B']);
  });

  it('ignores files without frontmatter', () => {
    writeFileSync(join(dir, 'a.md'), '# No frontmatter\n');

    expect(migrationRefs(dir)).toEqual([]);
  });
});

describe('uncovered', () => {
  it('keeps the changes no ref matches exactly', () => {
    const changes = [removed('pkg#Button.size=xs'), removed('pkg#Button.size')];

    expect(uncovered(changes, ['pkg#Button.size=xs'])).toEqual([
      removed('pkg#Button.size'),
    ]);
  });

  it('lets `*` match any text', () => {
    const changes = [
      removed('pkg#themes.dark.bg.error'),
      removed('pkg#themes.light.bg.error'),
      removed('pkg#themes.light.bg.muted'),
    ];

    expect(uncovered(changes, ['pkg#themes.*.bg.error'])).toEqual([
      removed('pkg#themes.light.bg.muted'),
    ]);
  });

  it('treats other regex characters literally', () => {
    expect(uncovered([removed('pkg#AxB')], ['pkg#A.B'])).toHaveLength(1);
  });
});
