#!/usr/bin/env node
/**
 * Runs publint on every published lib. publint packs with npm and checks that
 * advertised `exports` / `main` / `types` paths actually ship in the tarball —
 * including glob targets and the `files` allowlist.
 *
 * `--level error` matches the previous custom check: missing or unpublished
 * entrypoints fail CI; packaging suggestions (license, engines, nested
 * package.json) stay out of the gate.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { publint } from 'publint';
import { formatMessage } from 'publint/utils';

const libs = readdirSync('libs').filter((name) =>
  existsSync(join('libs', name, 'package.json')),
);

let failed = 0;

for (const lib of libs) {
  const pkgDir = join('libs', lib);
  const manifest = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf-8'));
  if (manifest.private) continue;

  const { messages, pkg } = await publint({
    pkgDir,
    pack: 'npm',
    level: 'error',
  });

  if (messages.length === 0) {
    console.log(`  ✓ ${pkg.name}`);
    continue;
  }

  failed += 1;
  console.error(`  ✗ ${pkg.name}`);
  for (const msg of messages) {
    const formatted = formatMessage(msg, pkg, { color: false });
    if (formatted) console.error(`      ${formatted}`);
  }
}

if (failed > 0) {
  console.error(`\npublint failed for ${failed} package(s).`);
  process.exit(1);
}
console.log('\npackage exports check passed.');
