import { readFileSync, writeFileSync } from 'node:fs';
import {
  LUMEN_PACKAGES,
  FAR_BEHIND_THRESHOLD,
  CONSUMERS_DATA_PATH,
  REPORT_MARKDOWN_PATH,
  REPORT_HTML_PATH,
  REPORT_SLACK_PATH,
  type LumenPackage,
} from './config.js';
import { classifyVersion } from './lib/classify.js';
import { parseReportFormat } from './lib/cliArgs.js';
import { packageJsonPathFor, type ConsumerEntry } from './lib/consumers.js';
import { getRepoFileContent } from './lib/github.js';
import * as log from './lib/logging.js';
import { getLatestVersion } from './lib/npmRegistry.js';
import {
  renderMarkdownReport,
  renderHtmlReport,
  renderSlackReport,
  type Cell,
  type ReportRow,
} from './lib/render.js';
import { resolveDependency } from './lib/resolveDependency.js';
import { sortRowsByAdoption } from './lib/sortRows.js';

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

    const packageJsonCache = new Map<string, string | undefined>();
    const cells = {} as Record<LumenPackage, Cell>;
    for (const pkg of LUMEN_PACKAGES) {
      const packageJsonPath = packageJsonPathFor(consumer, pkg);
      if (!packageJsonCache.has(packageJsonPath)) {
        const text = await getRepoFileContent(consumer.repo, packageJsonPath);
        if (text === undefined) {
          log.warn(
            `${consumer.repo}: ${packageJsonPath} not found — update data/consumers.json`,
          );
        }
        packageJsonCache.set(packageJsonPath, text);
      }
      const version = resolveDependency(
        packageJsonCache.get(packageJsonPath),
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
  // --format markdown (default): full table, printed below, for GitHub/PRs.
  // --format summary: the same data as the terse Slack bullet list instead.
  // Either way, all three report files are always written — this only picks
  // what gets printed to stdout.
  const format = parseReportFormat(process.argv.slice(2));

  const { rows, latestVersions } = await buildReport();

  const markdown = renderMarkdownReport(rows, latestVersions);
  const html = renderHtmlReport(rows, latestVersions);
  const slack = renderSlackReport(rows, latestVersions);

  writeFileSync(REPORT_MARKDOWN_PATH, `${markdown}\n`);
  writeFileSync(REPORT_HTML_PATH, html);
  writeFileSync(REPORT_SLACK_PATH, `${slack}\n`);

  log.step(
    `Written ${REPORT_MARKDOWN_PATH}, ${REPORT_HTML_PATH}, ${REPORT_SLACK_PATH}\n`,
  );
  console.log(format === 'summary' ? slack : markdown);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
