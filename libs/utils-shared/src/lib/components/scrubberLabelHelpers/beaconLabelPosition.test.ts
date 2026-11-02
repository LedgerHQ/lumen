import { describe, expect, it } from 'vitest';

import {
  computeBeaconLabelX,
  computeBeaconLabelYs,
} from './beaconLabelPosition';

const layout = { height: 24, rowGap: 4 };
const { height, rowGap } = layout;
const area = { x: 0, y: 0, width: 200, height: 100 };

describe('computeBeaconLabelYs', () => {
  it('centers an isolated label on its beacon', () => {
    expect(computeBeaconLabelYs([50], area, layout)).toEqual([50 - height / 2]);
  });

  it('pushes overlapping labels apart by height + rowGap', () => {
    const [a, b] = computeBeaconLabelYs([40, 42], area, layout);
    expect(b - a).toBe(height + rowGap);
  });

  it('keeps the last label inside the drawing area', () => {
    const ys = computeBeaconLabelYs([95, 98], area, layout);
    expect(ys[1]).toBe(area.height - height);
    expect(ys[1] - ys[0]).toBe(height + rowGap);
  });

  it('keeps the first label inside the drawing area', () => {
    const [first] = computeBeaconLabelYs([0, 1], area, layout);
    expect(first).toBe(area.y);
  });

  it('returns an empty list without beacons', () => {
    expect(computeBeaconLabelYs([], area, layout)).toEqual([]);
  });
});

describe('computeBeaconLabelX', () => {
  const offset = 13;

  it('places the label to the right when it fits', () => {
    expect(computeBeaconLabelX(50, 60, area, offset)).toBe(50 + offset);
  });

  it('flips to the left when it would overflow', () => {
    expect(computeBeaconLabelX(180, 60, area, offset)).toBe(180 - offset - 60);
  });

  it('never places a label left of the drawing area', () => {
    expect(computeBeaconLabelX(30, 300, area, offset)).toBe(area.x);
  });
});
