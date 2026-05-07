import { describe, expect, it, vi } from 'vitest';

import {
  getCategoricalScale,
  getNumericScale,
} from '../../utils/scales/scales';
import {
  getDataIndexFromPosition,
  resolvePixelX,
  resolvePixelY,
} from './utils';

describe('getDataIndexFromPosition', () => {
  describe('with a categorical (band) scale', () => {
    const scale = getCategoricalScale({
      domain: { min: 0, max: 3 },
      range: { min: 0, max: 400 },
      padding: 0,
    });

    it('returns 0 for a position at the center of the first band', () => {
      const bandwidth = scale.bandwidth();
      const center0 = (scale(0) ?? 0) + bandwidth / 2;
      expect(getDataIndexFromPosition(center0, scale, undefined, 4)).toBe(0);
    });

    it('returns 1 for a position at the center of the second band', () => {
      const bandwidth = scale.bandwidth();
      const center1 = (scale(1) ?? 0) + bandwidth / 2;
      expect(getDataIndexFromPosition(center1, scale, undefined, 4)).toBe(1);
    });

    it('returns the nearest band for a position between bands', () => {
      expect(getDataIndexFromPosition(190, scale, undefined, 4)).toBe(1);
      expect(getDataIndexFromPosition(210, scale, undefined, 4)).toBe(2);
    });

    it('returns 3 (last) for a position beyond the last band', () => {
      expect(getDataIndexFromPosition(500, scale, undefined, 4)).toBe(3);
    });
  });

  describe('with a numeric (linear) scale and no axisData', () => {
    const scale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 0, max: 4 },
      range: { min: 0, max: 400 },
    });

    it('returns 0 for pixel 0', () => {
      expect(getDataIndexFromPosition(0, scale, undefined, 5)).toBe(0);
    });

    it('returns 2 for pixel 200 (midpoint)', () => {
      expect(getDataIndexFromPosition(200, scale, undefined, 5)).toBe(2);
    });

    it('clamps to 0 for negative positions', () => {
      expect(getDataIndexFromPosition(-50, scale, undefined, 5)).toBe(0);
    });

    it('clamps to dataLength-1 for positions beyond range', () => {
      expect(getDataIndexFromPosition(600, scale, undefined, 5)).toBe(4);
    });
  });

  describe('with a numeric scale and numeric axisData', () => {
    const scale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 10, max: 30 },
      range: { min: 0, max: 200 },
    });
    const axisConfig = { data: [10, 20, 30] as number[] };

    it('returns 0 for pixel closest to first data point', () => {
      expect(getDataIndexFromPosition(10, scale, axisConfig, 3)).toBe(0);
    });

    it('returns 1 for pixel closest to middle data point', () => {
      expect(getDataIndexFromPosition(100, scale, axisConfig, 3)).toBe(1);
    });

    it('returns 2 for pixel closest to last data point', () => {
      expect(getDataIndexFromPosition(195, scale, axisConfig, 3)).toBe(2);
    });
  });
});

describe('resolvePixelY', () => {
  const numericScale = getNumericScale({
    scaleType: 'linear',
    domain: { min: 0, max: 100 },
    range: { min: 0, max: 200 },
  });

  const getYScale = vi.fn(() => numericScale);

  it('returns a pixel value for a valid data point', () => {
    const result = resolvePixelY(1, [10, 50, 90], getYScale);
    expect(typeof result).toBe('number');
  });

  it('returns undefined when getYScale returns undefined', () => {
    const noScale = vi.fn(() => undefined);
    expect(resolvePixelY(0, [10], noScale)).toBeUndefined();
  });

  it('returns undefined when seriesData is undefined', () => {
    expect(resolvePixelY(0, undefined, getYScale)).toBeUndefined();
  });

  it('returns undefined when the value at dataIndex is null', () => {
    expect(resolvePixelY(1, [10, null, 30], getYScale)).toBeUndefined();
  });

  it('returns undefined when the value at dataIndex is out of bounds', () => {
    expect(resolvePixelY(5, [10, 20], getYScale)).toBeUndefined();
  });
});

describe('resolvePixelX', () => {
  const numericScale = getNumericScale({
    scaleType: 'linear',
    domain: { min: 0, max: 4 },
    range: { min: 0, max: 400 },
  });

  it('returns a pixel value when a scale is available', () => {
    const getXScale = vi.fn(() => numericScale);
    const result = resolvePixelX(2, getXScale);
    expect(typeof result).toBe('number');
  });

  it('returns undefined when getXScale returns undefined', () => {
    const noScale = vi.fn(() => undefined);
    expect(resolvePixelX(0, noScale)).toBeUndefined();
  });
});
