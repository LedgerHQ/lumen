#!/usr/bin/env node
// Drift check for agent docs (AGENTS.md + .claude/skills/*). Asserts the
// mechanically checkable invariants promised in AGENTS.md so the docs can't
// silently rot:
//   1. Index ↔ folder bijection — every skill folder is in the AGENTS.md index
//      and every indexed skill has a folder.
//   2. No dangling skill references — "the `foo` skill" must resolve to a folder.
//   3. Cited repo paths exist — a `libs/…` / `.nx/…` / `.github/…` / `.claude/…`
//      / `scripts/…` path referenced in a skill must exist on disk.
//   4. Tool-version consistency — a skill stating "Nx X.Y.Z" must match the
//      version in package.json.
//
// Deterministic, no dependencies. Run: node scripts/check-agent-docs.mjs

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, '.claude/skills');
const errors = [];
const err = (msg) => errors.push(msg);

// --- Inventory: skill folders that actually contain a SKILL.md ---
const skillFolders = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, 'SKILL.md')))
  .map((d) => d.name)
  .sort();
const skillSet = new Set(skillFolders);

// --- Parse the AGENTS.md "Skills index" table ---
const agents = readFileSync(join(root, 'AGENTS.md'), 'utf8');
const indexSection = agents.split(/^## Skills index$/m)[1]?.split(/^## /m)[0] ?? '';
const indexedSkills = new Set();
for (const line of indexSection.split('\n')) {
  if (!line.trim().startsWith('|')) continue;
  const cols = line.split('|').map((c) => c.trim());
  const last = cols[cols.length - 2] ?? ''; // trailing '|' yields an empty final cell
  const m = last.match(/`([a-z0-9-]+)`/);
  if (m) indexedSkills.add(m[1]);
}

// 1. Bijection
for (const f of skillFolders) {
  if (!indexedSkills.has(f)) err(`Skill folder "${f}" is missing from the AGENTS.md Skills index.`);
}
for (const s of indexedSkills) {
  if (!skillSet.has(s)) err(`AGENTS.md indexes "${s}" but .claude/skills/${s}/ has no SKILL.md.`);
}

// --- Per-skill body checks ---
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const nxVersion = pkg.devDependencies?.nx ?? pkg.dependencies?.nx;

const staticPrefix = (p) => {
  // For a glob, keep the path up to (but excluding) the first segment with a wildcard.
  const parts = p.split('/');
  const out = [];
  for (const part of parts) {
    if (part.includes('*')) break;
    out.push(part);
  }
  return out.join('/');
};

for (const skill of skillFolders) {
  const file = join(skillsDir, skill, 'SKILL.md');
  const body = readFileSync(file, 'utf8');
  const backticked = [...body.matchAll(/`([^`]+)`/g)].map((m) => m[1]);

  // 2. Dangling skill references — "the `foo` skill" / "`foo` skill".
  for (const m of body.matchAll(/`([a-z0-9-]+)`\s+skill/g)) {
    const name = m[1];
    if (!skillSet.has(name) && name !== skill) {
      err(`${skill}/SKILL.md references a "${name}" skill that does not exist.`);
    }
  }

  // 3. Cited repo paths exist.
  for (const tok of backticked) {
    if (/\s/.test(tok)) continue;
    if (!/^(libs|scripts|apps)\//.test(tok) && !/^\.(nx|github|claude|storybook)\//.test(tok)) continue;
    const clean = tok.replace(/[.,:;)]+$/, '');
    const base = staticPrefix(clean);
    if (base && !existsSync(join(root, base))) {
      err(`${skill}/SKILL.md cites path "${tok}" but "${base}" does not exist.`);
    }
  }

  // 4. Tool-version consistency (Nx).
  if (nxVersion) {
    const bare = nxVersion.replace(/^[^0-9]*/, '');
    for (const m of body.matchAll(/Nx (\d+\.\d+\.\d+)/g)) {
      if (m[1] !== bare) {
        err(`${skill}/SKILL.md states "Nx ${m[1]}" but package.json has nx@${bare}.`);
      }
    }
  }
}

if (errors.length) {
  console.error(`agent-docs drift check failed (${errors.length}):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`agent-docs drift check passed (${skillFolders.length} skills).`);
