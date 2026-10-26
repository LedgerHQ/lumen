#!/usr/bin/env node
/**
 * Every peer a published lib declares must be installed in the root
 * devDependencies, at a version its peer range accepts — otherwise we build,
 * test and document against a version we tell consumers they cannot use.
 *
 * Complements syncpack: it keeps each package on a single version, but cannot
 * relate a peer range to the devDependency it is tested with.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import semver from 'semver';
import { fail, ok, step } from '../../lib/logging.mjs';
import {
  publishableLibs,
  workspaceRoot,
} from '../../lib/workspaceProjects.mjs';

/**
 * @param {string} dir
 * @returns {Record<string, Record<string, string> | undefined>}
 */
const readManifest = (dir) =>
  JSON.parse(readFileSync(join(workspaceRoot, dir, 'package.json'), 'utf8'));

const rootDevDependencies = readManifest('.').devDependencies ?? {};
const libs = publishableLibs();
// Local libs are versioned by nx release, not installed from the registry.
const localNames = new Set(libs.map((lib) => lib.name));

let failed = 0;

for (const lib of libs) {
  const peers = readManifest(lib.dir).peerDependencies ?? {};
  if (Object.keys(peers).length === 0) continue;
  step(lib.name);

  for (const [name, range] of Object.entries(peers)) {
    if (localNames.has(name)) continue;

    const installed = rootDevDependencies[name];
    if (!installed) {
      failed += 1;
      fail(`${name}: peer ${range} is not in the root devDependencies`);
      continue;
    }

    const version = semver.minVersion(installed);
    if (!version || !semver.satisfies(version, range)) {
      failed += 1;
      fail(`${name}: root devDependency ${installed} is outside peer ${range}`);
      continue;
    }

    ok(`${name} ${installed} ∈ ${range}`);
  }
}

if (failed > 0) {
  console.error(`\npeer dependency check failed for ${failed} peer(s).`);
  process.exit(1);
}
console.log('\npeer dependency check passed.');
