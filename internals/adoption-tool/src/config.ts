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
  'internals/adoption-tool/data/consumers.json';
export const REPORT_MARKDOWN_PATH = 'internals/adoption-tool/report.md';
export const REPORT_HTML_PATH = 'internals/adoption-tool/report.html';
export const REPORT_SLACK_PATH = 'internals/adoption-tool/report.slack.txt';

export const OWNERS_MARKDOWN_PATH = 'internals/adoption-tool/owners.md';

/** Source of the team ↔ repo catalog (LikeC4 models under `domains/`). */
export const CATALOG_REPO = 'LedgerHQ/architecture-as-code';

/**
 * Catalog teams that review across many repos rather than own them. Their
 * GitHub handle shows up in CODEOWNERS everywhere, so matching on it would
 * label unrelated repos as theirs; only an explicit catalog link counts.
 */
export const CROSS_CUTTING_CATALOG_TEAMS = ['Quality Assurance Team'];

export const GITHUB_ORG = 'LedgerHQ';
export const SOURCE_REPO = 'LedgerHQ/lumen';
