import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { filesUnder } from './files.ts';

type Manifest = {
  exports?: Record<string, unknown>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
};

/** The parsed `package.json` of an unpacked package. */
export function readManifest(root: string): Manifest {
  return JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
}

/** Peers a consumer may leave uninstalled. */
export function optionalPeers(root: string): string[] {
  const meta = readManifest(root).peerDependenciesMeta ?? {};
  return Object.keys(meta)
    .filter((peer) => meta[peer]?.optional === true)
    .sort();
}

/** The `types` path of an `exports` target, if it has one. */
function typesPath(target: unknown): string | undefined {
  const types =
    typeof target === 'object' && target !== null
      ? (target as { types?: unknown }).types
      : undefined;
  return typeof types === 'string' ? types : undefined;
}

/** Entry point → its `.d.ts`, from `exports`. */
export function typeEntries(root: string): Record<string, string> {
  const { exports = {} } = readManifest(root);
  return Object.fromEntries(
    Object.entries(exports).flatMap(([key, target]) => {
      const path = typesPath(target);
      return path === undefined || key.includes('*')
        ? []
        : [[key, resolve(root, path)]];
    }),
  );
}

/** The subpaths one `./key/*` → `./dir/*.ext` export serves. */
function wildcardSubpaths(root: string, key: string, target: string): string[] {
  const [dir, suffix = ''] = target.split('*');
  const base = resolve(root, dir);
  if (!existsSync(base)) return [];
  return filesUnder(base)
    .filter((path) => path.endsWith(suffix))
    .map((path) =>
      key.replace(
        '*',
        path.slice(base.length + 1, path.length - suffix.length),
      ),
    );
}

/** Subpaths served by wildcard exports (`./symbols/apex.svg`). */
export function wildcardFiles(root: string): string[] {
  const { exports = {} } = readManifest(root);
  return Object.entries(exports)
    .filter(([key, target]) => key.includes('*') && typeof target === 'string')
    .flatMap(([key, target]) => wildcardSubpaths(root, key, target as string))
    .sort();
}
