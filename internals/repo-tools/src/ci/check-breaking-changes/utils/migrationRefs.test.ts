import { describe, expect, it } from 'vitest';
import type { ApiChange } from '../apiDiff.ts';
import { type Migration, pendingRefs, uncovered } from './migrationRefs.ts';

const name = '@ledgerhq/lumen-ui-react';

const removed = (ref: string): ApiChange => ({
  change: 'removed',
  surface: 'export',
  ref,
});

const migration = (
  introduced: Migration['introduced'],
  ref: string,
): Migration => ({ introduced, changes: [{ ref }] });

describe('pendingRefs', () => {
  it('keeps refs of migrations not released in the package yet', () => {
    const migrations = [
      migration({ [name]: null }, 'pkg#Unreleased'),
      migration({ [name]: '0.1.74' }, 'pkg#Newer'),
      migration({ [name]: '0.1.60' }, 'pkg#Shipped'),
      migration({ [name]: '0.1.73' }, 'pkg#Current'),
      migration({ '@ledgerhq/lumen-ui-rnative': null }, 'pkg#Other'),
    ];

    expect(pendingRefs(migrations, name, '0.1.73')).toEqual([
      'pkg#Unreleased',
      'pkg#Newer',
    ]);
  });
});

describe('uncovered', () => {
  it('keeps the changes no ref matches exactly', () => {
    const changes = [removed('pkg#Button.size=xs'), removed('pkg#Button.size')];

    expect(uncovered(changes, ['pkg#Button.size=xs'])).toEqual([
      removed('pkg#Button.size'),
    ]);
  });

  it('lets `*` match any text', () => {
    const changes = [
      removed('pkg#themes.dark.bg.error'),
      removed('pkg#themes.light.bg.error'),
      removed('pkg#themes.light.bg.muted'),
    ];

    expect(uncovered(changes, ['pkg#themes.*.bg.error'])).toEqual([
      removed('pkg#themes.light.bg.muted'),
    ]);
  });

  it('treats other regex characters literally', () => {
    expect(uncovered([removed('pkg#AxB')], ['pkg#A.B'])).toHaveLength(1);
  });
});
