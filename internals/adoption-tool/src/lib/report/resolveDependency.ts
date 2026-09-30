import type { LumenPackage } from '../../config.js';
import {
  extractDependencyValue,
  isCatalogReference,
  catalogNameFromReference,
  stripSemverRangePrefix,
  readYamlScalarPath,
} from './resolveVersion.js';

function readCatalogVersion(
  pnpmWorkspaceYaml: string,
  packageName: LumenPackage,
  catalogName: string | undefined,
): string | undefined {
  const path = catalogName
    ? ['catalogs', catalogName, packageName]
    : ['catalog', packageName];
  const catalogVersion = readYamlScalarPath(pnpmWorkspaceYaml, path);
  return catalogVersion ? stripSemverRangePrefix(catalogVersion) : undefined;
}

/**
 * Returns `undefined` only when the package.json doesn't declare the package
 * (genuinely not used there). A `catalog:` reference is proof of use even when
 * pnpm-workspace.yaml is missing or has no matching entry, so it returns the
 * raw reference instead — which `classifyVersion` reports as `unresolved`.
 * A catalog entry is never consulted without such a declaring reference,
 * since a stale catalog pin doesn't mean anything consumes it.
 */
export function resolveDependency(
  packageJsonText: string | undefined,
  packageName: LumenPackage,
  pnpmWorkspaceYaml: string | undefined,
): string | undefined {
  const rawValue = packageJsonText
    ? extractDependencyValue(packageJsonText, packageName)
    : undefined;
  if (!rawValue) return undefined;
  if (!isCatalogReference(rawValue)) return stripSemverRangePrefix(rawValue);

  const catalogVersion = pnpmWorkspaceYaml
    ? readCatalogVersion(
        pnpmWorkspaceYaml,
        packageName,
        catalogNameFromReference(rawValue),
      )
    : undefined;
  return catalogVersion ?? rawValue;
}
