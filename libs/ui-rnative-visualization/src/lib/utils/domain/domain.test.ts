import { describe, expect, it } from '@jest/globals';

import type { Series } from '../types';

import { computeDataLength, computeXDomain, computeYDomain } from './domain';

const makeSeries = (data: (number | null)[]): Series => ({
  id: 'test',
  stroke: '#000',
  data,
});

describe('computeXDomain', () => {
  it('should derive domain from longest series length', () => {
    const result = computeXDomain([
      makeSeries([1, 2, 3]),
      makeSeries([1, 2, 3, 4, 5]),
    ]);
    expect(result).toEqual({ min: 0, max: 4 });
  });

  it('should return { 0, 0 } for empty series', () => {
    const result = computeXDomain([]);
    expect(result).toEqual({ min: 0, max: 0 });
  });

  it('should use string axis data length', () => {
    const result = computeXDomain([makeSeries([1, 2])], {
      data: ['Mon', 'Tue', 'Wed'],
    });
    expect(result).toEqual({ min: 0, max: 2 });
  });

  it('should use numeric axis data min/max', () => {
    const result = computeXDomain([makeSeries([1])], { data: [10, 30, 20] });
    expect(result).toEqual({ min: 10, max: 30 });
  });

  it('should apply partial domain override', () => {
    const result = computeXDomain([makeSeries([1, 2, 3, 4, 5])], {
      domain: { min: 1 },
    });
    expect(result.min).toBe(1);
    expect(result.max).toBe(4);
  });

  it('should apply full domain override', () => {
    const result = computeXDomain([makeSeries([1, 2, 3])], {
      domain: { min: 0, max: 10 },
    });
    expect(result).toEqual({ min: 0, max: 10 });
  });

  it('should apply domain function override', () => {
    const result = computeXDomain([makeSeries([1, 2, 3, 4, 5])], {
      domain: (bounds: { min: number; max: number }) => ({
        min: bounds.min - 1,
        max: bounds.max + 1,
      }),
    });
    expect(result).toEqual({ min: -1, max: 5 });
  });
});

describe('computeYDomain', () => {
  it('should find min/max across all series values', () => {
    const result = computeYDomain([
      makeSeries([10, 50, 30]),
      makeSeries([5, 80]),
    ]);
    expect(result).toEqual({ min: 5, max: 80 });
  });

  it('should skip null values', () => {
    const result = computeYDomain([makeSeries([null, 10, null, 30, null])]);
    expect(result).toEqual({ min: 10, max: 30 });
  });

  it('should return { 0, 1 } when no data values exist', () => {
    const result = computeYDomain([makeSeries([])]);
    expect(result).toEqual({ min: 0, max: 1 });
  });

  it('should handle series without data', () => {
    const result = computeYDomain([{ id: 's', stroke: '#000' }]);
    expect(result).toEqual({ min: 0, max: 1 });
  });

  it('should apply partial domain override', () => {
    const result = computeYDomain([makeSeries([10, 50])], {
      domain: { min: 0 },
    });
    expect(result).toEqual({ min: 0, max: 50 });
  });

  it('should apply domain function override', () => {
    const result = computeYDomain([makeSeries([10, 20, 30])], {
      domain: (bounds: { min: number; max: number }) => ({
        min: bounds.min - 5,
        max: bounds.max + 5,
      }),
    });
    expect(result).toEqual({ min: 5, max: 35 });
  });
});

describe('computeDataLength', () => {
  it('should return longest series length', () => {
    expect(
      computeDataLength([makeSeries([1, 2]), makeSeries([1, 2, 3, 4])]),
    ).toBe(4);
  });

  it('should return 0 for empty series', () => {
    expect(computeDataLength([])).toBe(0);
  });

  it('should prefer axis data length when provided', () => {
    expect(
      computeDataLength([makeSeries([1, 2, 3])], {
        data: ['A', 'B', 'C', 'D', 'E'],
      }),
    ).toBe(5);
  });

  it('should handle series without data', () => {
    expect(computeDataLength([{ id: 's', stroke: '#000' }])).toBe(0);
  });
});
