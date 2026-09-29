const latestVersionCache = new Map<string, string>();

/**
 * Lumen is published to an internal JFrog registry first
 * (`.github/workflows/release-all.yml`), but it's mirrored out to public npm
 * — verified live that `registry.npmjs.org` returns the same `dist-tags`
 * already seen in each lib's package.json, with no auth required. Simpler
 * and more robust than talking to JFrog from every consumer-tracking run.
 */
export async function getLatestVersion(packageName: string): Promise<string> {
  const cached = latestVersionCache.get(packageName);
  if (cached) return cached;

  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  if (!response.ok) {
    throw new Error(
      `npm registry ${packageName}: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as { 'dist-tags'?: { latest?: string } };
  const latest = data['dist-tags']?.latest;
  if (!latest) {
    throw new Error(`npm registry ${packageName}: no "latest" dist-tag`);
  }

  latestVersionCache.set(packageName, latest);
  return latest;
}
