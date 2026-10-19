#!/usr/bin/env node
// Print the dependencies matching a regex for every production consumer's Lumen
// workspace(s), read through the GitHub API (no clone). Output: TSV
// `repo<TAB>file<TAB>name=version ...`. Needs an authenticated `gh`.
//
// Usage: node scan-manifests.mjs '<dependency-name regex>'
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  encoding: 'utf8',
}).trim();
const registry = JSON.parse(
  readFileSync(
    join(root, 'internals/adoption-tool/data/consumers.json'),
    'utf8',
  ),
);
const match = new RegExp(process.argv[2] ?? '^@ledgerhq/lumen-');

/** @param {string} repo @param {string} path @returns {string | null} */
const readFile = (repo, path) => {
  try {
    const b64 = execFileSync(
      'gh',
      ['api', `repos/${repo}/contents/${path}`, '-q', '.content'],
      {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    );
    return Buffer.from(b64, 'base64').toString('utf8');
  } catch {
    return null;
  }
};

for (const entry of registry.filter((e) => e.status === 'production')) {
  const paths = new Set([
    entry.packageJsonPath,
    ...Object.values(entry.packageJsonPaths ?? {}).flat(),
  ]);
  for (const path of paths) {
    const raw = readFile(entry.repo, path);
    if (!raw) {
      console.log(`${entry.repo}\t${path}\tFETCH_FAILED`);
      continue;
    }
    const pkg = JSON.parse(raw);
    const deps = {
      ...pkg.peerDependencies,
      ...pkg.devDependencies,
      ...pkg.dependencies,
    };
    const hits = Object.entries(deps)
      .filter(([name]) => match.test(name))
      .map(([name, version]) => `${name}=${version}`);
    console.log(`${entry.repo}\t${path}\t${hits.join(' ')}`);
  }
  // pnpm catalogs pin the real versions; `catalog:` in package.json says nothing.
  if (/catalog/.test(entry.notes ?? '')) {
    const ws = readFile(entry.repo, 'pnpm-workspace.yaml') ?? '';
    const hits = ws
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => match.test(line.split(':')[0].replace(/["']/g, '')));
    console.log(`${entry.repo}\tpnpm-workspace.yaml\t${hits.join(' ')}`);
  }
}
