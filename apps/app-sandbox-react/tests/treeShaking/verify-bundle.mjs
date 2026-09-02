#!/usr/bin/env node
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const PREFIX_LOG = '[app-sandbox-react] ';

const logger = {
  error: (message) => {
    console.error(`${PREFIX_LOG} ${message}`);
  },
  info: (message) => {
    console.info(`${PREFIX_LOG} ${message}`);
  },
};

const __dirname = dirname(fileURLToPath(import.meta.url));

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const profileName = arg('profile', 'main');
const distPath = join(__dirname, arg('dist', 'dist'), 'assets');

const files = readdirSync(distPath);
// `inlineDynamicImports` guarantees a single JS chunk, so the first match is
// the whole bundle. Matched by extension rather than by an `index-` prefix
// because Vite names chunks after the entry html.
const mapFile = files.find((file) => file.endsWith('.js.map'));

if (!mapFile) {
  logger.error(
    '❌ Error: Could not find source map file in dist/assets. Ensure sourcemap is enabled in vite config.',
  );
  process.exit(1);
}

const mapPath = join(distPath, mapFile);
const sourceMap = JSON.parse(readFileSync(mapPath, 'utf-8'));
const sources = sourceMap.sources;

logger.info(`Verifying tree-shaking from source map: ${mapFile}`);
logger.info(`Source map contains ${sources.length} modules`);

/**
 * Check whether any source path matches a given substring.
 */
const hasSource = (pathFragment) =>
  sources.some((source) => source.includes(pathFragment));

/**
 * Each fixture asserts one half of the chart-isolation contract, and both are
 * required: `main` alone would pass even if ./visualization resolved to
 * nothing, and `visualization` alone would pass even if charts also leaked into
 * every other bundle.
 */
const PROFILES = {
  main: {
    description: 'Button + one symbol, imported from the main barrel',
    required: [
      { name: 'Button component', path: 'Components/core/Button/' },
      { name: 'Incognito symbol', path: 'Components/symbols/icons/Incognito' },
    ],
    excluded: [
      // Components
      { name: 'Switch component', path: 'Components/core/Switch/' },
      { name: 'Checkbox component', path: 'Components/core/Checkbox/' },
      { name: 'TextInput component', path: 'Components/core/TextInput/' },
      { name: 'Select component', path: 'Components/core/Select/' },
      { name: 'Dialog component', path: 'Components/core/Dialog/' },
      { name: 'AmountInput component', path: 'Components/core/AmountInput/' },
      { name: 'AddressInput component', path: 'Components/core/AddressInput/' },
      { name: 'ListItem component', path: 'Components/core/ListItem/' },
      { name: 'Tag component', path: 'Components/core/Tag/' },
      // Symbols
      { name: 'Airplane symbol', path: 'Components/symbols/icons/Airplane' },
      { name: 'Android symbol', path: 'Components/symbols/icons/Android' },
      { name: 'Apple symbol', path: 'Components/symbols/icons/Apple' },
      { name: 'Calendar symbol', path: 'Components/symbols/icons/Calendar' },
      { name: 'Cart symbol', path: 'Components/symbols/icons/Cart' },
      { name: 'Wallet symbol', path: 'Components/symbols/icons/Wallet' },
      { name: 'Settings symbol', path: 'Components/symbols/icons/Settings' },
      { name: 'Github symbol', path: 'Components/symbols/icons/Github' },
      { name: 'Twitter symbol', path: 'Components/symbols/icons/Twitter' },
      { name: 'Discord symbol', path: 'Components/symbols/icons/Discord' },
      { name: 'Facebook symbol', path: 'Components/symbols/icons/Facebook' },
      // Charts ship at the ./visualization subpath only.
      { name: 'visualization components', path: 'Components/visualization/' },
      { name: 'd3 (any package)', path: 'node_modules/d3-' },
      { name: 'internmap (d3-scale dep)', path: 'internmap' },
    ],
  },
  visualization: {
    description: 'LineChart, imported from the ./visualization subpath',
    required: [
      { name: 'LineChart component', path: 'Components/visualization/LineChart/' },
      { name: 'd3-scale', path: 'node_modules/d3-scale' },
      { name: 'd3-shape', path: 'node_modules/d3-shape' },
    ],
    excluded: [
      { name: 'Dialog component', path: 'Components/core/Dialog/' },
      { name: 'DataTable component', path: 'Components/core/DataTable/' },
      { name: 'Select component', path: 'Components/core/Select/' },
      { name: 'Table component', path: 'Components/core/Table/' },
      { name: 'AddressInput component', path: 'Components/core/AddressInput/' },
    ],
  },
};

const profile = PROFILES[profileName];
if (!profile) {
  logger.error(`❌ Unknown profile "${profileName}".`);
  process.exit(1);
}
logger.info(`Profile: ${profileName} — ${profile.description}`);

const requiredModules = profile.required;
const excludedModules = profile.excluded;

let hasErrors = false;

for (const { name, path } of requiredModules) {
  if (!hasSource(path)) {
    logger.error(`❌ ${name} NOT FOUND in source map - this is required!`);
    hasErrors = true;
  }
}

const foundUnwanted = [];
for (const { name, path } of excludedModules) {
  if (hasSource(path)) {
    foundUnwanted.push(name);
    logger.error(`  ✗ ${name} found in source map (should be tree-shaken)`);
    hasErrors = true;
  }
}

if (foundUnwanted.length === 0) {
  logger.info('No unwanted components/symbols found');
}

/**
 * Tailwind emits utilities only for classes it has actually seen. Lumen ships
 * `@source "./dist/lib"` inside its own stylesheet, so if that glob ever stops
 * matching — a dist restructure, a renamed folder — the consumer's CSS silently
 * loses every Lumen utility with no build error. Nothing else in CI covers it.
 *
 * These utilities can only come from scanning Lumen's compiled dist: the
 * fixture's own markup never writes them.
 */
const requiredUtilities = ['bg-accent', 'text-on-accent', 'body-2-semi-bold'];
const MIN_CSS_BYTES = 50_000;

const cssFile = files.find((file) => file.endsWith('.css'));

if (!cssFile) {
  logger.error('❌ No CSS emitted — Lumen\'s @source glob resolved nothing.');
  hasErrors = true;
} else {
  const css = readFileSync(join(distPath, cssFile), 'utf-8');
  logger.info(`Verifying Tailwind output: ${cssFile} (${css.length} bytes)`);

  if (css.length < MIN_CSS_BYTES) {
    logger.error(
      `❌ CSS is only ${css.length} bytes (expected > ${MIN_CSS_BYTES}) — @source likely matched nothing.`,
    );
    hasErrors = true;
  }

  for (const utility of requiredUtilities) {
    if (!css.includes(utility)) {
      logger.error(
        `❌ Utility "${utility}" missing from the emitted CSS — Lumen's dist is not being scanned.`,
      );
      hasErrors = true;
    }
  }
}

if (hasErrors) {
  logger.error(' FAILED: Tree-shaking verification failed');
  if (foundUnwanted.length > 0) {
    logger.error(`Found ${foundUnwanted.length} unwanted items in bundle:`);
    logger.error(`${foundUnwanted.join(', ')}`);
  }
  process.exit(1);
} else {
  logger.info('✅ SUCCESS: Tree-shaking working correctly!');
  process.exit(0);
}
