import { createTokenModel } from '@lumen/design-sources';
import { tokenTargets } from './config.js';
import { checkRendered, isClean } from './core/check.js';
import { renderTarget, writeRendered } from './core/writer.js';

/**
 * `tokens`: rebuild every token output from the committed sources.
 * `check`: fail if any committed output differs from what the sources build
 * (a hand edit, or a source change without a rebuild).
 */
const command = process.argv[2];

const run = async (): Promise<number> => {
  const model = createTokenModel();
  model.warnings.forEach((warning) => console.warn(`⚠️ ${warning}`));

  let failed = false;
  for (const target of tokenTargets) {
    const rendered = await renderTarget(target, model);

    if (command === 'check') {
      const report = checkRendered(target.outDir, rendered);
      if (isClean(report)) {
        console.log(`✅ ${target.name}: ${rendered.size} files up to date`);
        continue;
      }
      failed = true;
      console.error(
        `❌ ${target.name} is out of date with the design sources:`,
      );
      report.changed.forEach((file) => console.error(`  changed  ${file}`));
      report.missing.forEach((file) => console.error(`  missing  ${file}`));
      report.extra.forEach((file) => console.error(`  extra    ${file}`));
    } else {
      const { written, deleted } = writeRendered(target.outDir, rendered);
      console.log(
        `✅ ${target.name}: ${written.length} written, ${deleted.length} deleted, ${rendered.size - written.length} unchanged`,
      );
    }
  }

  if (failed) {
    console.error(
      '\nRun `npx nx run design-build:tokens` and commit the result; never edit generated files by hand.',
    );
    return 1;
  }
  return 0;
};

if (command !== 'tokens' && command !== 'check') {
  console.error('Usage: cli.ts tokens | check');
  process.exit(1);
}

process.exit(await run());
