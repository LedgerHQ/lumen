import { describe, expect, it } from '@jest/globals';

import {
  getCategoricalScale,
  getNumericScale,
} from '../../utils/scales/scales';

import { buildLinePath, toScaledPoints } from './utils';

const xScale = getNumericScale({
  scaleType: 'linear',
  domain: { min: 0, max: 7 },
  range: { min: 0, max: 800 },
  nice: false,
});

const yScale = getNumericScale({
  scaleType: 'linear',
  domain: { min: 0, max: 100 },
  range: { min: 200, max: 0 },
});

describe('toScaledPoints', () => {
  it('uses index as x input when no xData is provided', () => {
    const data = [10, 50, 90];
    const points = toScaledPoints(data, xScale, yScale);

    expect(points).not.toBeNull();
    expect(points).toHaveLength(3);
    expect(points![0][0]).toBe(0);
    expect(points![1][0]).toBeCloseTo(800 / 7);
    expect(points![2][0]).toBeCloseTo((800 / 7) * 2);
  });

  it('caps iteration to xData.length when series is longer', () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const xData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

    const points = toScaledPoints(data, xScale, yScale, xData);

    expect(points).not.toBeNull();
    expect(points).toHaveLength(xData.length);
    expect(points![0][0]).toBe(0);
    expect(points![points!.length - 1][0]).toBe(800);
  });

  it('skips null values without affecting the cap', () => {
    const data: (number | null)[] = [10, null, 30, 40, 50, 60, 70, 80, 90];
    const xData = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    const points = toScaledPoints(data, xScale, yScale, xData);

    expect(points).not.toBeNull();
    expect(points).toHaveLength(7);
    expect(points![points!.length - 1][0]).toBe((800 / 7) * 7);
  });

  it('uses numeric xData values as the x input', () => {
    const data = [10, 20, 30];
    const customX = [0, 3.5, 7];

    const points = toScaledPoints(data, xScale, yScale, customX);

    expect(points![0][0]).toBe(0);
    expect(points![1][0]).toBeCloseTo(400);
    expect(points![2][0]).toBe(800);
  });

  it('centers points within categorical band scales', () => {
    const bandScale = getCategoricalScale({
      domain: { min: 0, max: 2 },
      range: { min: 0, max: 300 },
      padding: 0,
    });
    const data = [10, 50, 90];

    const points = toScaledPoints(data, bandScale, yScale);

    expect(points).toHaveLength(3);
    const bandwidth = bandScale.bandwidth();
    expect(points![0][0]).toBe((bandScale(0) ?? 0) + bandwidth / 2);
  });

  it('returns null when fewer than 2 valid points remain', () => {
    const data: (number | null)[] = [10, null, null];
    const xData = ['A', 'B', 'C'];

    expect(toScaledPoints(data, xScale, yScale, xData)).toBeNull();
  });
});

describe('buildLinePath', () => {
  const points: [number, number][] = [
    [0, 100],
    [50, 20],
    [100, 60],
  ];

  it('defaults to the bump curve (cubic beziers)', () => {
    const path = buildLinePath(points);

    expect(path).not.toBeNull();
    expect(path).toContain('C');
  });

  it('draws straight segments for the linear curve', () => {
    const path = buildLinePath(points, 'linear');

    expect(path).toBe('M0,100L50,20L100,60');
  });

  it('uses cubic beziers for smooth curves', () => {
    expect(buildLinePath(points, 'natural')).toContain('C');
    expect(buildLinePath(points, 'monotone')).toContain('C');
  });

  it('draws orthogonal segments for the step curve', () => {
    const path = buildLinePath(points, 'step');

    expect(path).not.toBeNull();
    expect(path).not.toContain('C');
    expect(path).toBe('M0,100L25,100L25,20L75,20L75,60L100,60');
  });

  it('falls back to the default curve for unknown values', () => {
    const path = buildLinePath(points, 'unknown' as never);

    expect(path).toBe(buildLinePath(points));
  });
});
