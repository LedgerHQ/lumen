export const LUMEN_PACKAGES = [
  '@ledgerhq/lumen-ui-react',
  '@ledgerhq/lumen-ui-rnative',
  '@ledgerhq/lumen-design-core',
] as const;

export type LumenPackage = (typeof LUMEN_PACKAGES)[number];

/**
 * Every Lumen release bumps only the patch component (AGENTS.md: version
 * plans are always `patch`), so "patches behind latest" is a sound adoption
 * measure as long as major.minor haven't diverged.
 */
export const FAR_BEHIND_THRESHOLD = 5;

/** Targets run without a `cwd`, so these are workspace-root-relative. */
export const CONSUMERS_DATA_PATH =
  'internals/lumen-adoption/data/consumers.json';
export const REPORT_MARKDOWN_PATH = 'internals/lumen-adoption/report.md';
export const REPORT_HTML_PATH = 'internals/lumen-adoption/report.html';

export const GITHUB_ORG = 'LedgerHQ';
export const SOURCE_REPO = 'LedgerHQ/lumen';
