import type { LumenPackage } from '../../config.js';

export type ConsumerEntry = {
  repo: string;
  /** Default package.json to read a dependency from. */
  packageJsonPath: string;
  /** Per-package override, for monorepos where each Lumen package is declared
   * by a different workspace package.json. */
  packageJsonPaths?: Partial<Record<LumenPackage, string>>;
  notes?: string;
};

export function packageJsonPathFor(
  entry: ConsumerEntry,
  packageName: LumenPackage,
): string {
  return entry.packageJsonPaths?.[packageName] ?? entry.packageJsonPath;
}

export function registryPaths(entry: ConsumerEntry): string[] {
  return [
    ...new Set([
      entry.packageJsonPath,
      ...Object.values(entry.packageJsonPaths ?? {}),
    ]),
  ];
}
