import {
  FAR_BEHIND_THRESHOLD,
  LUMEN_PACKAGES,
  type LumenPackage,
} from '../../config.js';
import {
  packageJsonPathsFor,
  type ConsumerEntry,
} from '../shared/consumers.js';
import { classifyVersion } from './classify.js';
import { resolveDependency } from './resolveDependency.js';
import {
  extractDependencyValue,
  isCatalogReference,
} from './resolveVersion.js';
import { worstCell } from './sortRows.js';
import type { Cell, LatestVersions, ReportRow } from './types.js';

/** Resolves to `undefined` when the file doesn't exist; rejects on a real
 * failure (network, rate limit, auth). */
export type FileFetcher = (
  repo: string,
  path: string,
) => Promise<string | undefined>;

function unresolvedReason(dependencyValue: string): string {
  return isCatalogReference(dependencyValue)
    ? `${dependencyValue} not in pnpm catalog`
    : `spec "${dependencyValue}"`;
}

function classifyDependency(
  dependencyValue: string,
  latestVersion: string,
): Cell {
  const { status, patchesBehind } = classifyVersion(
    dependencyValue,
    latestVersion,
    FAR_BEHIND_THRESHOLD,
  );
  if (status === 'unresolved') {
    return { status, reason: unresolvedReason(dependencyValue) };
  }
  return { status, version: dependencyValue, patchesBehind };
}

/**
 * Builds one repo's row. Each file is fetched at most once, and
 * pnpm-workspace.yaml only when a package.json actually declares a
 * `catalog:` reference. A package.json that is missing or unparseable is
 * `unresolved` (with the path), never `not-used` — otherwise a moved file
 * would silently read as "doesn't use Lumen". Fetch failures reject; the
 * caller decides how to isolate them.
 */
export async function buildConsumerRow(
  consumer: ConsumerEntry,
  latestVersions: LatestVersions,
  fetchFile: FileFetcher,
): Promise<ReportRow> {
  const files = new Map<string, Promise<string | undefined>>();
  const readFile = (path: string): Promise<string | undefined> => {
    let pending = files.get(path);
    if (!pending) {
      pending = fetchFile(consumer.repo, path);
      files.set(path, pending);
    }
    return pending;
  };
  const readPnpmWorkspace = (): Promise<string | undefined> =>
    readFile('pnpm-workspace.yaml');

  const resolveCell = async (
    packageName: LumenPackage,
    packageJsonPath: string,
  ): Promise<Cell> => {
    const packageJson = await readFile(packageJsonPath);
    if (packageJson === undefined) {
      return { status: 'unresolved', reason: `${packageJsonPath} not found` };
    }

    let dependencyValue: string | undefined;
    try {
      dependencyValue = extractDependencyValue(packageJson, packageName);
    } catch {
      return {
        status: 'unresolved',
        reason: `${packageJsonPath} is not valid JSON`,
      };
    }
    if (!dependencyValue) return { status: 'not-used' };

    const pnpmWorkspace = isCatalogReference(dependencyValue)
      ? await readPnpmWorkspace()
      : undefined;
    const version =
      resolveDependency(packageJson, packageName, pnpmWorkspace) ??
      dependencyValue;
    return classifyDependency(version, latestVersions[packageName]);
  };

  const entries = await Promise.all(
    LUMEN_PACKAGES.map(async (packageName) => {
      const perPath = await Promise.all(
        packageJsonPathsFor(consumer, packageName).map((path) =>
          resolveCell(packageName, path),
        ),
      );
      return [packageName, worstCell(perPath)] as const;
    }),
  );

  return {
    repo: consumer.repo,
    cells: Object.fromEntries(entries) as Record<LumenPackage, Cell>,
  };
}

/** A row for a repo we couldn't read at all, so the report still lists it
 * (as the worst tier) instead of silently dropping it. */
export function failedConsumerRow(repo: string): ReportRow {
  const cell: Cell = { status: 'unresolved', reason: 'fetch failed' };
  return {
    repo,
    cells: Object.fromEntries(
      LUMEN_PACKAGES.map((packageName) => [packageName, cell]),
    ) as Record<LumenPackage, Cell>,
  };
}
