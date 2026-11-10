import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { fail, info, ok, skip, step } from '../../shared/logging.ts';
import {
  type Lib,
  publishableLibs,
  workspaceRoot,
} from '../../shared/workspaceProjects.ts';
import { type ApiChange, diffSurfaces } from './apiDiff.ts';
import { readSurface } from './apiSurface.ts';
import { workspaceTempDir } from './utils/files.ts';
import { migrationRefs, uncovered } from './utils/migrationRefs.ts';
import { builtRoot, releasedRoot } from './utils/tarball.ts';

const migrationsDir = join(workspaceRoot, 'libs/migrations/src');

/**
 * What a built lib breaks since its last release and no migration covers, or
 * `undefined` when it was never released.
 */
function unmigrated(
  lib: Lib,
  refs: string[],
  tmp: string,
): ApiChange[] | undefined {
  const released = releasedRoot(lib.name, join(tmp, lib.slug, 'released'));
  if (released === undefined) return undefined;
  const built = builtRoot(lib.dir, join(tmp, lib.slug, 'built'));
  const changes = diffSurfaces(
    lib.name,
    readSurface(released),
    readSurface(built),
  );
  return uncovered(changes, refs);
}

/** One change as a line: `removed export @scope/pkg#Name`. */
function describeChange({ change, surface, ref, detail }: ApiChange): string {
  return [change, surface, ref, detail && `(${detail})`]
    .filter(Boolean)
    .join(' ');
}

/** Prints one lib's result and returns whether it fails. */
function report(lib: Lib, changes: ApiChange[] | undefined): boolean {
  if (changes === undefined) skip(`${lib.name}: never released`);
  else if (changes.length === 0) ok(lib.name);
  else {
    fail(lib.name);
    changes.forEach((change) =>
      console.error(`      ${describeChange(change)}`),
    );
  }
  return changes !== undefined && changes.length > 0;
}

/** Checks every built lib and returns how many break without a migration. */
function checkBreakingChanges(): number {
  const refs = migrationRefs(migrationsDir);
  const tmp = workspaceTempDir('breaking-changes-');
  step('Checking breaking changes since the last release have a migration');
  try {
    return publishableLibs().filter((lib) =>
      report(lib, unmigrated(lib, refs, tmp)),
    ).length;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (checkBreakingChanges() > 0) {
    console.error(
      '\nAdd a migration in libs/migrations/src whose `changes[].ref` matches each line above (`*` matches any text). See libs/migrations/README.md.',
    );
    process.exit(1);
  }
  info('\nEvery breaking change has a migration.');
}
