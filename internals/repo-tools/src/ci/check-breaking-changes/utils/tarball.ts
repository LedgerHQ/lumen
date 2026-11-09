import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pack } from '../../../shared/pack.ts';

/** Extracts a tarball into `into` and returns the package root. */
function unpack(tarball: string, into: string): string {
  mkdirSync(into, { recursive: true });
  execFileSync('tar', ['-xzf', tarball, '-C', into]);
  return join(into, 'package');
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
  } catch {
    return undefined;
  }
}

/** The unpacked `latest` release of a package, or `undefined` when it was never published. */
export function releasedRoot(name: string, into: string): string | undefined {
  mkdirSync(into, { recursive: true });
  const tarball = packPublished(name, into);
  return tarball && unpack(tarball, join(into, 'unpacked'));
}

/** A built lib, packed and unpacked the way npm publishes it. */
export function builtRoot(dir: string, into: string): string {
  mkdirSync(into, { recursive: true });
  return unpack(join(into, pack(dir, into)), join(into, 'unpacked'));
}
