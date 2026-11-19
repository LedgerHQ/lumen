import { afterAll, describe, expect, it } from 'vitest';
import { checkMigrations } from './check.js';
import { removeTrees, writeTree } from './fixtures.js';

/** @import { IndexEntry } from '../index.d.cts' */

afterAll(removeTrees);

const react = '@ledgerhq/lumen-ui-react';
const native = '@ledgerhq/lumen-ui-rnative';

/**
 * @param {string} ref
 * @returns {IndexEntry['changes'][number]}
 */
const removed = (ref) => ({
  change: 'removed',
  surface: 'export',
  ref,
  signal: 'silent',
  detect: [{ pattern: '<Apex\\b', in: 'source', expect: 'none' }],
});

/** Removed on both platforms, each in its own release. */
const apexRemoved = /** @type {IndexEntry} */ ({
  id: 'apex-removed',
  title: null,
  pr: 1,
  commit: null,
  introduced: { [react]: '0.1.2', [native]: '0.2.0' },
  changes: [removed(`${react}#Apex`), removed(`${native}#Apex`)],
});

const mixedRepo = {
  'src/Web.tsx': `import { Apex } from '${react}';\n<Apex />;\n`,
  'src/Native.tsx': `import { Apex } from '${native}';\n<Apex />;\n`,
  'src/Local.tsx': `import { Apex } from './Apex';\n<Apex />;\n`,
};

/**
 * @param {string | undefined} packageName
 * @returns {string[]}
 */
function hitFiles(packageName) {
  const [result] = checkMigrations(
    [apexRemoved],
    writeTree(mixedRepo),
    packageName,
  );
  return result.hits.map(({ file, ref }) => `${file} ${ref}`).sort();
}

describe('checkMigrations in a web and native repo', () => {
  it('checks only the upgraded package, skipping the other platform', () => {
    expect(hitFiles(react)).toEqual([
      `src/Local.tsx ${react}#Apex`,
      `src/Web.tsx ${react}#Apex`,
    ]);
    expect(hitFiles(native)).toEqual([
      `src/Local.tsx ${native}#Apex`,
      `src/Native.tsx ${native}#Apex`,
    ]);
  });

  it('checks every package without one', () => {
    expect(hitFiles(undefined)).toHaveLength(4);
  });

  it('keeps a rule for a package the migration does not version', () => {
    const entry = { ...apexRemoved, introduced: { [react]: '0.1.2' } };
    const [result] = checkMigrations(
      [entry],
      writeTree({ 'src/Native.tsx': mixedRepo['src/Native.tsx'] }),
      react,
    );
    expect(result.status).toBe('pending');
  });
});
