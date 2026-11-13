import { readFileSync } from 'node:fs';
import semver from 'semver';

/** @import { IndexEntry, MigrationIndex } from '../index.d.cts' */

/**
 * @typedef {object} Range
 * @property {string} [package]
 * @property {string} [from] Installed version, excluded.
 * @property {string} [to] Target version, included.
 */

const packageDir = new URL('..', import.meta.url);

/**
 * @param {URL} [dir]
 * @returns {MigrationIndex}
 */
export function readIndex(dir = packageDir) {
  return JSON.parse(readFileSync(new URL('index.json', dir), 'utf8'));
}

/**
 * The migration file, frontmatter and body.
 * @param {string} id
 * @param {URL} [dir]
 * @returns {string}
 */
export function readMigration(id, dir = packageDir) {
  return readFileSync(new URL(`src/${id}.md`, dir), 'utf8');
}

/**
 * @param {string | null | undefined} version
 * @param {Range} range
 * @returns {boolean}
 */
function versionInRange(version, { from, to }) {
  if (from === undefined && to === undefined) return true;
  if (!version) return false;
  if (from !== undefined && !semver.gt(version, from)) return false;
  return to === undefined || semver.lte(version, to);
}

/**
 * Without a package, `from` and `to` can't apply: Lumen packages don't share
 * version numbers.
 * @param {IndexEntry} entry
 * @param {Range} range
 * @returns {boolean}
 */
export function inRange(entry, range) {
  if (range.package === undefined) return true;
  if (!(range.package in entry.introduced)) return false;
  return versionInRange(entry.introduced[range.package], range);
}

/**
 * @param {MigrationIndex} index
 * @param {Range} range
 * @returns {IndexEntry[]}
 */
export function selectMigrations(index, range) {
  return index.migrations.filter((entry) => inRange(entry, range));
}
