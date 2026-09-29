import { readFileSync, writeFileSync } from 'node:fs';
import {
  CATALOG_REPO,
  CONSUMERS_DATA_PATH,
  CROSS_CUTTING_CATALOG_TEAMS,
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
import { getRepoFileContent, listRepoFiles } from './lib/shared/github.js';
import * as log from './lib/shared/logging.js';

type ConsumerEntry = { repo: string };

const CATALOG_FETCH_BATCH = 8;

async function loadCatalogTeams(): Promise<CatalogTeam[]> {
  const files = (await listRepoFiles(CATALOG_REPO)).filter(
    (path) => path.startsWith('domains/') && path.endsWith('.c4'),
  );

  const teams: CatalogTeam[] = [];
  for (let i = 0; i < files.length; i += CATALOG_FETCH_BATCH) {
    const batch = files.slice(i, i + CATALOG_FETCH_BATCH);
    const texts = await Promise.all(
      batch.map((path) => getRepoFileContent(CATALOG_REPO, path)),
    );
    for (const text of texts) {
      if (text) teams.push(...parseCatalogTeams(text));
    }
  }
  return teams;
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
  const consumers = JSON.parse(
    readFileSync(CONSUMERS_DATA_PATH, 'utf-8'),
  ) as ConsumerEntry[];

  log.step(`Reading team catalog from ${CATALOG_REPO}...`);
  const catalog = await loadCatalogTeams();
  log.ok(
    `${catalog.length} teams, ${catalog.filter((team) => team.githubTeams.length > 0).length} with GitHub handles`,
  );

  log.step(`Reading CODEOWNERS for ${consumers.length} consumer repos...`);
  const rows: RepoOwnership[] = [];
  for (const consumer of consumers) {
    const codeowners = await findCodeowners(consumer.repo);
    rows.push(
      buildRepoOwnership(
        consumer.repo,
        codeowners,
        catalog,
        CROSS_CUTTING_CATALOG_TEAMS,
      ),
    );
    log.ok(`${consumer.repo}${codeowners ? '' : ' (no CODEOWNERS)'}`);
  }

  writeFileSync(OWNERS_MARKDOWN_PATH, `${renderOwnersMarkdown(rows)}\n`);
  log.step(`Table written to ${OWNERS_MARKDOWN_PATH}\n`);
  console.log(renderOwnersSummary(rows));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
