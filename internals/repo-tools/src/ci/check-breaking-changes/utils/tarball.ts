import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pack } from '../../../shared/pack.ts';
import type { Lib } from '../../../shared/workspaceProjects.ts';

/**
 * Unpacks a tarball as `<side>/node_modules/<name>`, so packages unpacked on
 * the same side import each other instead of the workspace's `libs/`.
 */
function install(tarball: string, side: string, name: string): string {
  const staging = mkdtempSync(join(side, 'unpack-'));
  execFileSync('tar', ['-xzf', tarball, '-C', staging]);
  const root = join(side, 'node_modules', name);
  mkdirSync(dirname(root), { recursive: true });
  renameSync(join(staging, 'package'), root);
  return root;
}

/** Whether `npm pack --json` failed because the package isn't on the registry. */
function isNotFound(error: unknown): boolean {
  const stdout = (error as { stdout?: unknown }).stdout;
  return typeof stdout === 'string' && stdout.includes('"E404"');
}

/** The tarball of a package's `latest` release, or `undefined` when it was never published. */
function packPublished(name: string, into: string): string | undefined {
  try {
    const stdout = execFileSync(
      'npm',
      ['pack', `${name}@latest`, '--pack-destination', into, '--json'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    return join(into, JSON.parse(stdout)[0].filename);
  } catch (error) {
    if (isNotFound(error)) return undefined;
    throw error;
  }
}

/** A package's `latest` release, unpacked on `side`, or `undefined` when it was never published. */
export function installReleased(
  name: string,
  side: string,
): string | undefined {
  mkdirSync(side, { recursive: true });
  const tarball = packPublished(name, side);
  return tarball && install(tarball, side, name);
}

/** A built lib, packed the way npm publishes it and unpacked on `side`. */
export function installBuilt(lib: Lib, side: string): string {
  mkdirSync(side, { recursive: true });
  return install(join(side, pack(lib.dir, side)), side, lib.name);
}
