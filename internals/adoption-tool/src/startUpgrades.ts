// Entry point of `start-upgrades`: prints the upgrade run matrix for
// `.github/workflows/lumen-upgrade.yml`. It starts no run itself.
import { writeFileSync } from 'node:fs';
import { LUMEN_PACKAGES, type LumenPackage } from './config.js';
import { parseCliArgs } from './lib/report/cliArgs.js';
import { getLatestVersion } from './lib/report/npmRegistry.js';
import { loadConsumers } from './lib/shared/consumers.js';
import * as log from './lib/shared/logging.js';
import { buildMatrix } from './lib/upgrade/buildMatrix.js';

async function main(): Promise<void> {
  // Prints the run matrix as JSON for `.github/workflows/lumen-upgrade.yml`;
  // --out also writes it to a file. Nothing here starts a run.
  const args = parseCliArgs(process.argv.slice(2));

  log.step('Fetching latest published versions from npm...');
  const targetVersions = Object.fromEntries(
    await Promise.all(
      LUMEN_PACKAGES.map(
        async (pkg) => [pkg, await getLatestVersion(pkg)] as const,
      ),
    ),
  ) as Record<LumenPackage, string>;

  const matrix = buildMatrix(loadConsumers(), targetVersions);
  log.ok(
    `${matrix.upstream.length} upstream, ${matrix.downstream.length} downstream run(s)`,
  );

  const json = JSON.stringify(matrix);
  if (args.out) writeFileSync(args.out, `${json}\n`);
  console.log(json);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
