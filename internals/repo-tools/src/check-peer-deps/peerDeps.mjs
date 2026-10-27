#!/usr/bin/env node
/**
 * Every peer a published lib declares must be in the root devDependencies, and
 * the version the lockfile installs must satisfy the peer range — otherwise we
 * build, test and document against a version we tell consumers they cannot use.
 *
 * Complements syncpack: it keeps each package on a single version, but cannot
 * relate a peer range to the devDependency it is tested with.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import semver from 'semver';
import { fail, ok, step } from '../shared/logging.mjs';
import {
  publishableLibs,
  workspaceRoot,
} from '../shared/workspaceProjects.mjs';

/**
 * @param {string} file
 * @returns {any}
 */
const readJson = (file) =>
  JSON.parse(readFileSync(join(workspaceRoot, file), 'utf8'));

/**
 * @param {string} dir
 * @returns {Record<string, Record<string, string> | undefined>}
 */
const readManifest = (dir) => readJson(join(dir, 'package.json'));

const rootDevDependencies = readManifest('.').devDependencies ?? {};
// The range floor can sit outside the peer range while the installed version
// does not (or the reverse), so check what CI actually installs.
/** @type {Record<string, { version?: string } | undefined>} */
const lockedPackages = readJson('package-lock.json').packages;
const libs = publishableLibs();
// Local libs are versioned by nx release, not installed from the registry.
const localNames = new Set(libs.map((lib) => lib.name));
// Published before this check existed. Bounding them narrows what consumers may
// install, so it waits for a planned release rather than a dependency chore.
/** @type {Record<string, string[]>} */
const unboundedPeerExceptions = {
  '@ledgerhq/lumen-ui-rnative': ['react-native-gesture-handler', 'expo'],
};

let failed = 0;

for (const lib of libs) {
  const peers = readManifest(lib.dir).peerDependencies ?? {};
  if (Object.keys(peers).length === 0) continue;
  step(lib.name);

  for (const [name, range] of Object.entries(peers)) {
    if (localNames.has(name)) continue;

    const declared = rootDevDependencies[name];
    if (!declared) {
      failed += 1;
      fail(`${name}: peer ${range} is not in the root devDependencies`);
      continue;
    }

    const installed = lockedPackages[`node_modules/${name}`]?.version;
    if (!installed) {
      failed += 1;
      fail(`${name}: not installed at the root of package-lock.json`);
      continue;
    }

    if (!semver.satisfies(installed, range)) {
      failed += 1;
      fail(`${name}: installed ${installed} is outside peer ${range}`);
      continue;
    }

    // A range with no upper bound (`>=2.0.0`, `*`) accepts majors we never tested.
    if (
      semver.satisfies('99999.0.0', range) &&
      !unboundedPeerExceptions[lib.name]?.includes(name)
    ) {
      failed += 1;
      fail(`${name}: peer ${range} has no upper bound`);
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
