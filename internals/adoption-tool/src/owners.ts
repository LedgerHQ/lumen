import { writeFileSync } from 'node:fs';
import {
  CATALOG_REPO,
  CROSS_CUTTING_CATALOG_TEAMS,
  GITHUB_CONCURRENCY,
  OWNERS_MARKDOWN_PATH,
} from './config.js';
import { parseCatalogTeams, type CatalogTeam } from './lib/owners/catalog.js';
import { CODEOWNERS_PATHS } from './lib/owners/codeowners.js';
import {
  buildRepoOwnership,
  type RepoOwnership,
} from './lib/owners/ownership.js';
import {
  renderOwnersMarkdown,
  renderOwnersSummary,
} from './lib/owners/renderOwners.js';
import { mapWithConcurrency } from './lib/shared/concurrency.js';
import { loadConsumers } from './lib/shared/consumers.js';
import { getRepoFileContent, listRepoFiles } from './lib/shared/github.js';
import * as log from './lib/shared/logging.js';

async function loadCatalogTeams(): Promise<CatalogTeam[]> {
  const files = (await listRepoFiles(CATALOG_REPO)).filter(
    (path) => path.startsWith('domains/') && path.endsWith('.c4'),
  );

  const texts = await mapWithConcurrency(files, GITHUB_CONCURRENCY, (path) =>
    getRepoFileContent(CATALOG_REPO, path),
  );
  return texts.flatMap((text) => (text ? parseCatalogTeams(text) : []));
}

async function findCodeowners(
  repo: string,
): Promise<{ path: string; text: string } | undefined> {
  for (const path of CODEOWNERS_PATHS) {
    const text = await getRepoFileContent(repo, path);
    if (text !== undefined) return { path, text };
  }
  return undefined;
}

/**
 * Maps each tracked consumer repo to its owners by combining the
 * architecture-as-code catalog (team ↔ repo links, team ↔ GitHub handles)
 * with the repo's own CODEOWNERS. Read-only: the catalog is the source of
 * truth for teams, and consumer repos stay the source of truth for who owns
 * them, so nothing here is written back to `data/consumers.json`.
 */
async function main(): Promise<void> {
  const consumers = loadConsumers();

  log.step(`Reading team catalog from ${CATALOG_REPO}...`);
  const catalog = await loadCatalogTeams();
  log.ok(
    `${catalog.length} teams, ${catalog.filter((team) => team.githubTeams.length > 0).length} with GitHub handles`,
  );

  log.step(`Reading CODEOWNERS for ${consumers.length} consumer repos...`);
  const failedRepos: string[] = [];
  const results = await mapWithConcurrency(
    consumers,
    GITHUB_CONCURRENCY,
    async ({ repo }): Promise<RepoOwnership | undefined> => {
      try {
        const codeowners = await findCodeowners(repo);
        log.ok(`${repo}${codeowners ? '' : ' (no CODEOWNERS)'}`);
        return buildRepoOwnership(
          repo,
          codeowners,
          catalog,
          CROSS_CUTTING_CATALOG_TEAMS,
        );
      } catch (error) {
        // Left out rather than shown as "unowned": a failed lookup says
        // nothing about who owns the repo.
        failedRepos.push(repo);
        log.warn(
          `${repo}: ${error instanceof Error ? error.message : String(error)}`,
        );
        return undefined;
      }
    },
  );
  const rows = results.filter((row): row is RepoOwnership => row !== undefined);

  writeFileSync(OWNERS_MARKDOWN_PATH, `${renderOwnersMarkdown(rows)}\n`);
  log.step(`Table written to ${OWNERS_MARKDOWN_PATH}\n`);
  console.log(renderOwnersSummary(rows));

  if (failedRepos.length > 0) {
    log.warn(
      `${failedRepos.length} repo(s) could not be read and are missing above: ${failedRepos.join(', ')}`,
    );
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
