import { LUMEN_PACKAGES, GITHUB_ORG, SOURCE_REPO } from './config.js';
import { diffRegistry } from './lib/discover/discoverDiff.js';
import { loadConsumers } from './lib/shared/consumers.js';
import { searchPackageJsonUsage } from './lib/shared/github.js';
import * as log from './lib/shared/logging.js';

// A big monorepo (ledger-live) can have dozens of workspaces on `catalog:`;
// listing them all buries the few worth a look.
const MAX_UNTRACKED_LISTED = 8;

/**
 * Best-effort refresh check: re-runs the GitHub code search that originally
 * seeded `data/consumers.json` and prints a diff. Never writes the registry
 * itself — code search only indexes default branches and isn't guaranteed
 * exhaustive or stable run-to-run, so new/missing repos and moved paths need
 * a human to confirm before they change the deterministic `report` run.
 */
async function main(): Promise<void> {
  const consumers = loadConsumers();

  log.step(`Searching GitHub code search across org:${GITHUB_ORG}...`);
  const foundPathsByRepo = new Map<string, Set<string>>();
  for (const pkg of LUMEN_PACKAGES) {
    const hits = await searchPackageJsonUsage(GITHUB_ORG, pkg);
    for (const hit of hits) {
      if (hit.repo === SOURCE_REPO) continue;
      const paths = foundPathsByRepo.get(hit.repo) ?? new Set<string>();
      paths.add(hit.path);
      foundPathsByRepo.set(hit.repo, paths);
    }
    log.ok(`${pkg}: ${hits.length} package.json hits`);
  }

  const { newRepos, missingRepos, stalePaths, untrackedPaths } = diffRegistry(
    consumers,
    foundPathsByRepo,
  );
  const untrackedCount = untrackedPaths.reduce(
    (total, { paths }) => total + paths.length,
    0,
  );

  console.log(
    `\n${newRepos.length} new repo(s), ${missingRepos.length} registry repo(s) not re-found, ${stalePaths.length} registry path(s) no longer found, ${untrackedCount} untracked path(s) in known repos.\n`,
  );

  if (newRepos.length > 0) {
    console.log('New — add to data/consumers.json if this is a real consumer:');
    for (const { repo, paths } of newRepos) {
      console.log(`  + ${repo}`);
      for (const path of paths) console.log(`      ${path}`);
    }
  }

  if (missingRepos.length > 0) {
    console.log(
      '\nIn the registry but not re-found — verify before removing (search only covers default branches):',
    );
    for (const repo of missingRepos) {
      console.log(`  - ${repo}`);
    }
  }

  if (stalePaths.length > 0) {
    console.log(
      '\nRegistry path not among the paths search found — the dependency may have moved, review:',
    );
    for (const { repo, path, foundPaths } of stalePaths) {
      console.log(`  ~ ${repo}: ${path}`);
      for (const found of foundPaths) console.log(`      found: ${found}`);
    }
  }

  if (untrackedPaths.length > 0) {
    console.log(
      '\nFound in a tracked repo but not read by the registry — add to packageJsonPaths if that workspace really consumes Lumen:',
    );
    for (const { repo, paths } of untrackedPaths) {
      console.log(`  ? ${repo}`);
      for (const path of paths.slice(0, MAX_UNTRACKED_LISTED)) {
        console.log(`      ${path}`);
      }
      if (paths.length > MAX_UNTRACKED_LISTED) {
        console.log(`      … +${paths.length - MAX_UNTRACKED_LISTED} more`);
      }
    }
  }

  if (
    newRepos.length === 0 &&
    missingRepos.length === 0 &&
    stalePaths.length === 0 &&
    untrackedPaths.length === 0
  ) {
    console.log('No changes detected.');
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
