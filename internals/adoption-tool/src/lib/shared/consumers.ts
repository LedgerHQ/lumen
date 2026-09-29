import { readFileSync } from 'node:fs';
import {
  CONSUMERS_DATA_PATH,
  LUMEN_PACKAGES,
  type LumenPackage,
} from '../../config.js';

export type ConsumerEntry = {
  repo: string;
  /** Default package.json to read a dependency from. */
  packageJsonPath: string;
  /** Per-package override, for monorepos where a Lumen package is declared by
   * one or several workspace package.json files (the worst status wins). */
  packageJsonPaths?: Partial<Record<LumenPackage, string[]>>;
  notes?: string;
};

const ENTRY_KEYS = ['repo', 'packageJsonPath', 'packageJsonPaths', 'notes'];
const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFilePath(value: unknown): value is string {
  return (
    typeof value === 'string' && value.length > 0 && !value.startsWith('/')
  );
}

function validatePackageJsonPaths(value: unknown): string[] {
  if (!isRecord(value)) return ['"packageJsonPaths" must be an object'];

  return Object.entries(value).flatMap(([pkg, paths]) => {
    if (!(LUMEN_PACKAGES as readonly string[]).includes(pkg)) {
      return [`"packageJsonPaths" has unknown package "${pkg}"`];
    }
    if (
      !Array.isArray(paths) ||
      paths.length === 0 ||
      !paths.every(isFilePath)
    ) {
      return [
        `"packageJsonPaths.${pkg}" must be a non-empty array of relative file paths`,
      ];
    }
    return [];
  });
}

function validateEntry(entry: unknown): string[] {
  if (!isRecord(entry)) return ['must be an object'];

  const errors = Object.keys(entry)
    .filter((key) => !ENTRY_KEYS.includes(key))
    .map((key) => `unknown key "${key}"`);

  if (typeof entry.repo !== 'string' || !REPO_PATTERN.test(entry.repo)) {
    errors.push('"repo" must look like "Org/name"');
  }
  if (!isFilePath(entry.packageJsonPath)) {
    errors.push('"packageJsonPath" must be a non-empty relative file path');
  }
  if (entry.packageJsonPaths !== undefined) {
    errors.push(...validatePackageJsonPaths(entry.packageJsonPaths));
  }
  if (entry.notes !== undefined && typeof entry.notes !== 'string') {
    errors.push('"notes" must be a string');
  }
  return errors;
}

/**
 * Validates instead of casting: a typo in the hand-edited registry (a
 * misspelled package key, `packageJsonPth`) would otherwise silently make a
 * package read as `not-used`. Reports every problem at once.
 */
export function parseConsumers(raw: unknown): ConsumerEntry[] {
  if (!Array.isArray(raw)) {
    throw new Error('consumers registry must be a JSON array');
  }

  const errors: string[] = [];
  const seenRepos = new Set<string>();
  raw.forEach((entry: unknown, index) => {
    const label = isRecord(entry) ? String(entry.repo) : `#${index}`;
    errors.push(
      ...validateEntry(entry).map((message) => `${label}: ${message}`),
    );
    if (isRecord(entry) && typeof entry.repo === 'string') {
      if (seenRepos.has(entry.repo)) errors.push(`${label}: duplicate repo`);
      seenRepos.add(entry.repo);
    }
  });

  if (errors.length > 0) {
    throw new Error(
      `Invalid consumers registry:\n${errors.map((error) => `  - ${error}`).join('\n')}`,
    );
  }
  return raw as ConsumerEntry[];
}

export function loadConsumers(path = CONSUMERS_DATA_PATH): ConsumerEntry[] {
  return parseConsumers(JSON.parse(readFileSync(path, 'utf-8')));
}

export function packageJsonPathsFor(
  entry: ConsumerEntry,
  packageName: LumenPackage,
): string[] {
  return entry.packageJsonPaths?.[packageName] ?? [entry.packageJsonPath];
}

export function registryPaths(entry: ConsumerEntry): string[] {
  return [
    ...new Set([
      entry.packageJsonPath,
      ...Object.values(entry.packageJsonPaths ?? {}).flatMap((paths) => paths),
    ]),
  ];
}
