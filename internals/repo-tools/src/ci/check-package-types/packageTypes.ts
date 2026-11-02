#!/usr/bin/env node
/**
 * Runs arethetypeswrong on every published lib's tarball: the types each export
 * advertises must resolve for consumers. publint (`check-package-exports`)
 * proves the files ship; this proves TypeScript can follow them.
 *
 * Requires built libs. Run: node internals/repo-tools/src/ci/check-package-types/packageTypes.ts
 */
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  checkPackage,
  createPackageFromTarballData,
  type Problem,
  type ResolutionKind,
} from '@arethetypeswrong/core';
import {
  problemAffectsResolutionKind,
  problemKindInfo,
} from '@arethetypeswrong/core/problems';
import { allResolutionKinds } from '@arethetypeswrong/core/utils';
import { fail, ok, step } from '../../shared/logging.ts';
import { pack } from '../../shared/pack.ts';
import { publishableLibs, type Lib } from '../../shared/workspaceProjects.ts';

/**
 * Skipped for every lib: no consumer resolves with node10 (all use `bundler`,
 * per the adoption registry), and the libs are ESM-only, so a CommonJS
 * `require` can only reach them through a dynamic import.
 */
export const ignoredForAll: ResolutionKind[] = ['node10', 'node16-cjs'];

type ResolutionException = {
  ignoreResolutions?: ResolutionKind[];
  excludeEntrypoints?: string[];
  reason: string;
};

const MAX_PRINTED_PROBLEMS = 20;

const extensionlessDeclarations =
  'emitted .d.ts use extensionless relative imports, which node16 ESM cannot follow; remove once the build emits .js extensions';

/**
 * Libs not yet held to node16 ESM. Anything unlisted, including a new lib, is
 * checked on both `bundler` and `node16-esm`.
 */
export const resolutionExceptions: Record<string, ResolutionException> = {
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

export function policyFor(packageName: string): {
  checkedResolutions: ResolutionKind[];
  excludeEntrypoints: string[];
} {
  const exception = resolutionExceptions[packageName];
  const ignored = [...ignoredForAll, ...(exception?.ignoreResolutions ?? [])];
  return {
    checkedResolutions: allResolutionKinds.filter(
      (kind) => !ignored.includes(kind),
    ),
    excludeEntrypoints: exception?.excludeEntrypoints ?? [],
  };
}

export function describeProblem(problem: Problem): string {
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

/** @returns one message per blocking problem */
async function checkLib(lib: Lib, tarballDir: string): Promise<string[]> {
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

/** @returns how many packages failed */
async function checkPackageTypes(): Promise<number> {
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
