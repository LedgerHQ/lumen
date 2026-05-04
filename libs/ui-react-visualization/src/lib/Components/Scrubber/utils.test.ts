import { describe, expect, it } from 'vitest';

import {
  getCategoricalScale,
  getNumericScale,
} from '../../utils/scales/scales';
import { getDataIndexFromPosition } from './utils';

describe('getDataIndexFromPosition', () => {
  describe('with a categorical (band) scale', () => {
    // 4 bands (0,1,2,3), no padding, range 0-400 → each band is 100px wide
    const scale = getCategoricalScale({
      domain: { min: 0, max: 3 },
      range: { min: 0, max: 400 },
      padding: 0,
    });

    it('returns 0 for a position at the center of the first band', () => {
      const bandwidth = scale.bandwidth(); // 100
      const center0 = (scale(0) ?? 0) + bandwidth / 2; // 50
      expect(getDataIndexFromPosition(center0, scale, undefined, 4)).toBe(0);
    });

    it('returns 1 for a position at the center of the second band', () => {
      const bandwidth = scale.bandwidth();
      const center1 = (scale(1) ?? 0) + bandwidth / 2; // 150
      expect(getDataIndexFromPosition(center1, scale, undefined, 4)).toBe(1);
    });

    it('returns the nearest band for a position between bands', () => {
      // Between band 1 center (150) and band 2 center (250), at 190 → closer to 1
      expect(getDataIndexFromPosition(190, scale, undefined, 4)).toBe(1);
      // At 210 → closer to 2
      expect(getDataIndexFromPosition(210, scale, undefined, 4)).toBe(2);
    });

    it('returns 3 (last) for a position beyond the last band', () => {
      expect(getDataIndexFromPosition(500, scale, undefined, 4)).toBe(3);
    });
  });

  describe('with a numeric (linear) scale and no axisData', () => {
    // Domain 0-4, range 0-400 → each unit = 100px
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
    // axisData = [10, 20, 30], mapped to pixels via scale
    const scale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 10, max: 30 },
      range: { min: 0, max: 200 },
    });
    const axisConfig = { data: [10, 20, 30] as number[] };

    it('returns 0 for pixel closest to first data point', () => {
      // scale(10) = 0
      expect(getDataIndexFromPosition(10, scale, axisConfig, 3)).toBe(0);
    });

    it('returns 1 for pixel closest to middle data point', () => {
      // scale(20) = 100
      expect(getDataIndexFromPosition(100, scale, axisConfig, 3)).toBe(1);
    });

    it('returns 2 for pixel closest to last data point', () => {
      // scale(30) = 200
      expect(getDataIndexFromPosition(195, scale, axisConfig, 3)).toBe(2);
    });
  });
});
