import { describe, expect, it } from 'vitest';
import { getPaginationRange } from './getPaginationRange';

describe('getPaginationRange', () => {
  it('should return an empty array when totalPages is 0', () => {
    expect(getPaginationRange(1, 0)).toEqual([]);
  });

  it('should return an empty array when totalPages is negative', () => {
    expect(getPaginationRange(1, -3)).toEqual([]);
  });

  it('should return a single page when totalPages is 1', () => {
    expect(getPaginationRange(1, 1)).toEqual([1]);
  });

  it('should return all pages when totalPages fits the visible window', () => {
    expect(getPaginationRange(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return all pages when totalPages equals the visible window size', () => {
    expect(getPaginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should return all pages for two pages', () => {
    expect(getPaginationRange(1, 2)).toEqual([1, 2]);
    expect(getPaginationRange(2, 2)).toEqual([1, 2]);
  });

  it('should default siblingCount to 1', () => {
    expect(getPaginationRange(10, 20)).toEqual(getPaginationRange(10, 20, 1));
  });

  it('should show a right ellipsis near the start', () => {
    expect(getPaginationRange(1, 20, 1)).toEqual([
      1,
      2,
      3,
      4,
      5,
      'ellipsis',
      20,
    ]);
  });

  it('should show a right ellipsis on the second page', () => {
    expect(getPaginationRange(2, 20, 1)).toEqual([
      1,
      2,
      3,
      4,
      5,
      'ellipsis',
      20,
    ]);
  });

  it('should show a left ellipsis near the end', () => {
    expect(getPaginationRange(20, 20, 1)).toEqual([
      1,
      'ellipsis',
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it('should show a left ellipsis on the second-to-last page', () => {
    expect(getPaginationRange(19, 20, 1)).toEqual([
      1,
      'ellipsis',
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it('should show both ellipses in the middle', () => {
    expect(getPaginationRange(10, 20, 1)).toEqual([
      1,
      'ellipsis',
      9,
      10,
      11,
      'ellipsis',
      20,
    ]);
  });

  it('should respect siblingCount', () => {
    expect(getPaginationRange(10, 20, 2)).toEqual([
      1,
      'ellipsis',
      8,
      9,
      10,
      11,
      12,
      'ellipsis',
      20,
    ]);
  });

  it('should clamp siblings when page is near the start', () => {
    expect(getPaginationRange(1, 20, 2)).toEqual([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      'ellipsis',
      20,
    ]);
  });

  it('should clamp siblings when page is near the end', () => {
    expect(getPaginationRange(20, 20, 2)).toEqual([
      1,
      'ellipsis',
      14,
      15,
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it('should support siblingCount of 0', () => {
    expect(getPaginationRange(10, 20, 0)).toEqual([
      1,
      'ellipsis',
      10,
      'ellipsis',
      20,
    ]);
  });
});
