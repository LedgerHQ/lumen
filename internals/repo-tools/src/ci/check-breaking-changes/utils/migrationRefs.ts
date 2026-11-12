import { existsSync, readFileSync } from 'node:fs';
import semver from 'semver';
import type { ApiChange } from '../apiDiff.ts';

export type Migration = {
  /** Package → first version that ships the change, `null` until released. */
  introduced: Record<string, string | null>;
  changes: { ref: string }[];
};

/** The migrations listed in `@ledgerhq/lumen-migrations`' built `index.json`. */
export function readMigrations(indexPath: string): Migration[] {
  if (!existsSync(indexPath)) {
    throw new Error(
      `${indexPath} is missing: run \`npx nx run @ledgerhq/lumen-migrations:build\` first.`,
    );
  }
  return JSON.parse(readFileSync(indexPath, 'utf8')).migrations;
}

/** Whether a migration ships in `name` after `released`, or isn't released yet. */
function isPending(
  migration: Migration,
  name: string,
  released: string,
): boolean {
  if (!(name in migration.introduced)) return false;
  const version = migration.introduced[name];
  return version === null || semver.gt(version, released);
}

/**
 * Refs that can cover `name`'s changes since its `released` version: only
 * those of migrations not shipped yet, so a released wildcard ref doesn't
 * excuse future breaks.
 */
export function pendingRefs(
  migrations: Migration[],
  name: string,
  released: string,
): string[] {
  return migrations
    .filter((migration) => isPending(migration, name, released))
    .flatMap((migration) => migration.changes.map((change) => change.ref));
}

/** A ref as a full-match pattern, where `*` stands for any text. */
function refPattern(ref: string): RegExp {
  const escaped = ref.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replaceAll('*', '.*')}$`);
}

/** The changes no migration ref matches. */
export function uncovered(changes: ApiChange[], refs: string[]): ApiChange[] {
  const patterns = refs.map(refPattern);
  return changes.filter(
    (change) => !patterns.some((pattern) => pattern.test(change.ref)),
  );
}
