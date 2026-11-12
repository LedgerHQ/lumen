/** One asset (a token, an icon) reduced to an id and a fingerprint of its content. */
export type Entries = Map<string, string>;

export type Diff = {
  added: string[];
  removed: string[];
  changed: string[];
  /** `before → after`: a removal and an addition with the same content. */
  renamed: [before: string, after: string][];
};

/**
 * Compares two snapshots of a kind of asset. A removed entry whose content
 * reappears under exactly one new id counts as a rename, so a reviewer sees
 * `old → new` instead of an unrelated removal and addition.
 */
export const diffEntries = (before: Entries, after: Entries): Diff => {
  const removed = [...before.keys()].filter((id) => !after.has(id));
  const added = [...after.keys()].filter((id) => !before.has(id));
  const changed = [...after.keys()].filter(
    (id) => before.has(id) && before.get(id) !== after.get(id),
  );

  const addedByContent = new Map<string, string[]>();
  for (const id of added) {
    const content = after.get(id) as string;
    addedByContent.set(content, [...(addedByContent.get(content) ?? []), id]);
  }
  const renamed: [string, string][] = [];
  for (const id of removed) {
    const candidates = addedByContent.get(before.get(id) as string);
    if (candidates?.length === 1) {
      renamed.push([id, candidates[0]]);
      addedByContent.delete(before.get(id) as string);
    }
  }
  const renamedFrom = new Set(renamed.map(([from]) => from));
  const renamedTo = new Set(renamed.map(([, to]) => to));

  return {
    added: added.filter((id) => !renamedTo.has(id)).sort(),
    removed: removed.filter((id) => !renamedFrom.has(id)).sort(),
    changed: changed.sort(),
    renamed: renamed.sort(([a], [b]) => a.localeCompare(b)),
  };
};

export const isBreaking = ({ removed, renamed }: Diff): boolean =>
  removed.length + renamed.length > 0;

const LIST_LIMIT = 50;

const list = (items: string[]): string => {
  const shown = items.slice(0, LIST_LIMIT).map((item) => `- \`${item}\``);
  if (items.length > LIST_LIMIT) {
    shown.push(`- …and ${items.length - LIST_LIMIT} more`);
  }
  return shown.join('\n');
};

/** A Markdown section per kind, for the sync PR body or a CI summary. */
export const markdownReport = (sections: Record<string, Diff>): string => {
  const parts: string[] = [];
  for (const [kind, diff] of Object.entries(sections)) {
    const { added, removed, changed, renamed } = diff;
    const total =
      added.length + removed.length + changed.length + renamed.length;
    parts.push(
      `### ${kind}: ${total === 0 ? 'no change' : `${total} change(s)`}`,
    );
    if (renamed.length) {
      parts.push(
        `**Renamed (${renamed.length})** — breaking for consumers\n${list(renamed.map(([from, to]) => `${from}\` → \`${to}`))}`,
      );
    }
    if (removed.length) {
      parts.push(
        `**Removed (${removed.length})** — breaking for consumers\n${list(removed)}`,
      );
    }
    if (changed.length)
      parts.push(`**Changed (${changed.length})**\n${list(changed)}`);
    if (added.length) parts.push(`**Added (${added.length})**\n${list(added)}`);
  }
  return `${parts.join('\n\n')}\n`;
};
