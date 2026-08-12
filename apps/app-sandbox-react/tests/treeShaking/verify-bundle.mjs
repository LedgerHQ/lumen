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
const distPath = join(__dirname, 'dist', 'assets');

const files = readdirSync(distPath);
const mapFile = files.find(
  (file) => file.startsWith('index-') && file.endsWith('.js.map'),
);

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

// Modules that SHOULD be in the bundle (used in main.treeshaking.tsx)
const requiredModules = [
  { name: 'Button component', path: 'Components/core/Button/' },
  { name: 'Incognito symbol', path: 'Components/symbols/icons/Incognito' },
];

// Modules that SHOULD NOT be in the bundle (tree-shaken away)
const excludedModules = [
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
];

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
