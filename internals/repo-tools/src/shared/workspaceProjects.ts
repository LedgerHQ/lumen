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

export type Lib = {
  /** folder name under `libs/` */
  slug: string;
  /** path relative to the workspace root */
  dir: string;
  /** npm package name */
  name: string;
  version: string;
  isPrivate: boolean;
};

export function libs(): Lib[] {
  const libsDir = join(workspaceRoot, 'libs');
  if (!existsSync(libsDir)) return [];

  return readdirSync(libsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry): Lib | null => {
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

/** Libs npm would actually accept. `private: true` is the guard, not the folder. */
export function publishableLibs(): Lib[] {
  return libs().filter((lib) => !lib.isPrivate);
}

/**
 * Resolve a published package name back to its lib, for the many CI steps that
 * are handed `@ledgerhq/lumen-*` and need the directory.
 */
export function libByPackageName(packageName: string): Lib | undefined {
  return libs().find((lib) => lib.name === packageName);
}
