#!/usr/bin/env node
/**
 * React Native counterpart to the web `test:tree-shaking` fixture.
 *
 * `@ledgerhq/lumen-ui-rnative/visualization` resolves through the `react-native`
 * export condition, which points at `src/` — a path no other CI target
 * exercises. Typecheck only proves the `types` condition resolves; nothing
 * proved Metro can actually resolve the subpath, or that d3 (pure ESM, shipped
 * as a runtime dependency) survives the RN transform pipeline.
 *
 * The `expo export` that precedes this script is most of the check: an
 * unresolvable specifier fails the bundle outright. This script adds the other
 * half — that the chart code and its dependencies really landed in the bundle,
 * rather than being silently resolved to something empty.
 */
import { readFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const PREFIX_LOG = '[app-sandbox-rnative] ';

const logger = {
  error: (message) => {
    console.error(`${PREFIX_LOG} ${message}`);
  },
  info: (message) => {
    console.info(`${PREFIX_LOG} ${message}`);
  },
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const bundleDir = join(__dirname, '../../dist/_expo/static/js/ios');

let files;
try {
  files = readdirSync(bundleDir);
} catch {
  logger.error(
    `❌ No iOS bundle at ${bundleDir} — did \`expo export\` run before this script?`,
  );
  process.exit(1);
}

// `--source-maps --no-bytecode` is what makes the module list readable; a
// Hermes .hbc bundle would leave nothing to assert against.
const mapFile = files.find((file) => file.endsWith('.js.map'));

if (!mapFile) {
  logger.error(
    '❌ No source map in the exported bundle. Ensure `expo export` runs with --source-maps --no-bytecode.',
  );
  process.exit(1);
}

const sourceMap = JSON.parse(readFileSync(join(bundleDir, mapFile), 'utf-8'));
const sources = sourceMap.sources;

logger.info(`Verifying RN bundle from source map: ${mapFile}`);
logger.info(`Source map contains ${sources.length} modules`);

const hasSource = (pathFragment) =>
  sources.some((source) => source.includes(pathFragment));

const REQUIRED = [
  {
    name: 'visualization subpath (react-native condition → src/)',
    path: 'ui-rnative/src/lib/Components/visualization/',
  },
  { name: 'd3-scale', path: 'node_modules/d3-scale' },
  { name: 'd3-shape', path: 'node_modules/d3-shape' },
  // Optional peers: charts are the only thing in the package that needs them,
  // so their absence here would mean the chart code never made it in.
  {
    name: 'react-native-gesture-handler',
    path: 'react-native-gesture-handler',
  },
  { name: 'react-native-worklets', path: 'react-native-worklets' },
];

let hasErrors = false;

for (const { name, path } of REQUIRED) {
  if (hasSource(path)) continue;
  logger.error(`❌ ${name} NOT FOUND in the bundle - this is required!`);
  hasErrors = true;
}

if (hasErrors) {
  logger.error(' FAILED: RN bundle verification failed');
  process.exit(1);
}

logger.info('✅ SUCCESS: the ./visualization subpath bundles under Metro!');
process.exit(0);
