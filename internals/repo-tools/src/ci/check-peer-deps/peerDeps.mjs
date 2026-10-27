#!/usr/bin/env node
/**
 * Every peer a published lib declares must be in the root devDependencies, and
 * the version the lockfile installs must satisfy the peer range — otherwise we
 * build, test and document against a version we tell consumers they cannot use.
 *
 * Complements syncpack: it keeps each package on a single version, but cannot
 * relate a peer range to the devDependency it is tested with.
 *
 * Run: node internals/repo-tools/src/ci/check-peer-deps/peerDeps.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import semver from 'semver';
import { fail, ok, step } from '../../shared/logging.mjs';
import {
  publishableLibs,
  workspaceRoot,
} from '../../shared/workspaceProjects.mjs';

// Each entry says why, like a syncpack `label`. Bounding a published peer
// narrows what consumers may install, so it waits for a planned release.
/** @type {Record<string, { name: string, reason: string }[]>} */
export const unboundedPeerExceptions = {
  '@ledgerhq/lumen-ui-rnative': [
    {
      name: 'react-native-gesture-handler',
      reason: 'published as >=2.0.0 before this check existed',
    },
    {
      name: 'expo',
      reason:
        'published as >=54.0.0 before this check existed; only sets the SDK floor expo-haptics ~15 needs',
    },
  ],
};

/**
 * @typedef {object} Workspace
 * @property {Record<string, string>} rootDevDependencies
 * @property {Record<string, { version?: string } | undefined>} lockedPackages
 *   the `packages` map of package-lock.json
 */

/**
 * @typedef {{ ok: true, installed: string } | { ok: false, reason: string }} PeerResult
 */

/**
 * A range with no upper bound (`>=2.0.0`, `*`) accepts majors we never tested.
 * @param {string} range
 * @returns {boolean}
 */
export const isUnbounded = (range) => semver.satisfies('99999.0.0', range);

/**
 * @param {string} name
 * @param {string} range
 * @param {Workspace} workspace
 * @param {{ allowUnbounded?: boolean }} [options]
 * @returns {PeerResult}
 */
export function checkPeer(
  name,
  range,
  { rootDevDependencies, lockedPackages },
  { allowUnbounded = false } = {},
) {
  if (!rootDevDependencies[name]) {
    return {
      ok: false,
      reason: `peer ${range} is not in the root devDependencies`,
    };
  }

  // The declared range floor can sit outside the peer range while the
  // installed version does not (or the reverse), so check what CI installs.
  const installed = lockedPackages[`node_modules/${name}`]?.version;
  if (!installed) {
    return {
      ok: false,
      reason: 'not installed at the root of package-lock.json',
    };
  }

  if (!semver.satisfies(installed, range)) {
    return {
      ok: false,
      reason: `installed ${installed} is outside peer ${range}`,
    };
  }

  if (isUnbounded(range) && !allowUnbounded) {
    return { ok: false, reason: `peer ${range} has no upper bound` };
  }
  if (!isUnbounded(range) && allowUnbounded) {
    return {
      ok: false,
      reason: `peer ${range} is bounded now, remove it from unboundedPeerExceptions`,
    };
  }

  return { ok: true, installed };
}

/** @returns {number} how many peers failed */
export function checkPeerDeps() {
  /**
   * @param {string} file
   * @returns {any}
   */
  const readJson = (file) =>
    JSON.parse(readFileSync(join(workspaceRoot, file), 'utf8'));

  /** @type {Workspace} */
  const workspace = {
    rootDevDependencies: readJson('package.json').devDependencies ?? {},
    lockedPackages: readJson('package-lock.json').packages,
  };
  const libs = publishableLibs();
  // Local libs are versioned by nx release, not installed from the registry.
  const localNames = new Set(libs.map((lib) => lib.name));
  let failed = 0;

  for (const lib of libs) {
    /** @type {Record<string, string>} */
    const peers =
      readJson(join(lib.dir, 'package.json')).peerDependencies ?? {};
    if (Object.keys(peers).length === 0) continue;
    step(lib.name);

    for (const [name, range] of Object.entries(peers)) {
      if (localNames.has(name)) continue;

      const result = checkPeer(name, range, workspace, {
        allowUnbounded: unboundedPeerExceptions[lib.name]?.some(
          (exception) => exception.name === name,
        ),
      });
      if (result.ok) {
        ok(`${name} ${result.installed} ∈ ${range}`);
      } else {
        failed += 1;
        fail(`${name}: ${result.reason}`);
      }
    }
  }

  return failed;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const failed = checkPeerDeps();
  if (failed > 0) {
    console.error(`\npeer dependency check failed for ${failed} peer(s).`);
    process.exit(1);
  }
  console.log('\npeer dependency check passed.');
}
