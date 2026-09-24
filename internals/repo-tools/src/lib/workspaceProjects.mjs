/**
 * Single source for "which libs exist, and which of them ship to npm".
 *
 * Four places used to hardcode that list — the lcov rewrite and the coverage
 * artifact paths in `pr.yml`, the publish loop in `publish-dev-packages.yml`,
 * and `sonar-project.properties`. Read it from here instead.
 *
 * Deliberately filesystem-based rather than shelling out to `nx show projects`:
 * the answer only depends on `libs/*\/package.json`, and staying free of both Nx
 * and node_modules keeps these helpers usable from CI jobs that skip install.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const workspaceRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../..',
);

/**
 * @typedef {object} Lib
 * @property {string} slug      folder name under `libs/`
 * @property {string} dir       path relative to the workspace root
 * @property {string} name      npm package name
 * @property {string} version
 * @property {boolean} isPrivate
 */

/** @returns {Lib[]} */
export function libs() {
  const libsDir = join(workspaceRoot, 'libs');
  if (!existsSync(libsDir)) return [];

  return readdirSync(libsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = `libs/${entry.name}`;
      const manifestPath = join(workspaceRoot, dir, 'package.json');
      if (!existsSync(manifestPath)) return null;
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      return {
        slug: entry.name,
        dir,
        name: manifest.name,
        version: manifest.version,
        isPrivate: manifest.private === true,
      };
    })
    .filter((lib) => lib !== null)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Libs npm would actually accept. `private: true` is the guard, not the folder.
 * @returns {Lib[]}
 */
export function publishableLibs() {
  return libs().filter((lib) => !lib.isPrivate);
}

/**
 * Resolve a published package name back to its lib, for the many CI steps that
 * are handed `@ledgerhq/lumen-*` and need the directory.
 * @param {string} packageName
 * @returns {Lib | undefined}
 */
export function libByPackageName(packageName) {
  return libs().find((lib) => lib.name === packageName);
}
