#!/usr/bin/env node
// Lists what a Lumen package lost between two versions: removed exports per
// entry point, and removed design tokens with the class patterns they break.
//
//   node lumen-api-diff.mjs <package> <from-version> <to-version>
//   node lumen-api-diff.mjs @ledgerhq/lumen-ui-react 0.1.33 0.1.66
//
// Run from the consumer repo: it resolves `typescript` from there, and caches
// tarballs in $TMPDIR. Output is Markdown.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const [pkg, from, to] = process.argv.slice(2);
if (!pkg || !from || !to) {
  console.error('usage: lumen-api-diff.mjs <package> <from-version> <to-version>');
  process.exit(2);
}

const require = createRequire(join(process.cwd(), 'package.json'));
const ts = require('typescript');

/** Downloads and unpacks a published version once, returns its folder. */
function fetchVersion(version) {
  const dir = join(process.env.TMPDIR ?? tmpdir(), 'lumen-api-diff', `${pkg.replace('/', '__')}@${version}`);
  // An interrupted run can leave `package/` without its manifest: re-fetch then.
  if (!existsSync(join(dir, 'package', 'package.json'))) {
    mkdirSync(dir, { recursive: true });
    const tarball = execFileSync('npm', ['pack', `${pkg}@${version}`, '--silent', '--pack-destination', dir], { encoding: 'utf8' }).trim().split('\n').pop();
    execFileSync('tar', ['-xzf', join(dir, tarball), '-C', dir]);
  }
  return join(dir, 'package');
}

/** Entry point → its `.d.ts` file, from `exports` (falls back to `types`). */
function typeEntries(root) {
  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const entries = {};
  for (const [key, value] of Object.entries(manifest.exports ?? {})) {
    const types = typeof value === 'object' ? value.types : undefined;
    if (types && !key.includes('*')) entries[key] = resolve(root, types);
  }
  if (!Object.keys(entries).length && manifest.types) entries['.'] = resolve(root, manifest.types);
  return entries;
}

/**
 * Public files behind wildcard exports (design-core's `./symbols/*` icons),
 * as the specifiers consumers import: `@ledgerhq/…/symbols/apex.svg`.
 */
function assetPaths(root) {
  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const paths = new Set();
  for (const [key, value] of Object.entries(manifest.exports ?? {})) {
    const target = typeof value === 'string' ? value : (value.default ?? value.import);
    if (!key.includes('*') || typeof target !== 'string' || !target.includes('*')) continue;
    const [dirPart, suffix] = target.split('*');
    const base = resolve(root, dirPart);
    if (!existsSync(base)) continue;
    (function walk(dir) {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (path.endsWith(suffix)) {
          const match = path.slice(base.length + 1, path.length - suffix.length);
          paths.add(`${pkg}${key.slice(1).replace('*', match)}`);
        }
      }
    })(base);
  }
  return paths;
}

/** Names exported by a `.d.ts` entry, following re-exports. */
function exportsOf(file) {
  if (!existsSync(file)) return new Set();
  const program = ts.createProgram([file], {
    noEmit: true,
    skipLibCheck: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
  });
  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(program.getSourceFile(file));
  return new Set(symbol ? checker.getExportsOfModule(symbol).map((s) => s.name) : []);
}

/**
 * Every CSS custom property name declared in the package's built files.
 * Skips test fixtures, and prefixes (`'--text-'`) that plugins build names from.
 */
function tokensOf(root) {
  const tokens = new Set();
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(css|js)$/.test(name) && !/\.(test|spec)\.js$/.test(name)) {
        for (const [, token] of readFileSync(path, 'utf8').matchAll(/['"\s{;](--[a-z][a-z0-9-]*)['"]?\s*:/g)) {
          if (!token.endsWith('-')) tokens.add(token);
        }
      }
    }
  })(root);
  return tokens;
}

// Token prefix → the Tailwind utilities generated from it (see design-core's
// plugins). `strip` is what the class name drops from the token: crypto and
// discover colors keep their `crypto-` / `discover-` prefix in the class.
// No `utilities`: the token generates no class, only `var()` references.
// First match wins, so specific prefixes come before their parents.
const BACKGROUND = 'bg|from|via|to|fill|accent|shadow';
const UTILITIES = [
  { prefix: '--border-width-' },
  { prefix: '--color-crypto-', strip: '--color-', utilities: BACKGROUND, gradient: true },
  { prefix: '--color-discover-', strip: '--color-', utilities: BACKGROUND },
  { prefix: '--color-' },
  { prefix: '--size-', utilities: 'w|h|size|min-w|max-w|min-h|max-h|basis' },
  { prefix: '--spacing-', utilities: 'p[xytrblse]?|-?m[xytrblse]?|gap(-[xy])?|space-[xy]|inset(-[xy])?|top|right|bottom|left|start|end|w|h|size|min-w|max-w|min-h|max-h' },
  { prefix: '--border-radius-', utilities: 'rounded(-[trblse]{1,2})?' },
  { prefix: '--background-', utilities: BACKGROUND },
  { prefix: '--text-', utilities: 'text|caret|placeholder' },
  { prefix: '--border-', utilities: 'border(-[xytrblse])?|outline|ring|stroke|divide|decoration' },
  { prefix: '--backdrop-blur-', utilities: 'backdrop-blur' },
];

/** Class patterns that stop working when `token` is removed. */
function classPatterns(token) {
  const rule = UTILITIES.find(({ prefix }) => token.startsWith(prefix));
  if (!rule?.utilities) return [];
  const patterns = [`\\b(${rule.utilities})-${token.slice((rule.strip ?? rule.prefix).length)}\\b`];
  // Crypto gradients (`bg-gradient-bitcoin`) are built from the base color only.
  if (rule.gradient && !token.endsWith('-0')) patterns.push(`\\bbg-gradient-${token.slice(rule.prefix.length)}\\b`);
  return patterns;
}

const fromRoot = fetchVersion(from);
const toRoot = fetchVersion(to);
const out = [`# ${pkg}: ${from} → ${to}`, ''];

const fromEntries = typeEntries(fromRoot);
const toEntries = typeEntries(toRoot);
out.push('## Removed exports', '');
let removedExports = 0;
for (const [entry, file] of Object.entries(fromEntries)) {
  const before = exportsOf(file);
  const after = toEntries[entry] ? exportsOf(toEntries[entry]) : new Set();
  const gone = [...before].filter((name) => !after.has(name)).sort();
  if (!toEntries[entry]) out.push(`- \`${pkg}${entry.slice(1)}\`: **entry point removed**`);
  if (gone.length) {
    removedExports += gone.length;
    out.push(`- \`${pkg}${entry.slice(1)}\` (${gone.length}): ${gone.map((n) => `\`${n}\``).join(', ')}`);
  }
}
if (!removedExports && Object.keys(fromEntries).every((e) => toEntries[e])) out.push('None.');

const beforeAssets = assetPaths(fromRoot);
const afterAssets = assetPaths(toRoot);
const goneAssets = [...beforeAssets].filter((path) => !afterAssets.has(path)).sort();
out.push('', '## Removed files (wildcard exports)', '');
out.push(goneAssets.length ? goneAssets.map((path) => `- \`${path}\``).join('\n') : 'None.');

const beforeTokens = tokensOf(fromRoot);
const afterTokens = tokensOf(toRoot);
const goneTokens = [...beforeTokens].filter((t) => !afterTokens.has(t)).sort();
out.push('', '## Removed design tokens', '');
if (!goneTokens.length) out.push('None.');
for (const token of goneTokens) {
  const patterns = classPatterns(token).map((pattern) => `\`${pattern}\``);
  out.push(`- \`${token}\`: \`var(${token})\`${patterns.length ? `, classes ${patterns.join(', ')}` : ''}`);
}
out.push('', 'Grep the app for each removed export, file, `var()` and class pattern. Classes built on a removed token produce **no CSS and no error**.');
console.log(out.join('\n'));
