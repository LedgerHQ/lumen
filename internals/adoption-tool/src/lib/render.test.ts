import { describe, expect, it } from 'vitest';
import type { LumenPackage } from '../config.js';
import {
  renderMarkdownTable,
  renderSummaryLine,
  renderSlackReport,
} from './render.js';
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
