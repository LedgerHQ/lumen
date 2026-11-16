import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

/** @import { Detect } from '../index.d.cts' */

/**
 * @typedef {object} RepoFile
 * @property {string} path Relative to the repo, `/`-separated.
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

const ignoredDirs = new Set(['node_modules', '.git', 'dist', 'build']);

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
 * Outside a git repo. Skips ignored folders without entering them, and builds
 * `/`-separated paths on every platform, like git.
 * @param {string} root
 * @param {string} [prefix]
 * @returns {string[]}
 */
function walkFiles(root, prefix = '') {
  return readdirSync(join(root, prefix), { withFileTypes: true }).flatMap(
    (entry) => {
      const path = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
      if (entry.isDirectory()) {
        return ignoredDirs.has(entry.name) ? [] : walkFiles(root, path);
      }
      return entry.isFile() ? [path] : [];
    },
  );
}

/**
 * @param {string} path
 * @returns {boolean}
 */
function inIgnoredDir(path) {
  return path
    .split('/')
    .slice(0, -1)
    .some((name) => ignoredDirs.has(name));
}

/**
 * Dependencies and build output are skipped even when committed.
 * @param {string} cwd
 * @returns {string[]}
 */
export function listFiles(cwd) {
  try {
    return gitFiles(cwd).filter((path) => !inIgnoredDir(path));
  } catch {
    return walkFiles(cwd);
  }
}

/**
 * @param {string} path
 * @param {Detect['in']} scope
 * @returns {boolean}
 */
export function inScope(path, scope) {
  return scope === 'manifests'
    ? basename(path) === 'package.json'
    : sourceExtensions.has(extname(path)) && !path.endsWith('.d.ts');
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
export function readRepoFiles(cwd) {
  return listFiles(cwd)
    .filter((path) => inScope(path, 'source') || inScope(path, 'manifests'))
    .filter((path) => isFile(join(cwd, path)))
    .map((path) => ({ path, content: readFileSync(join(cwd, path), 'utf8') }));
}
