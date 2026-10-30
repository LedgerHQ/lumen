#!/usr/bin/env node
/**
 * Every peer a published lib declares must be a root devDependency whose
 * installed version satisfies the peer range, or we test against a version
 * consumers are told they cannot use. syncpack cannot relate the two.
 *
 * Run: node internals/repo-tools/src/ci/check-peer-deps/peerDeps.ts
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import semver from 'semver';
import { fail, ok, step } from '../../shared/logging.ts';
import {
  publishableLibs,
  workspaceRoot,
} from '../../shared/workspaceProjects.ts';

// Bounding a published peer narrows what consumers may install, so it waits
// for a planned release.
export const unboundedPeerExceptions: Record<
  string,
  { name: string; reason: string }[]
> = {
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

type Workspace = {
  rootDevDependencies: Record<string, string>;
  /** the `packages` map of package-lock.json */
  lockedPackages: Record<string, { version?: string } | undefined>;
};

type PeerResult =
  | { ok: true; installed: string }
  | { ok: false; reason: string };

export const isUnbounded = (range: string): boolean =>
  semver.satisfies('99999.0.0', range);

export function checkPeer(
  name: string,
  range: string,
  { rootDevDependencies, lockedPackages }: Workspace,
  { allowUnbounded = false }: { allowUnbounded?: boolean } = {},
): PeerResult {
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

/** @returns how many peers failed */
export function checkPeerDeps(): number {
  const readJson = (file: string) =>
    JSON.parse(readFileSync(join(workspaceRoot, file), 'utf8'));

  const workspace: Workspace = {
    rootDevDependencies: readJson('package.json').devDependencies ?? {},
    lockedPackages: readJson('package-lock.json').packages,
  };
  const libs = publishableLibs();
  // Local libs are versioned by nx release, not installed from the registry.
  const localNames = new Set(libs.map((lib) => lib.name));
  let failed = 0;

  for (const lib of libs) {
    const peers: Record<string, string> =
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
