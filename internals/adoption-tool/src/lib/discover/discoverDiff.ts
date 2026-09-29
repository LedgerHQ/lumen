import { registryPaths, type ConsumerEntry } from '../shared/consumers.js';

export type RegistryDiff = {
  newRepos: { repo: string; paths: string[] }[];
  missingRepos: string[];
  /** Registry paths that search no longer finds although the repo still
   * matches — the dependency likely moved to another package.json. */
  stalePaths: { repo: string; path: string; foundPaths: string[] }[];
  /** Paths search found in a tracked repo that the registry doesn't read —
   * another workspace may have started depending on Lumen. */
  untrackedPaths: { repo: string; paths: string[] }[];
};

export function diffRegistry(
  consumers: ConsumerEntry[],
  foundPathsByRepo: Map<string, Set<string>>,
): RegistryDiff {
  const knownRepos = new Set(consumers.map((entry) => entry.repo));

  const newRepos = [...foundPathsByRepo.entries()]
    .filter(([repo]) => !knownRepos.has(repo))
    .map(([repo, paths]) => ({ repo, paths: [...paths].sort() }));

  const missingRepos = consumers
    .map((entry) => entry.repo)
    .filter((repo) => !foundPathsByRepo.has(repo));

  const stalePaths = consumers.flatMap((entry) => {
    const found = foundPathsByRepo.get(entry.repo);
    if (!found) return [];
    return registryPaths(entry)
      .filter((path) => !found.has(path))
      .map((path) => ({
        repo: entry.repo,
        path,
        foundPaths: [...found].sort(),
      }));
  });

  const untrackedPaths = consumers.flatMap((entry) => {
    const found = foundPathsByRepo.get(entry.repo);
    if (!found) return [];
    const tracked = new Set(registryPaths(entry));
    const paths = [...found].filter((path) => !tracked.has(path)).sort();
    return paths.length > 0 ? [{ repo: entry.repo, paths }] : [];
  });

  return { newRepos, missingRepos, stalePaths, untrackedPaths };
}
