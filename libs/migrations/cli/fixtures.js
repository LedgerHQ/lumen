import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

/** @import { IndexEntry, MigrationIndex } from '../index.d.cts' */

const react = '@ledgerhq/lumen-ui-react';
const native = '@ledgerhq/lumen-ui-rnative';

/** @type {IndexEntry[]} */
export const migrations = [
  {
    id: 'menu-item-on-click',
    title: 'rename MenuItem onSelect',
    pr: 10,
    commit: 'a1',
    introduced: { [react]: '0.1.2' },
    changes: [
      {
        change: 'renamed',
        surface: 'member',
        ref: `${react}#MenuItem.onSelect`,
        to: `${react}#MenuItem.onClick`,
        signal: 'silent',
        detect: [
          {
            pattern: '<MenuItem[^>]*\\bonSelect=',
            in: 'source',
            expect: 'none',
          },
        ],
      },
    ],
  },
  {
    id: 'card-disabled',
    title: 'Card disabled context',
    pr: 20,
    commit: 'b2',
    introduced: { [react]: '0.1.3', [native]: '0.2.0' },
    changes: [
      {
        change: 'changed',
        surface: 'member',
        ref: `${react}#Card.disabled`,
        signal: 'silent',
        detect: [
          {
            pattern: '<Card\\b[^>]*\\bdisabled',
            in: 'source',
            expect: 'review',
          },
        ],
      },
    ],
  },
  {
    id: 'base-ui-required',
    title: null,
    pr: null,
    commit: null,
    introduced: { [react]: null },
    changes: [
      {
        change: 'required',
        surface: 'dependency',
        ref: '@base-ui/react',
        signal: 'loud',
        detect: [
          {
            pattern: '"@radix-ui/react-menu"',
            in: 'manifests',
            expect: 'none',
          },
        ],
      },
    ],
  },
];

/** @type {MigrationIndex} */
export const index = {
  formatVersion: 1,
  packages: [react, native, '@ledgerhq/lumen-utils-shared'],
  migrations,
};

/** @type {string[]} */
const roots = [];

/**
 * @param {Record<string, string>} files Relative path → content.
 * @returns {string}
 */
export function writeTree(files) {
  const root = mkdtempSync(join(tmpdir(), 'lumen-migrations-'));
  roots.push(root);
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

/**
 * A package root with `index.json` and one file per migration.
 * @returns {URL}
 */
export function writePackage() {
  const files = Object.fromEntries(
    migrations.map(({ id }) => [`src/${id}.md`, `---\n---\n\n# ${id}\n`]),
  );
  const root = writeTree({ ...files, 'index.json': JSON.stringify(index) });
  return pathToFileURL(`${root}/`);
}

/** Removes every folder `writeTree` created. */
export function removeTrees() {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
}
