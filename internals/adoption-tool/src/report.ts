import { writeFileSync } from 'node:fs';
import {
  GITHUB_CONCURRENCY,
  LUMEN_PACKAGES,
  REPORT_MARKDOWN_PATH,
  REPORT_HTML_PATH,
  REPORT_SLACK_PATH,
  REPORT_JSON_PATH,
  type LumenPackage,
} from './config.js';
import {
  buildConsumerRow,
  failedConsumerRow,
} from './lib/report/buildConsumerRow.js';
import { parseReportFormat, type ReportFormat } from './lib/report/cliArgs.js';
import { getLatestVersion } from './lib/report/npmRegistry.js';
import {
  renderMarkdownReport,
  renderHtmlReport,
  renderJsonReport,
  renderSlackReport,
} from './lib/report/render.js';
import { sortRowsByAdoption } from './lib/report/sortRows.js';
import type { LatestVersions, ReportRow } from './lib/report/types.js';
import { mapWithConcurrency } from './lib/shared/concurrency.js';
import { loadConsumers } from './lib/shared/consumers.js';
import { getRepoFileContent } from './lib/shared/github.js';
import * as log from './lib/shared/logging.js';

type RepoFailure = { repo: string; message: string };

async function fetchLatestVersions(): Promise<LatestVersions> {
  const entries = await Promise.all(
    LUMEN_PACKAGES.map(
      async (pkg) => [pkg, await getLatestVersion(pkg)] as const,
    ),
  );
  for (const [pkg, version] of entries) log.ok(`${pkg} → ${version}`);
  return Object.fromEntries(entries) as Record<LumenPackage, string>;
}

/**
 * One unreadable repo (transient GitHub failure, revoked access) must not
 * throw away the other rows: it becomes an `unresolved` row and is reported
 * in `failures`, so the caller can still publish the rest and exit non-zero.
 */
async function buildReport(): Promise<{
  rows: ReportRow[];
  latestVersions: LatestVersions;
  failures: RepoFailure[];
}> {
  const consumers = loadConsumers();

  log.step('Fetching latest published versions from npm...');
  const latestVersions = await fetchLatestVersions();

  log.step(`Resolving versions for ${consumers.length} consumer repos...`);
  const failures: RepoFailure[] = [];
  const rows = await mapWithConcurrency(
    consumers,
    GITHUB_CONCURRENCY,
    async (consumer) => {
      try {
        const row = await buildConsumerRow(
          consumer,
          latestVersions,
          getRepoFileContent,
        );
        log.ok(consumer.repo);
        return row;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push({ repo: consumer.repo, message });
        log.warn(`${consumer.repo}: ${message}`);
        return failedConsumerRow(consumer.repo);
      }
    },
  );

  return { rows: sortRowsByAdoption(rows), latestVersions, failures };
}

async function main(): Promise<void> {
  // --format only picks what is printed to stdout (markdown table by default,
  // the Slack bullet list for `summary`, the machine-readable snapshot for
  // `json`); every report file is always written.
  const format = parseReportFormat(process.argv.slice(2));

  const { rows, latestVersions, failures } = await buildReport();

  const outputs: Record<ReportFormat, string> = {
    markdown: renderMarkdownReport(rows, latestVersions),
    summary: renderSlackReport(rows, latestVersions),
    json: renderJsonReport(rows, latestVersions, new Date()),
  };
  const html = renderHtmlReport(rows, latestVersions);

  writeFileSync(REPORT_MARKDOWN_PATH, `${outputs.markdown}\n`);
  writeFileSync(REPORT_HTML_PATH, html);
  writeFileSync(REPORT_SLACK_PATH, `${outputs.summary}\n`);
  writeFileSync(REPORT_JSON_PATH, `${outputs.json}\n`);

  log.step(
    `Written ${REPORT_MARKDOWN_PATH}, ${REPORT_HTML_PATH}, ${REPORT_SLACK_PATH}, ${REPORT_JSON_PATH}\n`,
  );
  console.log(outputs[format]);

  if (failures.length > 0) {
    log.warn(
      `${failures.length} repo(s) could not be read and are shown as unresolved: ${failures.map(({ repo }) => repo).join(', ')}`,
    );
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
