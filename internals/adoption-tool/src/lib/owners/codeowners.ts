export type CodeownersRule = { pattern: string; owners: string[] };

export type OwnerSummary = {
  owner: string;
  rules: number;
  isDefault: boolean;
};

/** GitHub resolves the first of these that exists, in this order. */
export const CODEOWNERS_PATHS = [
  '.github/CODEOWNERS',
  'CODEOWNERS',
  'docs/CODEOWNERS',
] as const;

export function parseCodeowners(text: string): CodeownersRule[] {
  const rules: CodeownersRule[] = [];
  for (const rawLine of text.split('\n')) {
    // A `#` only starts a comment at line start or after whitespace, so
    // patterns with an escaped `\#` survive.
    const line = rawLine.replace(/(^|\s)#.*$/, '').trim();
    if (!line) continue;

    const [pattern, ...tokens] = line.split(/\s+/);
    const owners = tokens.filter((token) => token.includes('@'));
    // A pattern with no owner un-owns a path; it says nothing about who owns
    // the repo, so it is not a rule for our purposes.
    if (owners.length > 0) rules.push({ pattern, owners });
  }
  return rules;
}

/** Owners of the `*` catch-all first, then by how many rules name them. */
export function summarizeOwners(rules: CodeownersRule[]): OwnerSummary[] {
  const summaries = new Map<string, OwnerSummary>();
  for (const rule of rules) {
    for (const owner of rule.owners) {
      const summary = summaries.get(owner) ?? {
        owner,
        rules: 0,
        isDefault: false,
      };
      summary.rules += 1;
      if (rule.pattern === '*') summary.isDefault = true;
      summaries.set(owner, summary);
    }
  }

  return [...summaries.values()].sort(
    (a, b) =>
      Number(b.isDefault) - Number(a.isDefault) ||
      b.rules - a.rules ||
      a.owner.localeCompare(b.owner),
  );
}

const FALLBACK_PRIMARY_OWNERS = 3;

/**
 * The owners worth headlining for a repo: whoever owns the `*` catch-all, or
 * — when there is none — the few most-referenced owners. Big monorepos name
 * dozens of teams in path-specific rules; listing them all buries the answer.
 */
export function primaryOwners(summaries: OwnerSummary[]): string[] {
  const defaults = summaries.filter((summary) => summary.isDefault);
  const picked =
    defaults.length > 0
      ? defaults
      : summaries.slice(0, FALLBACK_PRIMARY_OWNERS);
  return picked.map((summary) => summary.owner);
}
