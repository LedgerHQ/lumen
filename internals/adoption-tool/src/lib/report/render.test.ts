import { describe, expect, it } from 'vitest';
import type { LumenPackage } from '../../config.js';
import {
  renderHtmlReport,
  renderJsonReport,
  renderMarkdownReport,
  renderMarkdownTable,
  renderSummaryLine,
  renderSlackReport,
} from './render.js';
import type { ReportRow } from './types.js';

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
  {
    repo: 'LedgerHQ/borrow-live-app',
    cells: {
      '@ledgerhq/lumen-ui-react': {
        status: 'behind',
        version: '0.1.58',
        patchesBehind: 1,
      },
      '@ledgerhq/lumen-ui-rnative': { status: 'not-used' },
      '@ledgerhq/lumen-design-core': {
        status: 'behind',
        version: '0.1.28',
        patchesBehind: 1,
      },
    },
  },
];

describe('renderMarkdownTable', () => {
  it('renders one row per repo with a status emoji per package', () => {
    const table = renderMarkdownTable(rows);
    expect(table).toMatch(
      /\| LedgerHQ\/ledger-live\s+\| 🟢 0\.1\.59\s+\| 🟢 0\.1\.62\s+\| 🟢 0\.1\.29\s+\|/,
    );
    expect(table).toMatch(
      /\| LedgerHQ\/app-openpgp\s+\| 🔴 0\.1\.40 \(19 behind\)\s+\| —\s+\| 🔴 0\.1\.17 \(12 behind\)\s+\|/,
    );
  });

  it('pads every row (including the header) to the same column widths', () => {
    const lines = renderMarkdownTable(rows).split('\n');
    const [lineWidth] = new Set(lines.map((line) => [...line].length));
    expect(new Set(lines.map((line) => [...line].length)).size).toBe(1);
    expect(lineWidth).toBeGreaterThan(0);
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

describe('renderSlackReport', () => {
  it('groups rows into red, yellow and green bulleted sections', () => {
    const slack = renderSlackReport(rows, latestVersions);
    expect(slack).not.toContain('|'); // no table — bullets only
    expect(slack).toContain('🔴 Far behind / diverged');
    expect(slack).toContain(
      '• LedgerHQ/app-openpgp — ui-react 19 behind, design-core 12 behind',
    );
    expect(slack).toContain('🟡 Behind');
    expect(slack).toContain(
      '• LedgerHQ/borrow-live-app — ui-react 1 behind, design-core 1 behind',
    );
    expect(slack).toContain('🟢 On track');
    expect(slack).toContain(
      '• LedgerHQ/ledger-live — ui-react, ui-rnative, design-core',
    );
    expect(slack.indexOf('🔴 Far behind')).toBeLessThan(
      slack.indexOf('🟡 Behind'),
    );
    expect(slack.indexOf('🟡 Behind')).toBeLessThan(
      slack.indexOf('🟢 On track'),
    );
  });

  it('celebrates when everything is current, with no section headings', () => {
    const allCurrent = [rows[0]];
    const slack = renderSlackReport(allCurrent, latestVersions);
    expect(slack).not.toContain('🔴 Far behind');
    expect(slack).not.toContain('🟡 Behind');
    expect(slack).toContain('latest version');
    expect(slack).toContain('🟢 On track');
  });
});

const unresolvedRow: ReportRow = {
  repo: 'LedgerHQ/moved-repo',
  cells: {
    '@ledgerhq/lumen-ui-react': {
      status: 'unresolved',
      reason: 'apps/web/package.json not found',
    },
    '@ledgerhq/lumen-ui-rnative': {
      status: 'unresolved',
      reason: 'spec "^1.0.0 || ^2.0.0"',
    },
    '@ledgerhq/lumen-design-core': { status: 'not-used' },
  },
};

describe('unresolved cells', () => {
  it('shows the reason in the markdown table and escapes pipes', () => {
    const table = renderMarkdownTable([unresolvedRow]);
    expect(table).toContain('⚪ unresolved (apps/web/package.json not found)');
    expect(table).toContain('spec "^1.0.0 \\|\\| ^2.0.0"');
  });

  it('escapes a backslash so it cannot cancel the pipe escape after it', () => {
    const row: ReportRow = {
      repo: 'LedgerHQ/odd-spec',
      cells: {
        ...unresolvedRow.cells,
        '@ledgerhq/lumen-ui-react': {
          status: 'unresolved',
          reason: 'spec "a\\|b"',
        },
      },
    };
    expect(renderMarkdownTable([row])).toContain('spec "a\\\\\\|b"');
  });

  it('keeps every table line the same width even with escaped pipes', () => {
    const lines = renderMarkdownTable([unresolvedRow, ...rows]).split('\n');
    expect(new Set(lines.map((line) => [...line].length)).size).toBe(1);
  });

  it('counts unresolved cells in the summary line', () => {
    expect(renderSummaryLine([unresolvedRow], latestVersions)).toContain(
      '⚪ 2 unresolved',
    );
  });

  it('shows the reason in the html report', () => {
    expect(renderHtmlReport([unresolvedRow], latestVersions)).toContain(
      'unresolved (apps/web/package.json not found)',
    );
  });

  it('lists the repo in the red Slack section', () => {
    const slack = renderSlackReport([unresolvedRow], latestVersions);
    expect(slack).toContain(
      '• LedgerHQ/moved-repo — ui-react unresolved, ui-rnative unresolved',
    );
  });
});

describe('version source note', () => {
  it('explains that versions are declared ranges, not lockfile versions', () => {
    expect(renderMarkdownReport(rows, latestVersions)).toContain('lockfile');
    expect(renderHtmlReport(rows, latestVersions)).toContain('lockfile');
  });
});

describe('renderJsonReport', () => {
  it('emits a parseable snapshot with a timestamp, latest versions, summary and rows', () => {
    const generatedAt = new Date('2026-01-02T03:04:05.000Z');
    const parsed = JSON.parse(
      renderJsonReport([...rows, unresolvedRow], latestVersions, generatedAt),
    );

    expect(parsed.generatedAt).toBe('2026-01-02T03:04:05.000Z');
    expect(parsed.latest).toEqual(latestVersions);
    expect(parsed.summary).toEqual({
      current: 3,
      behind: 2,
      'far-behind': 2,
      diverged: 0,
      unresolved: 2,
    });
    expect(parsed.rows).toHaveLength(4);
    expect(parsed.rows[3].cells['@ledgerhq/lumen-ui-react']).toEqual({
      status: 'unresolved',
      reason: 'apps/web/package.json not found',
    });
  });
});
