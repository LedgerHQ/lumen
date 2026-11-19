import { inScope, readRepoFiles } from './files.js';

/** @import { Detect, IndexEntry } from '../index.d.cts' */
/** @import { RepoFile } from './files.js' */

/**
 * @typedef {Detect & { ref: string, refPackage: string | undefined }} Rule
 */

/**
 * @typedef {object} Hit
 * @property {string} ref The change the pattern detects.
 * @property {string} pattern
 * @property {Detect['expect']} expect
 * @property {string} file Relative to the scanned repo.
 * @property {number} line
 * @property {string} text The first line of the match.
 */

/**
 * @typedef {object} MigrationResult
 * @property {string} id
 * @property {string | null} title
 * @property {'applied' | 'pending' | 'review'} status
 * @property {Hit[]} hits
 */

const lumenPackage = /^@ledgerhq\/lumen-[^/#]+/;

// One platform's API can be valid on the other: a file that only imports the
// other platform is never checked against this one's changes.
const platforms = ['@ledgerhq/lumen-ui-react', '@ledgerhq/lumen-ui-rnative'];

/**
 * @param {IndexEntry} entry
 * @returns {Rule[]}
 */
function rulesOf(entry) {
  return entry.changes.flatMap(({ ref, detect = [] }) =>
    detect.map((rule) => ({
      ...rule,
      ref,
      refPackage: ref.match(lumenPackage)?.[0],
    })),
  );
}

/**
 * Keeps the rules for the upgraded package. A rule for another package that
 * ships the same migration is checked when that package is upgraded; one for
 * an external dependency or an unversioned package always applies.
 * @param {Rule} rule
 * @param {IndexEntry} entry
 * @param {string | undefined} packageName
 * @returns {boolean}
 */
function appliesToUpgrade(rule, entry, packageName) {
  if (packageName === undefined || rule.refPackage === undefined) return true;
  return (
    rule.refPackage === packageName || !(rule.refPackage in entry.introduced)
  );
}

/**
 * @param {Rule} rule
 * @param {RepoFile} file
 * @returns {boolean}
 */
function isOtherPlatformFile(rule, file) {
  const own = rule.refPackage;
  if (own === undefined || !platforms.includes(own)) return false;
  if (file.content.includes(own)) return false;
  return platforms.some((name) => file.content.includes(name));
}

/**
 * Patterns run on the whole file: many span lines (`[^>]*` across JSX props).
 * @param {Rule} rule
 * @param {RepoFile} file
 * @returns {Hit[]}
 */
function findHits(rule, file) {
  const regex = new RegExp(rule.pattern, 'g');
  return [...file.content.matchAll(regex)].map((match) => ({
    ref: rule.ref,
    pattern: rule.pattern,
    expect: rule.expect,
    file: file.path,
    line: file.content.slice(0, match.index).split('\n').length,
    text: match[0].split('\n')[0].trim(),
  }));
}

/**
 * @param {Rule} rule
 * @param {RepoFile[]} files
 * @returns {Hit[]}
 */
function ruleHits(rule, files) {
  return files
    .filter((file) => inScope(file.path, rule.in))
    .filter((file) => !isOtherPlatformFile(rule, file))
    .flatMap((file) => findHits(rule, file));
}

/**
 * `pending` while an old-API pattern still matches; `review` when only
 * `expect: review` patterns do.
 * @param {Hit[]} hits
 * @returns {MigrationResult['status']}
 */
function statusOf(hits) {
  if (hits.some((hit) => hit.expect === 'none')) return 'pending';
  return hits.length > 0 ? 'review' : 'applied';
}

/**
 * @param {IndexEntry} entry
 * @param {RepoFile[]} files
 * @param {string | undefined} packageName
 * @returns {MigrationResult}
 */
function checkMigration(entry, files, packageName) {
  const hits = rulesOf(entry)
    .filter((rule) => appliesToUpgrade(rule, entry, packageName))
    .flatMap((rule) => ruleHits(rule, files));
  return { id: entry.id, title: entry.title, status: statusOf(hits), hits };
}

/**
 * @param {IndexEntry[]} migrations
 * @param {string} cwd
 * @param {string} [packageName] The upgraded package, when one is given.
 * @returns {MigrationResult[]}
 */
export function checkMigrations(migrations, cwd, packageName) {
  const files = readRepoFiles(cwd);
  return migrations.map((entry) => checkMigration(entry, files, packageName));
}
