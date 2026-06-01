import { describe, expect, it, vi } from 'vitest';

import {
  getCategoricalScale,
  getNumericScale,
} from '../../utils/scales/scales';
import {
  applyMagnetization,
  buildSortedMagnets,
  getDataIndexFromPosition,
  nearestIndex,
  resolvePixelX,
  resolvePixelY,
} from './utils';
import type { MagnetEntry } from './utils';

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

  it('uses numeric axisConfig.data values instead of the index', () => {
    const scale = getNumericScale({
      scaleType: 'linear',
      domain: { min: 10, max: 30 },
      range: { min: 0, max: 200 },
    });
    const getXScale = vi.fn(() => scale);
    const axisConfig = { data: [10, 20, 30] as number[] };

    const atIndex = resolvePixelX(1, getXScale);
    const atAxisValue = resolvePixelX(1, getXScale, axisConfig);

    expect(atAxisValue).not.toBe(atIndex);
    expect(atAxisValue).toBe(scale(20));
  });

  it('falls back to index when axisConfig.data is strings', () => {
    const getXScale = vi.fn(() => numericScale);
    const axisConfig = { data: ['a', 'b', 'c'] as string[] };

    expect(resolvePixelX(2, getXScale, axisConfig)).toBe(
      resolvePixelX(2, getXScale),
    );
  });
});

describe('buildSortedMagnets', () => {
  it('returns an empty array when the set is empty', () => {
    const result = buildSortedMagnets({
      magneticIndices: new Set(),
      getPixelForIndex: () => 0,
    });
    expect(result).toEqual([]);
  });

  it('returns entries sorted by pixelX', () => {
    const result = buildSortedMagnets({
      magneticIndices: new Set([3, 1, 2]),
      getPixelForIndex: (i) => i * 50,
    });
    expect(result).toEqual([
      { index: 1, pixelX: 50 },
      { index: 2, pixelX: 100 },
      { index: 3, pixelX: 150 },
    ]);
  });

  it('filters out indices where getPixelForIndex returns undefined', () => {
    const result = buildSortedMagnets({
      magneticIndices: new Set([0, 1, 2]),
      getPixelForIndex: (i) => (i === 1 ? undefined : i * 100),
    });
    expect(result).toEqual([
      { index: 0, pixelX: 0 },
      { index: 2, pixelX: 200 },
    ]);
  });

  it('returns an empty array when all indices resolve to undefined', () => {
    const result = buildSortedMagnets({
      magneticIndices: new Set([0, 1]),
      getPixelForIndex: () => undefined,
    });
    expect(result).toEqual([]);
  });
});

describe('nearestIndex', () => {
  const magnets = (...pixelXs: number[]): MagnetEntry[] =>
    pixelXs.map((px, i) => ({ index: i, pixelX: px }));

  it('returns -1 for an empty array', () => {
    expect(nearestIndex([], 100)).toBe(-1);
  });

  it('returns 0 for a single-element array', () => {
    expect(nearestIndex(magnets(200), 100)).toBe(0);
  });

  it('returns the index of the exact match', () => {
    expect(nearestIndex(magnets(100, 200, 300), 200)).toBe(1);
  });

  it('returns the closer index when target is between two values', () => {
    expect(nearestIndex(magnets(100, 200), 160)).toBe(1);
    expect(nearestIndex(magnets(100, 200), 140)).toBe(0);
  });

  it('favors the left index when equidistant', () => {
    expect(nearestIndex(magnets(100, 200), 150)).toBe(0);
  });

  it('returns the last index when target is beyond all values', () => {
    expect(nearestIndex(magnets(100, 200), 500)).toBe(1);
  });

  it('returns the first index when target is before all values', () => {
    expect(nearestIndex(magnets(100, 200), 0)).toBe(0);
  });
});

describe('applyMagnetization', () => {
  const toMagnets = (...indices: number[]): MagnetEntry[] =>
    indices.map((i) => ({ index: i, pixelX: i * 100 }));

  it('returns resolvedIndex when sortedMagnets is empty', () => {
    expect(
      applyMagnetization({
        resolvedIndex: 2,
        pixelX: 200,
        sortedMagnets: [],
        magnetRadius: 30,
      }),
    ).toBe(2);
  });

  it('returns resolvedIndex when no magnetic point is within radius', () => {
    expect(
      applyMagnetization({
        resolvedIndex: 2,
        pixelX: 200,
        sortedMagnets: toMagnets(0, 4),
        magnetRadius: 30,
      }),
    ).toBe(2);
  });

  it('snaps to a magnetic point within radius', () => {
    expect(
      applyMagnetization({
        resolvedIndex: 2,
        pixelX: 280,
        sortedMagnets: toMagnets(3),
        magnetRadius: 30,
      }),
    ).toBe(3);
  });

  it('snaps to the closest magnetic point when multiple are within radius', () => {
    expect(
      applyMagnetization({
        resolvedIndex: 1,
        pixelX: 170,
        sortedMagnets: toMagnets(1, 2),
        magnetRadius: 40,
      }),
    ).toBe(2);
  });

  it('does not snap when magnetRadius is 0', () => {
    expect(
      applyMagnetization({
        resolvedIndex: 1,
        pixelX: 200,
        sortedMagnets: toMagnets(2),
        magnetRadius: 0,
      }),
    ).toBe(1);
  });

  it('snaps at the exact boundary of magnetRadius', () => {
    expect(
      applyMagnetization({
        resolvedIndex: 2,
        pixelX: 270,
        sortedMagnets: toMagnets(3),
        magnetRadius: 30,
      }),
    ).toBe(3);
  });

  it('does not snap when distance exceeds magnetRadius by 1', () => {
    expect(
      applyMagnetization({
        resolvedIndex: 2,
        pixelX: 269,
        sortedMagnets: toMagnets(3),
        magnetRadius: 30,
      }),
    ).toBe(2);
  });
});
