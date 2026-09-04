#!/usr/bin/env node
// Drift check for agent docs (AGENTS.md + .claude/skills/*) and the structure
// they describe. Asserts the mechanically checkable invariants promised in
// AGENTS.md so the docs can't silently rot:
//   1. Index ↔ folder bijection — every skill folder is in the AGENTS.md index
//      and every indexed skill has a folder.
//   2. No dangling skill references — "the `foo` skill" must resolve to a folder.
//   3. Cited repo paths exist — a `libs/…` / `.nx/…` / `.github/…` / `.claude/…`
//      / `scripts/…` path referenced in a skill must exist on disk.
//      Exception: `.nx/version-plans/` — git does not track empty dirs, so the
//      folder is absent when a PR only touches dev-tooling.
//   4. Tool-version consistency — a skill stating "Nx X.Y.Z" must match the
//      version in package.json.
//   5. Live `paths:` triggers — every glob in a skill's `paths:` frontmatter must
//      match at least one file (a renamed/moved dir kills auto-attach silently).
//   6. Libraries table ↔ filesystem — every row's `libs/*` path exists, its
//      package name matches that lib's package.json, and every lib on disk is in
//      the table (bijection).
//   7. Internals table ↔ filesystem — every `internals/*` project is documented
//      (bijection), carries the `scope:internal` tag so the module-boundary rule
//      applies, ships no package.json, and spreads `prodConfig` in its eslint
//      config. Keeps a new internal lib from silently skipping the category's
//      guarantees.
//   8. MCP config parity — `.mcp.json` and `.cursor/mcp.json` list the same
//      servers with the same url/command (the one hand-synced, non-CI invariant).
//
// Deterministic, no dependencies. Run: node scripts/check-agent-docs-drift.mjs

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, '.claude/skills');
const errors = [];
const err = (msg) => errors.push(msg);

// --- Shared regexps ------------------------------------------------------
const RE_H2 = /^## /m;
const RE_SKILL_SLUG = /`([a-z0-9-]+)`/;
const RE_SKILL_REF = /`([a-z0-9-]+)`\s+skill/g;
const RE_BACKTICK = /`([^`]+)`/g;
const RE_CITED_ROOT = /^(libs|scripts|apps|internals)\//;
const RE_CITED_DOT_ROOT = /^\.(nx|github|claude|storybook)\//;
const RE_TRAILING_PUNCT = /[.,:;)]+$/;
const RE_NX_VERSION = /Nx (\d+\.\d+\.\d+)/g;
const RE_FRONTMATTER = /^---\n([\s\S]*?)\n---/;
const RE_PATHS_LINE = /^paths:\s*(.+)$/m;
const RE_LIB_PATH = /`(libs\/[a-z0-9-]+)`/;
const RE_INTERNAL_PATH = /`(internals\/[a-z0-9-]+)`/;
const RE_PKG_NAME = /`(@[^`]+)`/;
const RE_GLOB_WILD = /[*?{]/;
const RE_BRACE_GROUP = /\{([^{}]*)\}/;

// Cited / `paths:` globs that may be absent (git does not track empty dirs).
const SKIP_EXISTENCE = /^\.nx\/version-plans(\/|$)/;

const PRUNE = new Set([
  'node_modules', '.git', 'dist', '.nx', 'coverage', 'test-output',
  'build', '.cache', 'storybook-static', '.turbo', 'tmp',
]);

const h2Section = (md, title) =>
  md.split(new RegExp(`^## ${title}$`, 'm'))[1]?.split(RE_H2)[0] ?? '';

const tableRows = (section) =>
  section.split('\n').filter((line) => line.trim().startsWith('|'));

// --- Inventory: skill folders that actually contain a SKILL.md ---
const skillFolders = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, 'SKILL.md')))
  .map((d) => d.name)
  .sort();
const skillSet = new Set(skillFolders);

// --- Parse the AGENTS.md "Skills index" table ---
const agents = readFileSync(join(root, 'AGENTS.md'), 'utf8');
const indexedSkills = new Set();
for (const line of tableRows(h2Section(agents, 'Skills index'))) {
  const cols = line.split('|').map((c) => c.trim());
  const last = cols[cols.length - 2] ?? ''; // trailing '|' yields an empty final cell
  const m = last.match(RE_SKILL_SLUG);
  if (m) indexedSkills.add(m[1]);
}

// 1. Bijection
for (const f of skillFolders) {
  if (!indexedSkills.has(f)) err(`Skill folder "${f}" is missing from the AGENTS.md Skills index.`);
}
for (const s of indexedSkills) {
  if (!skillSet.has(s)) err(`AGENTS.md indexes "${s}" but .claude/skills/${s}/ has no SKILL.md.`);
}

// --- Glob helpers (dependency-free) --------------------------------------
// Keep the path up to (but excluding) the first segment containing a wildcard.
const staticPrefix = (p) => {
  const out = [];
  for (const part of p.split('/')) {
    if (RE_GLOB_WILD.test(part)) break;
    out.push(part);
  }
  return out.join('/');
};

// Expand a single level of `{a,b}` alternations into concrete globs.
const expandBraces = (glob) => {
  const m = glob.match(RE_BRACE_GROUP);
  if (!m) return [glob];
  return m[1].split(',').flatMap((opt) => expandBraces(glob.replace(m[0], opt)));
};

const globToRegex = (glob) => {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        if (glob[i + 2] === '/') { re += '(?:[^/]+/)*'; i += 2; }
        else { re += '.*'; i += 1; }
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') {
      re += '[^/]';
    } else if ('.+^${}()|[]\\'.includes(c)) {
      re += '\\' + c;
    } else {
      re += c;
    }
  }
  return new RegExp('^' + re + '$');
};

// True if at least one file under `startRel` matches `regex`.
const anyFileMatches = (regex, startRel) => {
  const startAbs = join(root, startRel || '.');
  if (!existsSync(startAbs)) return false;
  const stack = [startRel || ''];
  while (stack.length) {
    const relDir = stack.pop();
    let entries;
    try { entries = readdirSync(join(root, relDir), { withFileTypes: true }); }
    catch { continue; }
    for (const e of entries) {
      const rel = relDir ? `${relDir}/${e.name}` : e.name;
      if (e.isDirectory()) {
        if (!PRUNE.has(e.name)) stack.push(rel);
      } else if (regex.test(rel)) {
        return true;
      }
    }
  }
  return false;
};

// Split a `paths:` value on top-level commas (commas inside `{}` are kept).
const splitPaths = (value) => {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of value) {
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
};

// --- Per-skill body checks ---
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const nxVersion = pkg.devDependencies?.nx ?? pkg.dependencies?.nx;

for (const skill of skillFolders) {
  const file = join(skillsDir, skill, 'SKILL.md');
  const body = readFileSync(file, 'utf8');
  const backticked = [...body.matchAll(RE_BACKTICK)].map((m) => m[1]);

  // 2. Dangling skill references — "the `foo` skill" / "`foo` skill".
  for (const m of body.matchAll(RE_SKILL_REF)) {
    const name = m[1];
    if (!skillSet.has(name) && name !== skill) {
      err(`${skill}/SKILL.md references a "${name}" skill that does not exist.`);
    }
  }

  // 3. Cited repo paths exist.
  for (const tok of backticked) {
    if (/\s/.test(tok)) continue;
    if (!RE_CITED_ROOT.test(tok) && !RE_CITED_DOT_ROOT.test(tok)) continue;
    const clean = tok.replace(RE_TRAILING_PUNCT, '');
    if (SKIP_EXISTENCE.test(clean)) continue;
    const base = staticPrefix(clean);
    if (base && !existsSync(join(root, base))) {
      err(`${skill}/SKILL.md cites path "${tok}" but "${base}" does not exist.`);
    }
  }

  // 4. Tool-version consistency (Nx).
  if (nxVersion) {
    const bare = nxVersion.replace(/^[^0-9]*/, '');
    for (const m of body.matchAll(RE_NX_VERSION)) {
      if (m[1] !== bare) {
        err(`${skill}/SKILL.md states "Nx ${m[1]}" but package.json has nx@${bare}.`);
      }
    }
  }

  // 5. Live `paths:` triggers — each glob must match at least one file.
  const frontmatter = body.match(RE_FRONTMATTER);
  const pathsLine = frontmatter?.[1].match(RE_PATHS_LINE);
  if (pathsLine) {
    for (const glob of splitPaths(pathsLine[1])) {
      if (SKIP_EXISTENCE.test(glob)) continue;
      const live = expandBraces(glob).some((g) => anyFileMatches(globToRegex(g), staticPrefix(g)));
      if (!live) {
        err(`${skill}/SKILL.md has a \`paths\` glob "${glob}" that matches no file (dead auto-attach trigger).`);
      }
    }
  }
}

// --- 6. Libraries table ↔ filesystem -------------------------------------
const tableLibs = new Map(); // libs/x -> package name
for (const line of tableRows(h2Section(agents, 'Libraries'))) {
  const cols = line.split('|').map((c) => c.trim());
  const libPath = cols[1]?.match(RE_LIB_PATH)?.[1];
  const pkgName = cols[2]?.match(RE_PKG_NAME)?.[1];
  if (libPath) tableLibs.set(libPath, pkgName ?? null);
}
if (tableLibs.size === 0) {
  err('AGENTS.md "## Libraries" table could not be parsed (no `libs/*` rows found).');
}
for (const [libPath, pkgName] of tableLibs) {
  const pkgFile = join(root, libPath, 'package.json');
  if (!existsSync(pkgFile)) {
    err(`AGENTS.md Libraries table lists "${libPath}" but it does not exist on disk.`);
    continue;
  }
  const actual = JSON.parse(readFileSync(pkgFile, 'utf8')).name;
  if (pkgName && actual !== pkgName) {
    err(`AGENTS.md Libraries table says "${libPath}" is \`${pkgName}\` but its package.json name is "${actual}".`);
  }
}
const libsOnDisk = existsSync(join(root, 'libs'))
  ? readdirSync(join(root, 'libs'), { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(root, 'libs', d.name, 'package.json')))
      .map((d) => `libs/${d.name}`)
  : [];
for (const lib of libsOnDisk) {
  if (!tableLibs.has(lib)) err(`Lib "${lib}" exists on disk but is missing from the AGENTS.md Libraries table.`);
}

// --- 7. Internals table ↔ filesystem ------------------------------------
// `internals/*` is the dev-only category: never published, and fenced off from
// libs/apps by the `scope:internal` tag. Both guarantees are easy to forget when
// adding the next one, so assert them here rather than trusting review.
const tableInternals = new Set();
for (const line of tableRows(h2Section(agents, 'Internals'))) {
  const path = line.split('|')[1]?.match(RE_INTERNAL_PATH)?.[1];
  if (path) tableInternals.add(path);
}
const internalsOnDisk = existsSync(join(root, 'internals'))
  ? readdirSync(join(root, 'internals'), { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(join(root, 'internals', d.name, 'project.json')))
      .map((d) => `internals/${d.name}`)
  : [];

for (const path of tableInternals) {
  if (!internalsOnDisk.includes(path)) {
    err(`AGENTS.md Internals table lists "${path}" but it has no project.json on disk.`);
  }
}
for (const path of internalsOnDisk) {
  if (!tableInternals.has(path)) {
    err(`Internal project "${path}" exists on disk but is missing from the AGENTS.md Internals table.`);
  }

  const project = JSON.parse(readFileSync(join(root, path, 'project.json'), 'utf8'));
  if (!project.tags?.includes('scope:internal')) {
    err(`"${path}/project.json" must carry the "scope:internal" tag, or the module-boundary rule will not fence it off from libs/apps.`);
  }

  // A package.json would put it in npm workspaces and back in reach of
  // `nx release`; the category's "unpublishable by construction" rests on this.
  if (existsSync(join(root, path, 'package.json'))) {
    err(`"${path}" must not have a package.json — internal projects are never published.`);
  }

  const eslintConfig = join(root, path, 'eslint.config.mjs');
  if (!existsSync(eslintConfig)) {
    err(`"${path}" is missing an eslint.config.mjs, so it is linted by nothing.`);
  } else if (!readFileSync(eslintConfig, 'utf8').includes('prodConfig')) {
    err(`"${path}/eslint.config.mjs" must spread \`prodConfig\` — internal code is held to the same bar as libs (declare narrow per-rule exceptions instead of opting out).`);
  }
}

// --- 8. MCP config parity (.mcp.json ↔ .cursor/mcp.json) -----------------
const readServers = (rel) => {
  const p = join(root, rel);
  if (!existsSync(p)) { err(`Expected MCP config "${rel}" is missing.`); return null; }
  try { return JSON.parse(readFileSync(p, 'utf8')).mcpServers ?? {}; }
  catch { err(`MCP config "${rel}" is not valid JSON.`); return null; }
};
const claudeMcp = readServers('.mcp.json');
const cursorMcp = readServers('.cursor/mcp.json');
if (claudeMcp && cursorMcp) {
  const names = new Set([...Object.keys(claudeMcp), ...Object.keys(cursorMcp)]);
  for (const name of names) {
    const a = claudeMcp[name];
    const b = cursorMcp[name];
    if (!a) { err(`MCP server "${name}" is in .cursor/mcp.json but not .mcp.json.`); continue; }
    if (!b) { err(`MCP server "${name}" is in .mcp.json but not .cursor/mcp.json.`); continue; }
    // The only expected difference is the `type` field (Cursor infers it from url).
    for (const key of ['url', 'command', 'args']) {
      if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
        err(`MCP server "${name}" differs on "${key}" between .mcp.json and .cursor/mcp.json.`);
      }
    }
  }
}

if (errors.length) {
  console.error(`agent-docs drift check failed (${errors.length}):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`agent-docs drift check passed (${skillFolders.length} skills, ${tableLibs.size} libs).`);
