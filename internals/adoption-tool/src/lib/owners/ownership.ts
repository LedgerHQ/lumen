import { normalizeGithubHandle, type CatalogTeam } from './catalog.js';
import {
  parseCodeowners,
  primaryOwners,
  summarizeOwners,
  type OwnerSummary,
} from './codeowners.js';

export type OwnershipSource =
  | 'catalog + CODEOWNERS'
  | 'catalog'
  | 'CODEOWNERS'
  | 'none';

export type RepoOwnership = {
  repo: string;
  codeownersPath?: string;
  owners: OwnerSummary[];
  primaryOwners: string[];
  /** Catalog teams that link the repo directly, or own a CODEOWNERS team. */
  catalogTeams: string[];
  source: OwnershipSource;
};

function repoName(fullName: string): string {
  return (fullName.split('/').pop() ?? fullName).toLowerCase();
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

/**
 * Two independent routes to a repo's owners, deliberately combined: the
 * catalog only links some repos, and the repo's own CODEOWNERS names GitHub
 * team slugs that we can match back to a catalog team via `github-teams`.
 * Either alone leaves gaps; together they cover most consumers.
 */
export function buildRepoOwnership(
  repo: string,
  codeowners: { path: string; text: string } | undefined,
  catalog: CatalogTeam[],
  crossCuttingTeams: string[] = [],
): RepoOwnership {
  const summaries = codeowners
    ? summarizeOwners(parseCodeowners(codeowners.text))
    : [];

  const linkedTeams = catalog
    .filter((team) =>
      team.repoLinks.some((link) => link.repo.toLowerCase() === repoName(repo)),
    )
    .map((team) => team.label);

  const ownerHandles = new Set(
    summaries.map((summary) => normalizeGithubHandle(summary.owner)),
  );
  const ownerTeams = catalog
    .filter((team) => !crossCuttingTeams.includes(team.label))
    .filter((team) =>
      team.githubTeams.some((handle) => ownerHandles.has(handle)),
    )
    .map((team) => team.label);

  const catalogTeams = unique([...linkedTeams, ...ownerTeams]);
  const hasCatalog = catalogTeams.length > 0;
  const hasCodeowners = summaries.length > 0;

  return {
    repo,
    codeownersPath: codeowners?.path,
    owners: summaries,
    primaryOwners: primaryOwners(summaries),
    catalogTeams,
    source:
      hasCatalog && hasCodeowners
        ? 'catalog + CODEOWNERS'
        : hasCatalog
          ? 'catalog'
          : hasCodeowners
            ? 'CODEOWNERS'
            : 'none',
  };
}
