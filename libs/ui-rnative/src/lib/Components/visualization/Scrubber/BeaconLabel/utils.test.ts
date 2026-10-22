import { describe, expect, it } from '@jest/globals';

import { chartConfig } from '../../config';
import {
  computeBeaconLabelX,
  computeBeaconLabelYs,
  computeTextWidth,
  getMissingChars,
  saveCharWidths,
} from './utils';

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

describe('char width cache', () => {
  const font = (family: string) => ({ family, size: 14, weight: '500' });

  it('lists each distinct uncached char once', () => {
    expect(getMissingChars('100', font('a'))).toEqual(['1', '0']);
  });

  it('is undefined until every char is cached', () => {
    const f = font('b');
    saveCharWidths(f, { '1': 6 });
    expect(computeTextWidth('10', f)).toBeUndefined();
  });

  it('sums cached char widths', () => {
    const f = font('c');
    saveCharWidths(f, { '1': 6, '0': 8 });
    expect(computeTextWidth('100', f)).toBe(22);
    expect(getMissingChars('100', f)).toEqual([]);
  });
});
