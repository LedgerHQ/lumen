import { describe, expect, it } from '@jest/globals';

import {
  getCategoricalScale,
  getNumericScale,
  isBandScaleType,
  isCategoricalScale,
  isNumericScale,
  projectPoint,
} from './scales';

describe('getNumericScale', () => {
  it('should create a linear scale mapping domain to range', () => {
    const scale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 0, max: 100 },
      range: { min: 0, max: 500 },
    });
    expect(scale(0)).toBe(0);
    expect(scale(50)).toBe(250);
    expect(scale(100)).toBe(500);
  });

  it('should create a log scale', () => {
    const scale = getNumericScale({
      scaleType: 'log',
      domain: { min: 1, max: 1000 },
      range: { min: 0, max: 300 },
    });
    expect(scale(1)).toBe(0);
    expect(scale(1000)).toBe(300);
  });

  it('should set correct domain', () => {
    const scale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 10, max: 50 },
      range: { min: 0, max: 200 },
    });
    const domain = scale.domain();
    expect(domain[0]).toBe(10);
    expect(domain[1]).toBe(50);
  });

  it('should set correct range', () => {
    const scale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 0, max: 100 },
      range: { min: 20, max: 400 },
    });
    const range = scale.range();
    expect(range[0]).toBe(20);
    expect(range[1]).toBe(400);
  });
});

describe('getCategoricalScale', () => {
  it('should create a band scale with correct domain', () => {
    const scale = getCategoricalScale({
      domain: { min: 0, max: 3 },
      range: { min: 0, max: 400 },
      padding: 0,
    });
    expect(scale.domain()).toEqual([0, 1, 2, 3]);
  });

  it('should have non-zero bandwidth', () => {
    const scale = getCategoricalScale({
      domain: { min: 0, max: 4 },
      range: { min: 0, max: 500 },
    });
    expect(scale.bandwidth()).toBeGreaterThan(0);
  });

  it('should map values within the range', () => {
    const scale = getCategoricalScale({
      domain: { min: 0, max: 2 },
      range: { min: 0, max: 300 },
      padding: 0,
    });
    expect(scale(0)).toBeGreaterThanOrEqual(0);
    expect((scale(2) ?? 0) + scale.bandwidth()).toBeLessThanOrEqual(300);
  });

  it('should handle custom domain offset', () => {
    const scale = getCategoricalScale({
      domain: { min: 5, max: 7 },
      range: { min: 0, max: 300 },
      padding: 0,
    });
    expect(scale.domain()).toEqual([5, 6, 7]);
  });
});

describe('isBandScaleType', () => {
  it('should return true for band scale type', () => {
    expect(isBandScaleType('band')).toBe(true);
  });

  it('should return false for linear scale type', () => {
    expect(isBandScaleType('linear')).toBe(false);
  });

  it('should return false for log scale type', () => {
    expect(isBandScaleType('log')).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isBandScaleType(undefined)).toBe(false);
  });
});

describe('isCategoricalScale / isNumericScale', () => {
  const numericScale = getNumericScale({
    scaleType: 'linear',
    domain: { min: 0, max: 100 },
    range: { min: 0, max: 500 },
  });

  const bandScale = getCategoricalScale({
    domain: { min: 0, max: 4 },
    range: { min: 0, max: 500 },
  });

  it('should identify a numeric scale', () => {
    expect(isNumericScale(numericScale)).toBe(true);
    expect(isCategoricalScale(numericScale)).toBe(false);
  });

  it('should identify a categorical scale', () => {
    expect(isCategoricalScale(bandScale)).toBe(true);
    expect(isNumericScale(bandScale)).toBe(false);
  });
});

describe('projectPoint', () => {
  it('should project using two linear scales', () => {
    const xScale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 0, max: 10 },
      range: { min: 0, max: 500 },
    });
    const yScale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 0, max: 100 },
      range: { min: 300, max: 0 },
    });

    const pt = projectPoint(5, 50, xScale, yScale);
    expect(pt.x).toBe(250);
    expect(pt.y).toBe(150);
  });

  it('should center on band for a categorical x scale', () => {
    const xScale = getCategoricalScale({
      domain: { min: 0, max: 3 },
      range: { min: 0, max: 400 },
      padding: 0,
    });
    const yScale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 0, max: 100 },
      range: { min: 200, max: 0 },
    });

    const pt = projectPoint(1, 50, xScale, yScale);
    const expectedX = (xScale(1) ?? 0) + xScale.bandwidth() / 2;
    expect(pt.x).toBe(expectedX);
    expect(pt.y).toBe(100);
  });

  it('should handle edge values at domain boundaries', () => {
    const xScale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 0, max: 10 },
      range: { min: 0, max: 500 },
    });
    const yScale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 0, max: 100 },
      range: { min: 300, max: 0 },
    });

    expect(projectPoint(0, 0, xScale, yScale)).toEqual({ x: 0, y: 300 });
    expect(projectPoint(10, 100, xScale, yScale)).toEqual({ x: 500, y: 0 });
  });
});
