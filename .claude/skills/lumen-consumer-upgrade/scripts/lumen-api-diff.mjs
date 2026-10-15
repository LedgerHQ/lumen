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
  if (!existsSync(join(dir, 'package'))) {
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

/** Every CSS custom property name declared in the package's built files. */
function tokensOf(root) {
  const tokens = new Set();
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(css|js)$/.test(name)) {
        for (const [, token] of readFileSync(path, 'utf8').matchAll(/['"\s{;](--[a-z][a-z0-9-]*)['"]?\s*:/g)) tokens.add(token);
      }
    }
  })(root);
  return tokens;
}

// Token prefix → the Tailwind utilities generated from it (see design-core's
// plugins). `null`: the token generates no class, only `var()` references.
// First match wins, so specific prefixes come before their parents.
const UTILITIES = [
  ['--border-width-', null],
  ['--color-crypto-', 'bg|from|via|to|fill'],
  ['--color-', null],
  ['--size-', 'w|h|size|min-w|max-w|min-h|max-h|basis'],
  ['--spacing-', 'p[xytrblse]?|-?m[xytrblse]?|gap(-[xy])?|space-[xy]|inset(-[xy])?|top|right|bottom|left|start|end|w|h|size|min-w|max-w|min-h|max-h'],
  ['--border-radius-', 'rounded(-[trblse]{1,2})?'],
  ['--background-', 'bg|from|via|to|fill|accent|shadow'],
  ['--text-', 'text|caret|placeholder'],
  ['--border-', 'border(-[xytrblse])?|outline|ring|stroke|divide|decoration'],
  ['--backdrop-blur-', 'backdrop-blur'],
];

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

const beforeTokens = tokensOf(fromRoot);
const afterTokens = tokensOf(toRoot);
const goneTokens = [...beforeTokens].filter((t) => !afterTokens.has(t)).sort();
out.push('', '## Removed design tokens', '');
if (!goneTokens.length) out.push('None.');
for (const token of goneTokens) {
  const rule = UTILITIES.find(([prefix]) => token.startsWith(prefix));
  const pattern = rule?.[1] ? `\\b(${rule[1]})-${token.slice(rule[0].length)}\\b` : null;
  out.push(`- \`${token}\`: \`var(${token})\`${pattern ? `, classes \`${pattern}\`` : ''}`);
}
out.push('', 'Grep the app for each removed export and class pattern. Classes built on a removed token produce **no CSS and no error**.');
console.log(out.join('\n'));
