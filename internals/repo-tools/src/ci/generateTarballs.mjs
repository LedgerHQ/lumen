#!/usr/bin/env node
/**
 * Pack the affected libs as per-PR dev tarballs and render the PR comment.
 *
 * Replaces the inline bash in `publish-dev-packages.yml`, which re-read every
 * `libs/*\/package.json` once per affected project to map a package name back to
 * a folder, and interpolated shell variables straight into a `node -e` program
 * to patch versions.
 *
 * Env: PR_NUMBER, HEAD_SHA, REPO, AFFECTED_PROJECTS (newline-separated package
 * names), RUNNER_TEMP, GITHUB_OUTPUT.
 */
import { execFileSync } from 'node:child_process';
import {
  appendFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { fail, info, ok, step } from '../lib/logging.mjs';
import { libByPackageName, workspaceRoot } from '../lib/workspaceProjects.mjs';

/**
 * @param {string} version
 * @param {string} prNumber
 * @param {string} shortSha
 */
export const devVersion = (version, prNumber, shortSha) =>
  `${version}-pr.${prNumber}.${shortSha}`;

/**
 * @typedef {object} PackedTarball
 * @property {string} name
 * @property {string} version
 * @property {string} filename
 */

/**
 * @param {object} args
 * @param {string} args.tag
 * @param {string} args.repo
 * @param {string} args.headSha
 * @param {PackedTarball[]} args.packed
 */
export function renderComment({ tag, repo, headSha, packed }) {
  const rows = packed.map(
    ({ name, version, filename }) =>
      `| \`${name}\` | \`${version}\` | \`npm i https://github.com/${repo}/releases/download/${tag}/${filename}\` |`,
  );
  return [
    '<!-- dev-packages-comment -->',
    '### 📦 Dev packages published',
    '',
    'Tarballs are hosted as assets on a per-PR GitHub pre-release and are deleted automatically when this PR is closed.',
    '',
    '| Package | Version | Install |',
    '|---------|---------|---------|',
    ...rows,
    '',
    `> **Release:** [\`${tag}\`](https://github.com/${repo}/releases/tag/${tag})`,
    `> **Commit:** \`${headSha}\``,
    '',
  ].join('\n');
}

/**
 * @param {string} dir lib directory, relative to the workspace root
 * @param {string} destination
 * @returns {string} tarball filename
 */
function pack(dir, destination) {
  // An absolute path, not `libs/foo`: npm reads a bare `owner/name` as a GitHub
  // shorthand and tries to clone it. The bash this replaced got away with
  // `libs/foo/` only because of the trailing slash.
  const stdout = execFileSync(
    'npm',
    [
      'pack',
      join(workspaceRoot, dir),
      '--pack-destination',
      destination,
      '--json',
    ],
    { cwd: workspaceRoot, encoding: 'utf8' },
  );
  return JSON.parse(stdout)[0].filename;
}

/** @param {string} dir @param {string} version */
function patchVersion(dir, version) {
  const manifestPath = join(workspaceRoot, dir, 'package.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.version = version;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function main() {
  const {
    PR_NUMBER = '',
    HEAD_SHA = '',
    REPO = '',
    AFFECTED_PROJECTS = '',
    RUNNER_TEMP = '',
    GITHUB_OUTPUT = '',
  } = process.env;

  const missing = Object.entries({ PR_NUMBER, HEAD_SHA, REPO, RUNNER_TEMP })
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length > 0) {
    fail(`missing required env: ${missing.join(', ')}`);
    process.exit(1);
  }

  const shortSha = HEAD_SHA.slice(0, 7);
  const tag = `dev-pr-${PR_NUMBER}`;
  const tarballDir = join(RUNNER_TEMP, 'dev-package-tarballs');
  const commentFile = join(RUNNER_TEMP, 'dev-packages-comment.md');
  mkdirSync(tarballDir, { recursive: true });

  const projects = AFFECTED_PROJECTS.split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  step(`Packing ${projects.length} affected project(s)`);
  /** @type {PackedTarball[]} */
  const packed = [];

  for (const project of projects) {
    const lib = libByPackageName(project);
    // `nx show projects` can return apps and internal projects too; only libs
    // that npm would accept get a tarball.
    if (!lib || lib.isPrivate) {
      info(`  – ${project} — not a publishable lib, skipped`);
      continue;
    }
    const version = devVersion(lib.version, PR_NUMBER, shortSha);
    patchVersion(lib.dir, version);
    const filename = pack(lib.dir, tarballDir);
    ok(`${lib.name}@${version} → ${filename}`);
    packed.push({ name: lib.name, version, filename });
  }

  writeFileSync(
    commentFile,
    renderComment({ tag, repo: REPO, headSha: HEAD_SHA, packed }),
  );

  if (GITHUB_OUTPUT) {
    appendFileSync(
      GITHUB_OUTPUT,
      `tag=${tag}\ntarball_dir=${tarballDir}\nshort_sha=${shortSha}\npacked_count=${packed.length}\n`,
    );
  }
  step(`${packed.length} tarball(s) in ${tarballDir}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
