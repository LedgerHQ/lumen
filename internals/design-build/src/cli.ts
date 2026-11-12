import { createIconModel, createTokenModel } from '@lumen/design-sources';
import { iconTargets, tokenTargets } from './config.js';
import { checkRendered, isClean } from './core/check.js';
import { isBreaking, markdownReport } from './core/diffReport.js';
import type { Target } from './core/target.js';
import { renderTarget, WORKSPACE_ROOT, writeRendered } from './core/writer.js';
import { publicNamesDiff, sourcesDiff } from './report.js';
import { assertEveryCollectionBuilt } from './tokens/selections.js';

/**
 * `tokens` / `icons`: rebuild that kind's outputs from the committed sources.
 * `check`: fail if any committed output differs from what the sources build
 * (a hand edit, or a source change without a rebuild). Writes nothing.
 * `report --before <dir> [--before-root <dir>] [--fail-on-removal]`: Markdown
 * of what changed since a copy of `internals/design-sources` and, given a
 * checkout of the base branch, in the public names the outputs define; with
 * the flag, removals and renames fail, unless a reviewer approved them.
 */

type Kind = {
  load(): { warnings: string[] };
  targets: Target<never>[];
};

const KINDS: Record<string, Kind> = {
  tokens: {
    load: () => assertEveryCollectionBuilt(createTokenModel()),
    targets: tokenTargets as Target<never>[],
  },
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

if (command === 'report') {
  const args = process.argv.slice(3);
  const before = args[args.indexOf('--before') + 1];
  if (!args.includes('--before') || !before) {
    console.error(
      'Usage: cli.ts report --before <dir> [--before-root <dir>] [--fail-on-removal]',
    );
    process.exit(1);
  }
  const sections = sourcesDiff(before);
  if (args.includes('--before-root')) {
    const beforeRoot = args[args.indexOf('--before-root') + 1];
    sections['Public names'] = publicNamesDiff(beforeRoot, WORKSPACE_ROOT);
  }
  console.log(markdownReport(sections));
  const breaking = Object.values(sections).some(isBreaking);
  if (breaking && args.includes('--fail-on-removal')) {
    console.error(
      'Tokens or icons were removed or renamed: this breaks consumers. Add the `design-sources: approve removals` label once reviewed.',
    );
    process.exit(1);
  }
  process.exit(0);
}

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
