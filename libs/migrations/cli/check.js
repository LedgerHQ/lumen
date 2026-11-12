import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';

/** @import { Detect, IndexEntry } from '../index.d.cts' */

/**
 * @typedef {object} Hit
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

/**
 * @typedef {object} RepoFile
 * @property {string} path
 * @property {string} content
 */

const sourceExtensions = new Set([
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.css',
  '.scss',
  '.mdx',
]);

const ignoredDir = /(^|\/)(node_modules|\.git|dist|build)\//;

/**
 * Tracked and untracked files, minus what `.gitignore` excludes.
 * @param {string} cwd
 * @returns {string[]}
 */
function gitFiles(cwd) {
  const output = execFileSync(
    'git',
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
    {
      cwd,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    },
  );
  return output.split('\0').filter(Boolean);
}

/**
 * Outside a git repo, every file.
 * @param {string} cwd
 * @returns {string[]}
 */
function walkFiles(cwd) {
  return readdirSync(cwd, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(cwd, join(entry.parentPath, entry.name)));
}

/**
 * @param {string} cwd
 * @returns {string[]}
 */
function allFiles(cwd) {
  try {
    return gitFiles(cwd);
  } catch {
    return walkFiles(cwd);
  }
}

/**
 * Dependencies and build output are skipped even when committed.
 * @param {string} cwd
 * @returns {string[]}
 */
export function listFiles(cwd) {
  return allFiles(cwd).filter((path) => !ignoredDir.test(path));
}

/**
 * @param {string} path
 * @param {Detect['in']} scope
 * @returns {boolean}
 */
function inScope(path, scope) {
  return scope === 'manifests'
    ? basename(path) === 'package.json'
    : sourceExtensions.has(extname(path)) && !path.endsWith('.d.ts');
}

/**
 * Patterns run on the whole file: many span lines (`[^>]*` across JSX props).
 * @param {Detect} rule
 * @param {RepoFile} file
 * @returns {Hit[]}
 */
function findHits(rule, file) {
  const regex = new RegExp(rule.pattern, 'g');
  return [...file.content.matchAll(regex)].map((match) => ({
    pattern: rule.pattern,
    expect: rule.expect,
    file: file.path,
    line: file.content.slice(0, match.index).split('\n').length,
    text: match[0].split('\n')[0].trim(),
  }));
}

/**
 * @param {IndexEntry} entry
 * @returns {Detect[]}
 */
function detectRules(entry) {
  return entry.changes.flatMap((change) => change.detect ?? []);
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
 * @returns {MigrationResult}
 */
function checkMigration(entry, files) {
  const hits = detectRules(entry).flatMap((rule) =>
    files
      .filter((file) => inScope(file.path, rule.in))
      .flatMap((file) => findHits(rule, file)),
  );
  return { id: entry.id, title: entry.title, status: statusOf(hits), hits };
}

/**
 * Git still lists files deleted from the working tree, and submodules.
 * @param {string} path
 * @returns {boolean}
 */
function isFile(path) {
  return statSync(path, { throwIfNoEntry: false })?.isFile() ?? false;
}

/**
 * @param {string} cwd
 * @returns {RepoFile[]}
 */
function readRepoFiles(cwd) {
  return listFiles(cwd)
    .filter((path) => inScope(path, 'source') || inScope(path, 'manifests'))
    .filter((path) => isFile(join(cwd, path)))
    .map((path) => ({ path, content: readFileSync(join(cwd, path), 'utf8') }));
}

/**
 * @param {IndexEntry[]} migrations
 * @param {string} cwd
 * @returns {MigrationResult[]}
 */
export function checkMigrations(migrations, cwd) {
  const files = readRepoFiles(cwd);
  return migrations.map((entry) => checkMigration(entry, files));
}
