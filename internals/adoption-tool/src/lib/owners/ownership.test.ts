import { describe, expect, it } from 'vitest';
import type { CatalogTeam } from './catalog.js';
import { buildRepoOwnership } from './ownership.js';
import { renderOwnersMarkdown, renderOwnersSummary } from './renderOwners.js';

const catalog: CatalogTeam[] = [
  {
    label: 'Earn',
    githubTeams: ['ledgerhq/earn'],
    repoLinks: [{ repo: 'earn-live-app', url: 'u' }],
  },
  {
    label: 'Web & Shop',
    githubTeams: ['ledgerhq/team-ecommerce-tech'],
    repoLinks: [],
  },
];

const codeowners = (text: string) => ({ path: '.github/CODEOWNERS', text });

describe('buildRepoOwnership', () => {
  it('combines a catalog link with CODEOWNERS', () => {
    const row = buildRepoOwnership(
      'LedgerHQ/earn-live-app',
      codeowners('* @LedgerHQ/earn'),
      catalog,
    );
    expect(row.catalogTeams).toEqual(['Earn']);
    expect(row.primaryOwners).toEqual(['@LedgerHQ/earn']);
    expect(row.source).toBe('catalog + CODEOWNERS');
  });

  it('matches an unlinked repo through a CODEOWNERS team handle, case-insensitively', () => {
    const row = buildRepoOwnership(
      'LedgerHQ/ecommerce-shop-frontend',
      codeowners('* @LedgerHQ/team-ecommerce-tech @alice'),
      catalog,
    );
    expect(row.catalogTeams).toEqual(['Web & Shop']);
    expect(row.source).toBe('catalog + CODEOWNERS');
  });

  it('falls back to CODEOWNERS alone when the catalog knows nothing', () => {
    const row = buildRepoOwnership(
      'LedgerHQ/les-multisig',
      codeowners('* @alice @bob'),
      catalog,
    );
    expect(row.catalogTeams).toEqual([]);
    expect(row.source).toBe('CODEOWNERS');
  });

  it('uses the catalog link alone when the repo has no CODEOWNERS', () => {
    const row = buildRepoOwnership(
      'LedgerHQ/earn-live-app',
      undefined,
      catalog,
    );
    expect(row.source).toBe('catalog');
    expect(row.owners).toEqual([]);
  });

  it('reports none when neither source knows the repo', () => {
    const row = buildRepoOwnership('LedgerHQ/gravitee', undefined, catalog);
    expect(row.source).toBe('none');
  });
});

describe('cross-cutting teams', () => {
  const withQa: CatalogTeam[] = [
    ...catalog,
    { label: 'QA', githubTeams: ['ledgerhq/qaa'], repoLinks: [] },
  ];

  it('is not matched through a CODEOWNERS handle', () => {
    const row = buildRepoOwnership(
      'LedgerHQ/x',
      codeowners('* @LedgerHQ/qaa'),
      withQa,
      ['QA'],
    );
    expect(row.catalogTeams).toEqual([]);
    expect(row.source).toBe('CODEOWNERS');
  });
});

describe('rendering', () => {
  const rows = [
    buildRepoOwnership(
      'LedgerHQ/earn-live-app',
      codeowners('* @LedgerHQ/earn'),
      catalog,
    ),
    buildRepoOwnership(
      'LedgerHQ/les-multisig',
      codeowners('* @alice'),
      catalog,
    ),
    buildRepoOwnership('LedgerHQ/borrow', undefined, [
      {
        label: 'Earn',
        githubTeams: [],
        repoLinks: [{ repo: 'borrow', url: 'u' }],
      },
    ]),
    buildRepoOwnership('LedgerHQ/gravitee', undefined, catalog),
  ];

  it('summary groups repos by confidence with owners under each repo', () => {
    const summary = renderOwnersSummary(rows);
    expect(summary).toContain(
      '4 repos: 1 fully mapped · 2 partial · 1 unowned',
    );
    expect(summary).toContain('• earn-live-app — Earn\n    @LedgerHQ/earn');
    expect(summary).toContain('• les-multisig\n    @alice  (not in catalog)');
    expect(summary).toContain('• borrow — Earn\n    (no CODEOWNERS)');
    expect(summary).toContain('🔴 No owner found (1)\n• gravitee');
    expect(summary).not.toContain('|');
  });

  it('summary omits empty sections', () => {
    const summary = renderOwnersSummary([rows[0]]);
    expect(summary).not.toContain('🟡');
    expect(summary).not.toContain('🔴');
  });

  it('table has one row per repo, sorted, and no owner-to-repos table', () => {
    const table = renderOwnersMarkdown(rows);
    expect(table).toContain(
      '| earn-live-app | Earn | @LedgerHQ/earn | catalog + CODEOWNERS |',
    );
    expect(table.indexOf('borrow')).toBeLessThan(
      table.indexOf('earn-live-app'),
    );
    expect(table).not.toContain('Owner → repos');
  });
});
