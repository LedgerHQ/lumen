import { describe, expect, it } from 'vitest';
import type { RepoOwnership } from './ownership.js';
import { renderOwnersMarkdown, renderOwnersSummary } from './renderOwners.js';

function ownership(
  overrides: Partial<RepoOwnership> & { repo: string },
): RepoOwnership {
  return {
    owners: [],
    primaryOwners: [],
    catalogTeams: [],
    source: 'none',
    ...overrides,
  };
}

const owner = (
  name: string,
  isDefault = true,
): RepoOwnership['owners'][number] => ({
  owner: name,
  rules: 1,
  isDefault,
});

const both = ownership({
  repo: 'LedgerHQ/zeta',
  owners: [owner('@LedgerHQ/wallet')],
  primaryOwners: ['@LedgerHQ/wallet'],
  catalogTeams: ['Wallet Team'],
  source: 'catalog + CODEOWNERS',
});
const codeownersOnly = ownership({
  repo: 'LedgerHQ/alpha',
  owners: [owner('@LedgerHQ/infra')],
  primaryOwners: ['@LedgerHQ/infra'],
  source: 'CODEOWNERS',
});
const catalogOnly = ownership({
  repo: 'LedgerHQ/mid',
  catalogTeams: ['Design System Team'],
  source: 'catalog',
});
const unowned = ownership({ repo: 'LedgerHQ/orphan' });

describe('renderOwnersMarkdown', () => {
  it('lists repos alphabetically with short names, dashes for empty cells and the source', () => {
    const lines = renderOwnersMarkdown([
      both,
      unowned,
      codeownersOnly,
      catalogOnly,
    ]).split('\n');

    expect(lines[0]).toBe('| Repo | Catalog team | Code owners | Source |');
    expect(lines.slice(2)).toEqual([
      '| alpha | — | @LedgerHQ/infra | CODEOWNERS |',
      '| mid | Design System Team | — | catalog |',
      '| orphan | — | — | none |',
      '| zeta | Wallet Team | @LedgerHQ/wallet | catalog + CODEOWNERS |',
    ]);
  });

  it('truncates long owner lists with a "+N more" overflow', () => {
    const many = ownership({
      repo: 'LedgerHQ/big',
      owners: ['a', 'b', 'c', 'd', 'e', 'f'].map((name) => owner(`@o/${name}`)),
      primaryOwners: ['a', 'b', 'c', 'd', 'e', 'f'].map((name) => `@o/${name}`),
      source: 'CODEOWNERS',
    });
    expect(renderOwnersMarkdown([many])).toContain(
      '@o/a, @o/b, @o/c, @o/d (+2 more)',
    );
  });
});

describe('renderOwnersSummary', () => {
  const summary = renderOwnersSummary([
    both,
    codeownersOnly,
    catalogOnly,
    unowned,
  ]);

  it('opens with the counts per confidence tier', () => {
    expect(summary.split('\n')[0]).toBe(
      '👥 4 repos: 1 fully mapped · 2 partial · 1 unowned',
    );
  });

  it('groups repos by how confident the ownership is', () => {
    expect(summary).toContain(
      '🟢 Catalog team + CODEOWNERS (1)\n• zeta — Wallet Team\n    @LedgerHQ/wallet',
    );
    expect(summary).toContain('🟡 Only one source (2)');
    expect(summary).toContain('🔴 No owner found (1)\n• orphan');
  });

  it('flags CODEOWNERS-only repos as not in the catalog and catalog-only repos as lacking CODEOWNERS', () => {
    expect(summary).toContain('• alpha\n    @LedgerHQ/infra  (not in catalog)');
    expect(summary).toContain(
      '• mid — Design System Team\n    (no CODEOWNERS)',
    );
  });

  it('omits empty sections', () => {
    const onlyOwned = renderOwnersSummary([both]);
    expect(onlyOwned).not.toContain('🟡');
    expect(onlyOwned).not.toContain('🔴');
  });
});
