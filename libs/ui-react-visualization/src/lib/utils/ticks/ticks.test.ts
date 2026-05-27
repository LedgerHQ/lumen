import { describe, expect, it, vi } from 'vitest';

import { getCategoricalScale, getNumericScale } from '../scales/scales';

import {
  buildTicksData,
  getTickLabel,
  getTickPosition,
  getTickValues,
} from './ticks';

const numericScale = getNumericScale({
  scaleType: 'linear',
  domain: { min: 0, max: 100 },
  range: { min: 0, max: 500 },
});

const bandScale = getCategoricalScale({
  domain: { min: 0, max: 4 },
  range: { min: 0, max: 500 },
  padding: 0,
});

describe('getTickValues', () => {
  it('should return explicit ticks when provided', () => {
    expect(getTickValues(numericScale, [0, 25, 50])).toEqual([0, 25, 50]);
  });

  it('should return scale.ticks() for numeric scales', () => {
    const ticks = getTickValues(numericScale);
    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks).toContain(0);
    expect(ticks).toContain(100);
  });

  it('should return full domain for band scales', () => {
    expect(getTickValues(bandScale)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('getTickPosition', () => {
  it('should map value through numeric scale', () => {
    expect(getTickPosition(numericScale, 0)).toBe(0);
    expect(getTickPosition(numericScale, 50)).toBe(250);
    expect(getTickPosition(numericScale, 100)).toBe(500);
  });

  it('should center within band for categorical scale', () => {
    const pos = getTickPosition(bandScale, 0);
    const bandwidth = bandScale.bandwidth();
    expect(pos).toBe((bandScale(0) ?? 0) + bandwidth / 2);
  });
});

describe('getTickLabel', () => {
  it('should return stringified tick value by default', () => {
    expect(getTickLabel(42, undefined)).toBe('42');
  });

  it('should look up string labels from axis data', () => {
    const axisData = ['Jan', 'Feb', 'Mar'];
    expect(getTickLabel(0, axisData)).toBe('Jan');
    expect(getTickLabel(1, axisData)).toBe('Feb');
  });

  it('should fall back to tick value when index is out of range', () => {
    const axisData = ['Jan', 'Feb'];
    expect(getTickLabel(5, axisData)).toBe('5');
  });

  it('should apply formatter with raw string label when available', () => {
    const axisData = ['January', 'February'];
    const formatter = vi.fn((v: number | string) => `${String(v).slice(0, 3)}`);

    expect(getTickLabel(0, axisData, formatter)).toBe('Jan');
    expect(formatter).toHaveBeenCalledWith('January');
  });

  it('should apply formatter with numeric value when no string labels', () => {
    const formatter = vi.fn((v: number | string) => `$${v}`);

    expect(getTickLabel(10, undefined, formatter)).toBe('$10');
    expect(formatter).toHaveBeenCalledWith(10);
  });

  it('should apply formatter with numeric data', () => {
    const axisData = [100, 200, 300];
    const formatter = vi.fn((v: number | string) => `${v}!`);

    expect(getTickLabel(1, axisData, formatter)).toBe('1!');
    expect(formatter).toHaveBeenCalledWith(1);
  });
});

describe('buildTicksData', () => {
  it('should combine position, value, and label for each tick', () => {
    const result = buildTicksData(numericScale);
    expect(result.length).toBeGreaterThan(0);
    for (const tick of result) {
      expect(tick).toHaveProperty('position');
      expect(tick).toHaveProperty('value');
      expect(tick).toHaveProperty('label');
      expect(typeof tick.position).toBe('number');
      expect(typeof tick.label).toBe('string');
    }
  });

  it('should use explicit ticks when provided', () => {
    const result = buildTicksData(numericScale, undefined, [0, 50, 100]);
    expect(result).toHaveLength(3);
    expect(result.map((t) => t.value)).toEqual([0, 50, 100]);
  });

  it('should resolve string labels from axis config', () => {
    const result = buildTicksData(bandScale, {
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    });
    expect(result[0].label).toBe('Mon');
    expect(result[1].label).toBe('Tue');
  });

  it('should apply tick formatter', () => {
    const formatter = (v: number | string) => `$${v}`;
    const result = buildTicksData(numericScale, undefined, [0, 50], formatter);
    expect(result[0].label).toBe('$0');
    expect(result[1].label).toBe('$50');
  });

  it('should compute correct positions for numeric scale', () => {
    const result = buildTicksData(numericScale, undefined, [0, 100]);
    expect(result[0].position).toBe(0);
    expect(result[1].position).toBe(500);
  });
});
