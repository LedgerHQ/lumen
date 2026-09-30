const CATALOG_PREFIX = 'catalog:';

type PackageJsonDeps = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

/** Reads a package's dependency range as declared in package.json, checking
 * `dependencies` before `devDependencies`/`peerDependencies` (a consumer app
 * always wants the runtime dependency, not an incidental peer range). */
export function extractDependencyValue(
  packageJsonText: string,
  packageName: string,
): string | undefined {
  const packageJson = JSON.parse(packageJsonText) as PackageJsonDeps;
  return (
    packageJson.dependencies?.[packageName] ??
    packageJson.devDependencies?.[packageName] ??
    packageJson.peerDependencies?.[packageName]
  );
}

export function isCatalogReference(dependencyValue: string): boolean {
  return dependencyValue.startsWith(CATALOG_PREFIX);
}

/** `"catalog:"` is the default (unnamed) catalog; `"catalog:react18"` names one. */
export function catalogNameFromReference(
  dependencyValue: string,
): string | undefined {
  const name = dependencyValue.slice(CATALOG_PREFIX.length).trim();
  return name.length > 0 ? name : undefined;
}

export function stripSemverRangePrefix(dependencyValue: string): string {
  return dependencyValue.trim().replace(/^[\^~]/, '');
}

/**
 * Reads a scalar at a dotted key path out of a pnpm-workspace.yaml, e.g.
 * `['catalog', '@ledgerhq/lumen-ui-react']` or
 * `['catalogs', 'react18', 'react']`. Handles only the flat, consistently
 * 2-space-indented mapping shape pnpm-workspace.yaml catalogs actually use in
 * this org (verified against ledger-live/ledger-button) — not general YAML
 * (no anchors, flow style, or multi-document files).
 */
export function readYamlScalarPath(
  yamlText: string,
  path: string[],
): string | undefined {
  const lines = yamlText.split('\n');
  let searchFrom = 0;
  let expectedIndent = 0;

  for (let segmentIndex = 0; segmentIndex < path.length; segmentIndex += 1) {
    const segment = path[segmentIndex];
    const isLastSegment = segmentIndex === path.length - 1;
    let matchedLineIndex = -1;

    for (let lineIndex = searchFrom; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('#')) continue;

      const indent = line.length - line.trimStart().length;
      if (indent < expectedIndent) break; // left the parent block entirely
      if (indent !== expectedIndent) continue;

      const keyValueMatch = trimmed.match(/^["']?([^"':]+)["']?:\s*(.*)$/);
      if (!keyValueMatch) continue;
      const [, key, rest] = keyValueMatch;
      if (key !== segment) continue;

      if (isLastSegment) {
        const value = rest
          .split('#')[0]
          .trim()
          .replace(/^["']|["']$/g, '');
        return value.length > 0 ? value : undefined;
      }

      matchedLineIndex = lineIndex;
      break;
    }

    if (matchedLineIndex === -1) return undefined;
    searchFrom = matchedLineIndex + 1;
    expectedIndent += 2;
  }

  return undefined;
}
