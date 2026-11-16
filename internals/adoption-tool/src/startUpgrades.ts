// Entry point of `start-upgrades`: prints the upgrade run matrix for the
// workflow in LedgerHQ/lumen-automation. It starts no run itself.
import { writeFileSync } from 'node:fs';
import { parseCliArgs } from './lib/report/cliArgs.js';
import { loadConsumers } from './lib/shared/consumers.js';
import * as log from './lib/shared/logging.js';
import { buildMatrix } from './lib/upgrade/buildMatrix.js';
import { readLocalVersions } from './lib/upgrade/localVersions.js';

async function main(): Promise<void> {
  const args = parseCliArgs(process.argv.slice(2));

  const matrix = buildMatrix(loadConsumers(), readLocalVersions());
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
