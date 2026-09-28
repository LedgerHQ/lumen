import { readFileSync, writeFileSync } from 'node:fs';
import {
  LUMEN_PACKAGES,
  FAR_BEHIND_THRESHOLD,
  CONSUMERS_DATA_PATH,
  REPORT_MARKDOWN_PATH,
  REPORT_HTML_PATH,
  type LumenPackage,
} from './config.js';
import { classifyVersion } from './lib/classify.js';
import { getRepoFileContent } from './lib/github.js';
import * as log from './lib/logging.js';
import { getLatestVersion } from './lib/npmRegistry.js';
import {
  renderMarkdownReport,
  renderHtmlReport,
  type Cell,
  type ReportRow,
} from './lib/render.js';
import {
  extractDependencyValue,
  isCatalogReference,
  catalogNameFromReference,
  stripSemverRangePrefix,
  readYamlScalarPath,
} from './lib/resolveVersion.js';
import { sortRowsByAdoption } from './lib/sortRows.js';

type ConsumerEntry = {
  repo: string;
  packageJsonPath: string;
  notes?: string;
};

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
 * Resolves one package's version for a repo. The anchor package.json is only
 * where we *start* looking, not the only source of truth: in a pnpm-catalog
 * monorepo (e.g. ledger-live), the anchor file may legitimately not declare
 * every Lumen package (design-core at the root, ui-react three levels down
 * in a feature package) even though the whole repo shares one pinned version
 * via the default catalog — so an anchor miss falls back to checking the
 * default catalog directly before concluding the package truly isn't used.
 */
async function resolveDependencyVersion(
  repo: string,
  packageJsonPath: string,
  packageName: LumenPackage,
  pnpmWorkspaceYaml: string | undefined,
): Promise<string | undefined> {
  const packageJsonText = await getRepoFileContent(repo, packageJsonPath);
  const rawValue = packageJsonText
    ? extractDependencyValue(packageJsonText, packageName)
    : undefined;

  if (rawValue && !isCatalogReference(rawValue)) {
    return stripSemverRangePrefix(rawValue);
  }

  if (!pnpmWorkspaceYaml) return undefined;

  if (rawValue) {
    return readCatalogVersion(
      pnpmWorkspaceYaml,
      packageName,
      catalogNameFromReference(rawValue),
    );
  }

  // Anchor didn't declare this package at all — see if the repo's default
  // catalog pins it anyway (a different package.json in the monorepo uses it).
  return readCatalogVersion(pnpmWorkspaceYaml, packageName, undefined);
}

async function buildReport(): Promise<{
  rows: ReportRow[];
  latestVersions: Record<LumenPackage, string>;
}> {
  const consumers = JSON.parse(
    readFileSync(CONSUMERS_DATA_PATH, 'utf-8'),
  ) as ConsumerEntry[];

  log.step('Fetching latest published versions from npm...');
  const latestVersions = {} as Record<LumenPackage, string>;
  for (const pkg of LUMEN_PACKAGES) {
    latestVersions[pkg] = await getLatestVersion(pkg);
    log.ok(`${pkg} → ${latestVersions[pkg]}`);
  }

  log.step(`Resolving versions for ${consumers.length} consumer repos...`);
  const rows: ReportRow[] = [];
  for (const consumer of consumers) {
    // Fetched once per repo (not per package): repos without a pnpm catalog
    // simply get `undefined` here and every lookup falls through to the
    // anchor package.json's explicit version, as usual.
    const pnpmWorkspaceYaml = await getRepoFileContent(
      consumer.repo,
      'pnpm-workspace.yaml',
    );

    const cells = {} as Record<LumenPackage, Cell>;
    for (const pkg of LUMEN_PACKAGES) {
      const version = await resolveDependencyVersion(
        consumer.repo,
        consumer.packageJsonPath,
        pkg,
        pnpmWorkspaceYaml,
      );
      if (!version) {
        cells[pkg] = { status: 'not-used' };
        continue;
      }
      const classification = classifyVersion(
        version,
        latestVersions[pkg],
        FAR_BEHIND_THRESHOLD,
      );
      cells[pkg] = {
        status: classification.status,
        version,
        patchesBehind: classification.patchesBehind,
      };
    }
    rows.push({ repo: consumer.repo, cells });
    log.ok(consumer.repo);
  }

  return { rows: sortRowsByAdoption(rows), latestVersions };
}

async function main(): Promise<void> {
  const { rows, latestVersions } = await buildReport();

  const markdown = renderMarkdownReport(rows, latestVersions);
  const html = renderHtmlReport(rows, latestVersions);

  writeFileSync(REPORT_MARKDOWN_PATH, `${markdown}\n`);
  writeFileSync(REPORT_HTML_PATH, html);

  log.step(`Written ${REPORT_MARKDOWN_PATH} and ${REPORT_HTML_PATH}\n`);
  console.log(markdown);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
