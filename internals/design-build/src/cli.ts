import { createIconModel, createTokenModel } from '@lumen/design-sources';
import { iconTargets, tokenTargets } from './config.js';
import { checkRendered, isClean } from './core/check.js';
import type { Target } from './core/target.js';
import { renderTarget, writeRendered } from './core/writer.js';

/**
 * `tokens` / `icons`: rebuild that kind's outputs from the committed sources.
 * `check`: fail if any committed output differs from what the sources build
 * (a hand edit, or a source change without a rebuild). Writes nothing.
 */

type Kind = {
  load(): { warnings: string[] };
  targets: Target<never>[];
};

const KINDS: Record<string, Kind> = {
  tokens: { load: createTokenModel, targets: tokenTargets as Target<never>[] },
  icons: { load: createIconModel, targets: iconTargets as Target<never>[] },
};

const build = async (kind: Kind, check: boolean): Promise<boolean> => {
  const model = kind.load();
  model.warnings.forEach((warning) => console.warn(`⚠️ ${warning}`));

  let clean = true;
  for (const target of kind.targets) {
    const rendered = await renderTarget(target, model as never);

    if (!check) {
      const { written, deleted } = writeRendered(target, rendered);
      console.log(
        `✅ ${target.name}: ${written.length} written, ${deleted.length} deleted, ${rendered.size - written.length} unchanged`,
      );
      continue;
    }

    const report = checkRendered(target, rendered);
    if (isClean(report)) {
      console.log(`✅ ${target.name}: ${rendered.size} files up to date`);
      continue;
    }
    clean = false;
    console.error(`❌ ${target.name} is out of date with the design sources:`);
    report.changed.forEach((file) => console.error(`  changed  ${file}`));
    report.missing.forEach((file) => console.error(`  missing  ${file}`));
    report.extra.forEach((file) => console.error(`  extra    ${file}`));
  }
  return clean;
};

const command = process.argv[2];

if (command === 'check') {
  let clean = true;
  for (const kind of Object.values(KINDS)) {
    clean = (await build(kind, true)) && clean;
  }
  if (!clean) {
    console.error(
      '\nRun `npx nx run design-build:tokens` / `:icons` and commit the result; never edit generated files by hand.',
    );
  }
  process.exit(clean ? 0 : 1);
}

const kind = KINDS[command];
if (!kind) {
  console.error('Usage: cli.ts tokens | icons | check');
  process.exit(1);
}
await build(kind, false);
