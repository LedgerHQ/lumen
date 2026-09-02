#!/usr/bin/env node
/**
 * Verifies that every path a published package advertises is actually inside
 * its tarball.
 *
 * This catches a failure mode nothing else in CI does. `vite-plugin-dts` emits
 * a declaration for every file in the TypeScript program, while rollup emits
 * JS only for modules reachable from a declared entry — so an `exports` key can
 * resolve for `types` and yet have no runtime behind it. tsc stays green, the
 * IDE autocompletes, `nx build` exits 0, the package publishes, and the
 * consumer gets ERR_MODULE_NOT_FOUND on first import.
 *
 * `npm pack --dry-run` is the source of truth here rather than the filesystem,
 * because it also applies the `files` allowlist: a target that exists on disk
 * but is filtered out of the tarball fails just as hard for a consumer.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const libsDir = 'libs';
const libs = readdirSync(libsDir).filter((name) =>
  existsSync(join(libsDir, name, 'package.json')),
);

/** Every relative file path advertised by the package, from any export condition. */
const collectTargets = (node, out = new Set()) => {
  if (typeof node === 'string') {
    if (node.startsWith('./')) out.add(node);
    return out;
  }
  if (node && typeof node === 'object') {
    for (const value of Object.values(node)) collectTargets(value, out);
  }
  return out;
};

let failed = 0;

for (const lib of libs) {
  const dir = join(libsDir, lib);
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8'));
  if (pkg.private) continue;

  const advertised = collectTargets(pkg.exports);
  for (const field of ['main', 'module', 'types', 'react-native']) {
    if (typeof pkg[field] === 'string' && pkg[field].startsWith('./')) {
      advertised.add(pkg[field]);
    }
  }
  if (advertised.size === 0) continue;

  let packed;
  try {
    packed = JSON.parse(
      execFileSync('npm', ['pack', '--dry-run', '--json'], {
        cwd: dir,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }),
    );
  } catch {
    console.error(`  ✗ ${pkg.name}: npm pack failed — is the package built?`);
    failed += 1;
    continue;
  }

  const shipped = packed[0].files.map((f) => f.path);
  const shippedSet = new Set(shipped);

  // A pattern target (`"./symbols/*"`) is satisfied by at least one match --
  // which is also how a wildcard whose whole target tree was never emitted
  // gets caught, rather than passing because it names no concrete file.
  const isMissing = (target) => {
    if (!target.includes('*')) return !shippedSet.has(target);
    const re = new RegExp(
      '^' + target.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$',
    );
    return !shipped.some((f) => re.test(f));
  };

  const missing = [...advertised]
    .map((t) => t.replace(/^\.\//, ''))
    .filter(isMissing);

  if (missing.length > 0) {
    console.error(`  ✗ ${pkg.name} advertises paths absent from its tarball:`);
    for (const m of missing) console.error(`      ${m}`);
    failed += 1;
  } else {
    console.log(`  ✓ ${pkg.name} — ${advertised.size} advertised paths all shipped`);
  }
}

if (failed > 0) {
  console.error(`\npackage exports check failed for ${failed} package(s).`);
  process.exit(1);
}
console.log('\npackage exports check passed.');
