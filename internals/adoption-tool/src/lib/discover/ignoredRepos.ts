import { readFileSync } from 'node:fs';
import { IGNORED_REPOS_DATA_PATH } from '../../config.js';
import {
  isRecord,
  REPO_PATTERN,
  type ConsumerEntry,
} from '../shared/consumers.js';

export type IgnoredRepo = {
  repo: string;
  /** Why it is not a consumer (hackathon, POC, sandbox…), so the decision
   * isn't re-litigated on every `discover` run. */
  reason: string;
};

const ENTRY_KEYS = ['repo', 'reason'];

function validateEntry(entry: unknown): string[] {
  if (!isRecord(entry)) return ['must be an object'];

  const errors = Object.keys(entry)
    .filter((key) => !ENTRY_KEYS.includes(key))
    .map((key) => `unknown key "${key}"`);

  if (typeof entry.repo !== 'string' || !REPO_PATTERN.test(entry.repo)) {
    errors.push('"repo" must look like "Org/name"');
  }
  if (typeof entry.reason !== 'string' || entry.reason.trim() === '') {
    errors.push('"reason" must be a non-empty string');
  }
  return errors;
}

/**
 * Repos that use Lumen but are deliberately not tracked. A repo can't be both
 * ignored and tracked: once it becomes a real consumer it must be removed from
 * this list, otherwise `discover` would keep hiding a registry problem.
 */
export function parseIgnoredRepos(
  raw: unknown,
  consumers: ConsumerEntry[],
): IgnoredRepo[] {
  if (!Array.isArray(raw)) {
    throw new Error('ignored repos list must be a JSON array');
  }

  const errors: string[] = [];
  const trackedRepos = new Set(consumers.map((entry) => entry.repo));
  const seenRepos = new Set<string>();
  raw.forEach((entry: unknown, index) => {
    const label = isRecord(entry) ? String(entry.repo) : `#${index}`;
    errors.push(
      ...validateEntry(entry).map((message) => `${label}: ${message}`),
    );
    if (isRecord(entry) && typeof entry.repo === 'string') {
      if (seenRepos.has(entry.repo)) errors.push(`${label}: duplicate repo`);
      if (trackedRepos.has(entry.repo)) {
        errors.push(
          `${label}: also in consumers.json — remove it from one of the two lists`,
        );
      }
      seenRepos.add(entry.repo);
    }
  });

  if (errors.length > 0) {
    throw new Error(
      `Invalid ignored repos list:\n${errors.map((error) => `  - ${error}`).join('\n')}`,
    );
  }
  return raw as IgnoredRepo[];
}

export function loadIgnoredRepos(
  consumers: ConsumerEntry[],
  path = IGNORED_REPOS_DATA_PATH,
): IgnoredRepo[] {
  return parseIgnoredRepos(JSON.parse(readFileSync(path, 'utf-8')), consumers);
}
