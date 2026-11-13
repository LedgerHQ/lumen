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
import { manifestVersion } from './utils/manifest.ts';
import {
  type Migration,
  pendingRefs,
  readMigrations,
  uncovered,
} from './utils/migrationRefs.ts';
import { installBuilt, installReleased } from './utils/tarball.ts';

const migrationsIndex = join(workspaceRoot, 'libs/migrations/index.json');

type Roots = { released: string | undefined; built: string };

/**
 * Unpacks every lib's latest release on one side and its build on the other,
 * so a release's types import the released siblings, and a build's the built ones.
 */
function installAll(libs: Lib[], tmp: string): Map<Lib, Roots> {
  return new Map(
    libs.map((lib) => [
      lib,
      {
        released: installReleased(lib.name, join(tmp, 'released')),
        built: installBuilt(lib, join(tmp, 'built')),
      },
    ]),
  );
}

/**
 * What a built lib breaks since its last release and no unreleased migration
 * covers, or `undefined` when it was never released.
 */
function unmigrated(
  lib: Lib,
  { released, built }: Roots,
  migrations: Migration[],
): ApiChange[] | undefined {
  if (released === undefined) return undefined;
  const changes = diffSurfaces(
    lib.name,
    readSurface(released),
    readSurface(built),
  );
  const refs = pendingRefs(migrations, lib.name, manifestVersion(released));
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
  const migrations = readMigrations(migrationsIndex);
  const tmp = workspaceTempDir('breaking-changes-');
  step('Checking breaking changes since the last release have a migration');
  try {
    const roots = installAll(publishableLibs(), tmp);
    const failed = [...roots].map(([lib, libRoots]) =>
      report(lib, unmigrated(lib, libRoots, migrations)),
    );
    return failed.filter(Boolean).length;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (checkBreakingChanges() > 0) {
    console.error(
      '\nAdd a migration in libs/migrations/src whose `changes[].ref` matches each line above (`*` matches any text). Released migrations no longer count. See libs/migrations/README.md.',
    );
    process.exit(1);
  }
  info('\nEvery breaking change has a migration.');
}
