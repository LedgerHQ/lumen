export type CatalogRepoLink = { repo: string; url: string };

export type CatalogTeam = {
  label: string;
  catalogId?: string;
  /** Lowercased `org/slug`, matching how GitHub compares team handles. */
  githubTeams: string[];
  repoLinks: CatalogRepoLink[];
};

const TEAM_LINE = /^[\w-]+\s*=\s*team\s+'([^']*)'/;
const GITHUB_LINK =
  /\blink\s+(https?:\/\/github\.com\/ledgerhq\/([\w.-]+)[^\s'"]*)/i;

function braceDelta(line: string): number {
  return line.split('{').length - line.split('}').length;
}

/**
 * Reads the architecture-as-code LikeC4 model: every `team` block carries
 * `github-teams` metadata, and the containers nested inside it carry the
 * `link https://github.com/LedgerHQ/<repo>[/tree/...]` that ties a repo (or a
 * sub-path of a monorepo) to that team. Line-based on purpose — the files are
 * regular and a full LikeC4 parser would be a heavy dependency for this.
 */
export function parseCatalogTeams(c4Text: string): CatalogTeam[] {
  const teams: CatalogTeam[] = [];
  let current: CatalogTeam | undefined;
  let openDepth = 0;
  let depth = 0;

  for (const rawLine of c4Text.split('\n')) {
    const line = rawLine.trim();
    const teamMatch = TEAM_LINE.exec(line);

    if (teamMatch) {
      current = { label: teamMatch[1], githubTeams: [], repoLinks: [] };
      teams.push(current);
      openDepth = depth;
    } else if (current) {
      const catalogId = /catalog-id\s+'([^']*)'/.exec(line);
      if (catalogId) current.catalogId = catalogId[1];

      const githubTeams = /github-teams\s+\[(.*?)\]/.exec(line);
      if (githubTeams) {
        current.githubTeams = [...githubTeams[1].matchAll(/'([^']*)'/g)].map(
          (match) => match[1].toLowerCase(),
        );
      }

      const link = GITHUB_LINK.exec(line);
      if (link) current.repoLinks.push({ url: link[1], repo: link[2] });
    }

    depth += braceDelta(line);
    if (current && !teamMatch && depth <= openDepth && line.includes('}')) {
      current = undefined;
    }
  }

  return teams;
}

export function normalizeGithubHandle(handle: string): string {
  return handle.replace(/^@/, '').toLowerCase();
}
