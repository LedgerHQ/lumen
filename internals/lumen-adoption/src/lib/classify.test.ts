import { describe, expect, it } from 'vitest';
import { classifyVersion } from './classify.js';

describe('classifyVersion', () => {
  it('is current when the version matches latest', () => {
    expect(classifyVersion('0.1.59', '0.1.59', 5)).toEqual({
      status: 'current',
      patchesBehind: 0,
    });
  });

  it('is current when the version is ahead of latest (e.g. a next/canary pin)', () => {
    expect(classifyVersion('0.1.60', '0.1.59', 5)).toEqual({
      status: 'current',
      patchesBehind: 0,
    });
  });

  it('is behind for a small patch gap under the threshold', () => {
    expect(classifyVersion('0.1.56', '0.1.59', 5)).toEqual({
      status: 'behind',
      patchesBehind: 3,
    });
  });

  it('is far-behind at exactly the threshold', () => {
    expect(classifyVersion('0.1.54', '0.1.59', 5)).toEqual({
      status: 'far-behind',
      patchesBehind: 5,
    });
  });

  it('is far-behind well past the threshold', () => {
    expect(classifyVersion('0.1.0', '0.1.59', 5)).toEqual({
      status: 'far-behind',
      patchesBehind: 59,
    });
  });

  it('is diverged when major differs', () => {
    expect(classifyVersion('1.0.0', '0.1.59', 5)).toEqual({
      status: 'diverged',
    });
  });

  it('is diverged when minor differs', () => {
    expect(classifyVersion('0.2.0', '0.1.59', 5)).toEqual({
      status: 'diverged',
    });
  });

  it('is unresolved for an unparseable version', () => {
    expect(classifyVersion('catalog:', '0.1.59', 5)).toEqual({
      status: 'unresolved',
    });
  });
});
