import { describe, expect, it } from '@jest/globals';

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

describe('resolvePixelX', () => {
  it('returns undefined when getXScale returns undefined', () => {
    const getXScale = () => undefined;
    expect(resolvePixelX(0, getXScale)).toBeUndefined();
  });

  it('returns the correct pixel for a numeric scale', () => {
    const scale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 0, max: 4 },
      range: { min: 0, max: 400 },
    });
    const getXScale = () => scale;
    const result = resolvePixelX(2, getXScale);
    expect(result).toBe(scale(2));
  });

  it('returns the band center for a categorical scale', () => {
    const scale = getCategoricalScale({
      domain: { min: 0, max: 3 },
      range: { min: 0, max: 400 },
      padding: 0,
    });
    const getXScale = () => scale;
    const expected = (scale(1) ?? 0) + scale.bandwidth() / 2;
    expect(resolvePixelX(1, getXScale)).toBe(expected);
  });

  it('uses numeric axisConfig.data values instead of the index', () => {
    const scale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 10, max: 30 },
      range: { min: 0, max: 200 },
    });
    const getXScale = () => scale;
    const axisConfig = { data: [10, 20, 30] as number[] };

    const atIndex = resolvePixelX(1, getXScale);
    const atAxisValue = resolvePixelX(1, getXScale, axisConfig);

    expect(atAxisValue).not.toBe(atIndex);
    expect(atAxisValue).toBe(scale(20));
  });

  it('falls back to index when axisConfig.data is strings', () => {
    const scale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 0, max: 4 },
      range: { min: 0, max: 400 },
    });
    const getXScale = () => scale;
    const axisConfig = { data: ['a', 'b', 'c'] as string[] };

    expect(resolvePixelX(2, getXScale, axisConfig)).toBe(
      resolvePixelX(2, getXScale),
    );
  });
});

describe('resolvePixelY', () => {
  const scale = getNumericScale({
    scaleType: 'linear',
    domain: { min: 0, max: 100 },
    range: { min: 200, max: 0 },
  });
  const getYScale = () => scale;

  it('returns undefined when getYScale returns undefined', () => {
    expect(resolvePixelY(0, [10, 20], () => undefined)).toBeUndefined();
  });

  it('returns undefined when seriesData is undefined', () => {
    expect(resolvePixelY(0, undefined, getYScale)).toBeUndefined();
  });

  it('returns undefined for a null data value', () => {
    expect(resolvePixelY(1, [10, null, 30], getYScale)).toBeUndefined();
  });

  it('returns the correct pixel y for a valid data point', () => {
    const result = resolvePixelY(0, [50], getYScale);
    expect(result).toBe(scale(50));
  });
});
