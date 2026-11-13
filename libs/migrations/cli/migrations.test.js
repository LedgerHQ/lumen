import { describe, expect, it } from 'vitest';
import { index } from './fixtures.js';
import { selectMigrations } from './migrations.js';

const react = '@ledgerhq/lumen-ui-react';

/**
 * @param {import('./migrations.js').Range} range
 * @returns {string[]}
 */
const ids = (range) => selectMigrations(index, range).map(({ id }) => id);

describe('selectMigrations', () => {
  it('returns every migration without a range', () => {
    expect(ids({})).toHaveLength(3);
  });

  it('keeps the migrations of a package, released or not', () => {
    expect(ids({ package: '@ledgerhq/lumen-ui-rnative' })).toEqual([
      'card-disabled',
    ]);
    expect(ids({ package: react })).toHaveLength(3);
  });

  it('excludes from and includes to', () => {
    expect(ids({ package: react, from: '0.1.2', to: '0.1.3' })).toEqual([
      'card-disabled',
    ]);
    expect(ids({ package: react, from: '0.1.1', to: '0.1.2' })).toEqual([
      'menu-item-on-click',
    ]);
  });

  it('leaves the upper bound open without to, and drops unreleased', () => {
    expect(ids({ package: react, from: '0.1.0' })).toEqual([
      'menu-item-on-click',
      'card-disabled',
    ]);
  });

  it('is empty when nothing was introduced in range', () => {
    expect(ids({ package: react, from: '0.1.3', to: '0.2.0' })).toEqual([]);
  });
});
