#!/usr/bin/env node
/**
 * Runs arethetypeswrong on every published lib's tarball: the types each export
 * advertises must resolve for consumers. publint (`check-package-exports`)
 * proves the files ship; this proves TypeScript can follow them.
 *
 * Requires built libs. Run: node internals/repo-tools/src/ci/check-package-types/packageTypes.mjs
 */
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  checkPackage,
  createPackageFromTarballData,
} from '@arethetypeswrong/core';
import {
  problemAffectsResolutionKind,
  problemKindInfo,
} from '@arethetypeswrong/core/problems';
import { allResolutionKinds } from '@arethetypeswrong/core/utils';
import { fail, ok, step } from '../../shared/logging.mjs';
import { pack } from '../../shared/pack.mjs';
import { publishableLibs } from '../../shared/workspaceProjects.mjs';

/**
 * @typedef {import('@arethetypeswrong/core').ResolutionKind} ResolutionKind
 * @typedef {import('@arethetypeswrong/core').Problem} Problem
 * @typedef {import('@arethetypeswrong/core').Analysis} Analysis
 */

/**
 * Skipped for every lib: no consumer resolves with node10 (all use `bundler`,
 * per the adoption registry), and the libs are ESM-only, so a CommonJS
 * `require` can only reach them through a dynamic import.
 * @type {ResolutionKind[]}
 */
export const ignoredForAll = ['node10', 'node16-cjs'];

/**
 * @typedef {object} ResolutionException
 * @property {ResolutionKind[]} [ignoreResolutions]
 * @property {string[]} [excludeEntrypoints]
 * @property {string} reason
 */

const MAX_PRINTED_PROBLEMS = 20;

const extensionlessDeclarations =
  'emitted .d.ts use extensionless relative imports, which node16 ESM cannot follow; remove once the build emits .js extensions';

/**
 * Libs not yet held to node16 ESM. Anything unlisted, including a new lib, is
 * checked on both `bundler` and `node16-esm`.
 * @type {Record<string, ResolutionException>}
 */
export const resolutionExceptions = {
  '@ledgerhq/lumen-ui-react': {
    ignoreResolutions: ['node16-esm'],
    excludeEntrypoints: ['./tailwind.css'],
    reason: `${extensionlessDeclarations}. tailwind.css is a CSS export, not a TypeScript module`,
  },
  '@ledgerhq/lumen-ui-rnative': {
    ignoreResolutions: ['node16-esm'],
    reason: extensionlessDeclarations,
  },
  '@ledgerhq/lumen-utils-shared': {
    ignoreResolutions: ['node16-esm'],
    reason: extensionlessDeclarations,
  },
};

/**
 * @param {string} packageName
 * @returns {{ checkedResolutions: ResolutionKind[], excludeEntrypoints: string[] }}
 */
export function policyFor(packageName) {
  const exception = resolutionExceptions[packageName];
  const ignored = [...ignoredForAll, ...(exception?.ignoreResolutions ?? [])];
  return {
    checkedResolutions: allResolutionKinds.filter(
      (kind) => !ignored.includes(kind),
    ),
    excludeEntrypoints: exception?.excludeEntrypoints ?? [],
  };
}

/**
 * @param {Problem} problem
 * @returns {string}
 */
export function describeProblem(problem) {
  const { title } = problemKindInfo[problem.kind];
  if ('entrypoint' in problem) {
    return `${title}: ${problem.entrypoint} (${problem.resolutionKind})`;
  }
  if (problem.kind === 'InternalResolutionError') {
    return `${title}: '${problem.moduleSpecifier}' in ${problem.fileName} (${problem.resolutionOption})`;
  }
  if ('fileName' in problem) return `${title}: ${problem.fileName}`;
  return `${title}: ${problem.typesFileName}`;
}

/**
 * @param {import('../../shared/workspaceProjects.mjs').Lib} lib
 * @param {string} tarballDir
 * @returns {Promise<string[]>} one message per blocking problem
 */
async function checkLib(lib, tarballDir) {
  const { checkedResolutions, excludeEntrypoints } = policyFor(lib.name);
  const tarball = readFileSync(join(tarballDir, pack(lib.dir, tarballDir)));
  const result = await checkPackage(
    createPackageFromTarballData(new Uint8Array(tarball)),
    { excludeEntrypoints },
  );

  if (!result.types) return ['ships no type declarations'];
  return result.problems
    .filter((problem) =>
      checkedResolutions.some((kind) =>
        problemAffectsResolutionKind(problem, kind, result),
      ),
    )
    .map(describeProblem);
}

async function checkPackageTypes() {
  const tarballDir = mkdtempSync(join(tmpdir(), 'package-types-'));
  let failed = 0;

  step('Checking published types with arethetypeswrong');
  for (const lib of publishableLibs()) {
    const messages = await checkLib(lib, tarballDir);
    if (messages.length === 0) {
      ok(lib.name);
      continue;
    }
    failed += 1;
    fail(lib.name);
    // One bad build setting fails every file (ui-react has ~400 icons), so the
    // first lines are enough to see the pattern.
    for (const message of messages.slice(0, MAX_PRINTED_PROBLEMS)) {
      console.error(`      ${message}`);
    }
    if (messages.length > MAX_PRINTED_PROBLEMS) {
      console.error(
        `      …and ${messages.length - MAX_PRINTED_PROBLEMS} more`,
      );
    }
  }

  return failed;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const failed = await checkPackageTypes();
  if (failed > 0) {
    console.error(`\npackage types check failed for ${failed} package(s).`);
    process.exit(1);
  }
  console.log('\npackage types check passed.');
}
