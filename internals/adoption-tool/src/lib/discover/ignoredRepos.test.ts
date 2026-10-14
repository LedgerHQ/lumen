import { describe, expect, it } from 'vitest';
import { loadConsumers, type ConsumerEntry } from '../shared/consumers.js';
import { loadIgnoredRepos, parseIgnoredRepos } from './ignoredRepos.js';

const consumers: ConsumerEntry[] = [
  {
    repo: 'LedgerHQ/app',
    status: 'production',
    packageJsonPath: 'package.json',
  },
];
const valid = { repo: 'LedgerHQ/hackathon', reason: 'Hackathon project' };

describe('parseIgnoredRepos', () => {
  it('accepts entries with a repo and a reason', () => {
    expect(parseIgnoredRepos([valid], consumers)).toEqual([valid]);
  });

  it('rejects a list that is not an array', () => {
    expect(() => parseIgnoredRepos({}, consumers)).toThrow(
      'must be a JSON array',
    );
  });

  it('requires a reason, so the decision stays documented', () => {
    expect(() =>
      parseIgnoredRepos([{ repo: 'LedgerHQ/hackathon' }], consumers),
    ).toThrow('"reason" must be a non-empty string');
    expect(() =>
      parseIgnoredRepos([{ ...valid, reason: '  ' }], consumers),
    ).toThrow('"reason" must be a non-empty string');
  });

  it('rejects unknown keys, malformed repos and duplicates', () => {
    expect(() =>
      parseIgnoredRepos([{ ...valid, reasn: 'typo' }], consumers),
    ).toThrow('unknown key "reasn"');
    expect(() =>
      parseIgnoredRepos([{ ...valid, repo: 'not-a-repo' }], consumers),
    ).toThrow('"repo" must look like "Org/name"');
    expect(() => parseIgnoredRepos([valid, valid], consumers)).toThrow(
      'duplicate repo',
    );
  });

  it('rejects a repo that is also tracked in consumers.json', () => {
    expect(() =>
      parseIgnoredRepos(
        [{ repo: 'LedgerHQ/app', reason: 'became a real consumer' }],
        consumers,
      ),
    ).toThrow('also in consumers.json');
  });
});

describe('loadIgnoredRepos', () => {
  it('loads the committed list, consistent with the committed registry', () => {
    const registry = loadConsumers('data/consumers.json');
    const ignored = loadIgnoredRepos(registry, 'data/ignored-repos.json');

    expect(ignored.length).toBeGreaterThan(0);
  });
});
