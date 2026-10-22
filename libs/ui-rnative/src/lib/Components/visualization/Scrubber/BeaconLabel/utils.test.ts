import { describe, expect, it } from '@jest/globals';

import { chartConfig } from '../../config';
import { computeBeaconLabelX, computeBeaconLabelYs } from './utils';

const { height, rowGap, gap } = chartConfig.beaconLabel;
const area = { x: 0, y: 0, width: 200, height: 100 };

describe('computeBeaconLabelYs', () => {
  it('centers an isolated label on its beacon', () => {
    expect(computeBeaconLabelYs([50], area)).toEqual([50 - height / 2]);
  });

  it('pushes overlapping labels apart by height + rowGap', () => {
    const [a, b] = computeBeaconLabelYs([40, 42], area);
    expect(b - a).toBe(height + rowGap);
  });

  it('keeps the last label inside the drawing area', () => {
    const ys = computeBeaconLabelYs([95, 98], area);
    expect(ys[1]).toBe(area.height - height);
    expect(ys[1] - ys[0]).toBe(height + rowGap);
  });

  it('returns an empty list without beacons', () => {
    expect(computeBeaconLabelYs([], area)).toEqual([]);
  });
});

describe('computeBeaconLabelX', () => {
  const offset = chartConfig.scrubber.beaconRadius + gap;

  it('places the label to the right when it fits', () => {
    expect(computeBeaconLabelX(50, 60, area)).toBe(50 + offset);
  });

  it('flips to the left when it would overflow', () => {
    expect(computeBeaconLabelX(180, 60, area)).toBe(180 - offset - 60);
  });
});
