import { readFileSync } from 'node:fs';
import {
  LUMEN_PACKAGES,
  GITHUB_ORG,
  SOURCE_REPO,
  CONSUMERS_DATA_PATH,
} from './config.js';
import { searchPackageJsonUsage } from './lib/github.js';
import * as log from './lib/logging.js';

type ConsumerEntry = { repo: string };

/**
 * Best-effort refresh check: re-runs the GitHub code search that originally
 * seeded `data/consumers.json` and prints a diff. Never writes the registry
 * itself — code search only indexes default branches and isn't guaranteed
 * exhaustive or stable run-to-run, so new/missing repos need a human to
 * confirm before they become part of the deterministic `report` run.
 */
async function main(): Promise<void> {
  const consumers = JSON.parse(
    readFileSync(CONSUMERS_DATA_PATH, 'utf-8'),
  ) as ConsumerEntry[];
  const knownRepos = new Set(consumers.map((entry) => entry.repo));

  log.step(`Searching GitHub code search across org:${GITHUB_ORG}...`);
  const foundRepoPaths = new Map<string, string>();
  for (const pkg of LUMEN_PACKAGES) {
    const hits = await searchPackageJsonUsage(GITHUB_ORG, pkg);
    for (const hit of hits) {
      if (hit.repo === SOURCE_REPO) continue;
      if (!foundRepoPaths.has(hit.repo)) foundRepoPaths.set(hit.repo, hit.path);
    }
    log.ok(`${pkg}: ${hits.length} package.json hits`);
  }

  const newRepos = [...foundRepoPaths.entries()].filter(
    ([repo]) => !knownRepos.has(repo),
  );
  const missingRepos = [...knownRepos].filter(
    (repo) => !foundRepoPaths.has(repo),
  );

  console.log(
    `\n${newRepos.length} new repo(s) found, ${missingRepos.length} registry repo(s) not re-found by search.\n`,
  );

  if (newRepos.length > 0) {
    console.log('New — add to data/consumers.json if this is a real consumer:');
    for (const [repo, examplePath] of newRepos) {
      console.log(`  + ${repo}  (example path: ${examplePath})`);
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

  if (newRepos.length === 0 && missingRepos.length === 0) {
    console.log('No changes detected.');
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
