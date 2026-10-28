#!/usr/bin/env node
/**
 * The workspace develops against RN 0.86, but Ledger Wallet Mobile still ships
 * RN 0.81. Rewrite the root manifest to LWM's stack so the `rn-081-compat` job
 * in `pr.yml` can re-run ui-rnative typecheck and tests against it.
 *
 * `npm install --no-save <pkg@version>…` on top of the workspace tree crashes in
 * npm's reify rollback, so the job edits package.json and runs a plain
 * `npm install` instead. The RN sandbox is dropped from the workspaces because
 * it pins RN 0.86 and Expo 57 exactly.
 *
 * Delete this script and the job once LWM is on RN 0.86 (LIVE-39331).
 *
 * Run: node internals/repo-tools/src/ci/rn-081-compat/pinRn081Stack.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ok, step } from '../../shared/logging.mjs';
import { workspaceRoot } from '../../shared/workspaceProjects.mjs';

// Mirrors the `catalog:` in ledger-live's pnpm-workspace.yaml.
export const RN_081_STACK = {
  'react-native': '0.81.6',
  '@react-native/babel-preset': '0.81.6',
  react: '19.1.4',
  'react-dom': '19.1.4',
  'react-test-renderer': '19.1.4',
  '@types/react': '19.0.14',
  'react-native-reanimated': '4.3.4',
  'react-native-worklets': '0.8.1',
  'react-native-gesture-handler': '2.28.0',
  expo: '54.0.33',
  'expo-haptics': '15.0.8',
};

const SANDBOX_WORKSPACES = ['apps/*'];

/**
 * @param {{ devDependencies: Record<string, string>, workspaces: string[] }} manifest
 * @returns {{ devDependencies: Record<string, string>, workspaces: string[] }}
 */
export function pinRn081Stack(manifest) {
  return {
    ...manifest,
    devDependencies: { ...manifest.devDependencies, ...RN_081_STACK },
    workspaces: manifest.workspaces.filter(
      (workspace) => !SANDBOX_WORKSPACES.includes(workspace),
    ),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  step('Pinning the root manifest to the RN 0.81 stack');
  const path = join(workspaceRoot, 'package.json');
  const manifest = JSON.parse(readFileSync(path, 'utf8'));
  writeFileSync(path, `${JSON.stringify(pinRn081Stack(manifest), null, 2)}\n`);
  for (const [name, version] of Object.entries(RN_081_STACK)) {
    ok(`${name}@${version}`);
  }
}
