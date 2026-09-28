import { describe, expect, it } from 'vitest';
import type { LumenPackage } from '../config.js';
import { renderMarkdownTable, renderSummaryLine } from './render.js';
import type { ReportRow } from './render.js';

const latestVersions: Record<LumenPackage, string> = {
  '@ledgerhq/lumen-ui-react': '0.1.59',
  '@ledgerhq/lumen-ui-rnative': '0.1.62',
  '@ledgerhq/lumen-design-core': '0.1.29',
};

const rows: ReportRow[] = [
  {
    repo: 'LedgerHQ/ledger-live',
    cells: {
      '@ledgerhq/lumen-ui-react': {
        status: 'current',
        version: '0.1.59',
        patchesBehind: 0,
      },
      '@ledgerhq/lumen-ui-rnative': {
        status: 'current',
        version: '0.1.62',
        patchesBehind: 0,
      },
      '@ledgerhq/lumen-design-core': {
        status: 'current',
        version: '0.1.29',
        patchesBehind: 0,
      },
    },
  },
  {
    repo: 'LedgerHQ/app-openpgp',
    cells: {
      '@ledgerhq/lumen-ui-react': {
        status: 'far-behind',
        version: '0.1.40',
        patchesBehind: 19,
      },
      '@ledgerhq/lumen-ui-rnative': { status: 'not-used' },
      '@ledgerhq/lumen-design-core': {
        status: 'far-behind',
        version: '0.1.17',
        patchesBehind: 12,
      },
    },
  },
];

describe('renderMarkdownTable', () => {
  it('renders one row per repo with a status emoji per package', () => {
    const table = renderMarkdownTable(rows);
    expect(table).toContain(
      '| LedgerHQ/ledger-live | 🟢 0.1.59 | 🟢 0.1.62 | 🟢 0.1.29 |',
    );
    expect(table).toContain(
      '| LedgerHQ/app-openpgp | 🔴 0.1.40 (19 behind) | — | 🔴 0.1.17 (12 behind) |',
    );
  });
});

describe('renderSummaryLine', () => {
  it('counts statuses across all rows and prints the latest versions', () => {
    const summary = renderSummaryLine(rows, latestVersions);
    expect(summary).toContain('ui-react@0.1.59');
    expect(summary).toContain('🟢 3 current');
    expect(summary).toContain('🔴 2 far behind/diverged');
  });
});
