import { registryPaths, type ConsumerEntry } from './consumers.js';

export type RegistryDiff = {
  newRepos: { repo: string; paths: string[] }[];
  missingRepos: string[];
  /** Registry paths that search no longer finds although the repo still
   * matches — the dependency likely moved to another package.json. */
  stalePaths: { repo: string; path: string; foundPaths: string[] }[];
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

  return { newRepos, missingRepos, stalePaths };
}
