import type { OwnershipSource, RepoOwnership } from './ownership.js';

const MAX_LISTED = 4;

function shortName(repo: string): string {
  return repo.split('/').pop() ?? repo;
}

function listWithOverflow(values: string[], total = values.length): string {
  if (total === 0) return '—';
  const shown = values.slice(0, MAX_LISTED).join(', ');
  const hidden = total - Math.min(values.length, MAX_LISTED);
  return hidden > 0 ? `${shown} (+${hidden} more)` : shown;
}

function ownersText(row: RepoOwnership): string {
  return listWithOverflow(row.primaryOwners, row.owners.length);
}

function bySource(
  rows: RepoOwnership[],
  sources: OwnershipSource[],
): RepoOwnership[] {
  return rows
    .filter((row) => sources.includes(row.source))
    .sort((a, b) => a.repo.localeCompare(b.repo));
}

/** Full repo → owners table, for pasting into a PR or doc. */
export function renderOwnersMarkdown(rows: RepoOwnership[]): string {
  const sorted = [...rows].sort((a, b) => a.repo.localeCompare(b.repo));

  return [
    '| Repo | Catalog team | Code owners | Source |',
    '| --- | --- | --- | --- |',
    ...sorted.map(
      (row) =>
        `| ${shortName(row.repo)} | ${listWithOverflow(row.catalogTeams)} | ${ownersText(row)} | ${row.source} |`,
    ),
  ].join('\n');
}

/**
 * Terminal-friendly view: wide tables wrap badly in a terminal, so each repo
 * gets two short lines, grouped by how confident the ownership is.
 */
export function renderOwnersSummary(rows: RepoOwnership[]): string {
  const complete = bySource(rows, ['catalog + CODEOWNERS']);
  const partial = bySource(rows, ['catalog', 'CODEOWNERS']);
  const none = bySource(rows, ['none']);

  const repoLines = (row: RepoOwnership): string[] => {
    const teams =
      row.catalogTeams.length > 0
        ? ` — ${listWithOverflow(row.catalogTeams)}`
        : '';
    const owners =
      row.owners.length > 0
        ? `${ownersText(row)}${row.source === 'CODEOWNERS' ? '  (not in catalog)' : ''}`
        : '(no CODEOWNERS)';
    return [`• ${shortName(row.repo)}${teams}`, `    ${owners}`];
  };

  const section = (heading: string, group: RepoOwnership[]): string[] =>
    group.length === 0 ? [] : [heading, ...group.flatMap(repoLines), ''];

  const noneSection =
    none.length === 0
      ? []
      : [
          `🔴 No owner found (${none.length})`,
          ...none.map((row) => `• ${shortName(row.repo)}`),
          '',
        ];

  return [
    `👥 ${rows.length} repos: ${complete.length} fully mapped · ${partial.length} partial · ${none.length} unowned`,
    '',
    ...section(`🟢 Catalog team + CODEOWNERS (${complete.length})`, complete),
    ...section(`🟡 Only one source (${partial.length})`, partial),
    ...noneSection,
  ]
    .join('\n')
    .trimEnd();
}
