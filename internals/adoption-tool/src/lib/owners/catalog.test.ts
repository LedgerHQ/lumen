import { describe, expect, it } from 'vitest';
import { parseCatalogTeams } from './catalog.js';

const SAMPLE = `model {
  earn = subdomain 'Earn' {
    earn-team = team 'Earn Team' {
      summary 'Earn.'
      metadata {
        catalog-id 'EarnTeam'
        github-teams ['LedgerHQ/Earn', 'LedgerHQ/earn-be']
      }
      earn-app = container 'Earn app' {
        link https://github.com/LedgerHQ/earn-live-app
        link https://github.com/LedgerHQ/ledger-live/tree/develop/apps/x 'Live'
      }
    }
    other = container 'Not in a team' {
      link https://github.com/LedgerHQ/orphan
    }
  }
  swap-team = team 'Swap Team' {
    metadata {
      github-teams ['LedgerHQ/swap']
    }
  }
}`;

describe('parseCatalogTeams', () => {
  const teams = parseCatalogTeams(SAMPLE);

  it('finds each team with its lowercased GitHub handles and catalog id', () => {
    expect(teams.map((team) => team.label)).toEqual(['Earn Team', 'Swap Team']);
    expect(teams[0].catalogId).toBe('EarnTeam');
    expect(teams[0].githubTeams).toEqual(['ledgerhq/earn', 'ledgerhq/earn-be']);
    expect(teams[1].githubTeams).toEqual(['ledgerhq/swap']);
  });

  it('attaches repo links to the enclosing team, including monorepo sub-paths', () => {
    expect(teams[0].repoLinks.map((link) => link.repo)).toEqual([
      'earn-live-app',
      'ledger-live',
    ]);
  });

  it('ignores links outside any team block', () => {
    const all = teams.flatMap((team) =>
      team.repoLinks.map((link) => link.repo),
    );
    expect(all).not.toContain('orphan');
  });
});
