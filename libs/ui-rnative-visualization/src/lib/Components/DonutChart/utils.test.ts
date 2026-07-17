import { describe, expect, it } from '@jest/globals';

import { DONUT_GEOMETRY } from './constants';
import type { DonutSegment } from './types';
import { buildArcs, buildEmptyRingPath, getSegmentPercents } from './utils';

const series: DonutSegment[] = [
  { id: 'bitcoin', label: 'Bitcoin', value: 50 },
  { id: 'ethereum', label: 'Ethereum', value: 30 },
  { id: 'tether', label: 'Tether', value: 20 },
];

describe('getSegmentPercents', () => {
  it('computes percent from the summed value', () => {
    expect(getSegmentPercents(series)).toEqual([50, 30, 20]);
  });

  it('treats negatives as zero', () => {
    expect(
      getSegmentPercents([
        { id: 'a', label: 'A', value: -10 },
        { id: 'b', label: 'B', value: 10 },
      ]),
    ).toEqual([0, 100]);
  });

  it('returns all zeros when the total is zero', () => {
    expect(
      getSegmentPercents([
        { id: 'a', label: 'A', value: 0 },
        { id: 'b', label: 'B', value: 0 },
      ]),
    ).toEqual([0, 0]);
  });
});

describe('buildArcs', () => {
  it('returns one arc per segment in series order', () => {
    const arcs = buildArcs(series, DONUT_GEOMETRY.md);
    expect(arcs.map((a) => a.id)).toEqual(['bitcoin', 'ethereum', 'tether']);
  });

  it('carries the percent and color override per arc', () => {
    const arcs = buildArcs(
      [{ id: 'a', label: 'A', value: 1, color: '#f7931a' }],
      DONUT_GEOMETRY.sm,
    );
    expect(arcs[0].color).toBe('#f7931a');
    expect(arcs[0].percent).toBe(100);
    expect(arcs[0].path.length).toBeGreaterThan(0);
  });

  it('leaves color undefined when the segment has no override', () => {
    const arcs = buildArcs(
      [{ id: 'a', label: 'A', value: 1 }],
      DONUT_GEOMETRY.md,
    );
    expect(arcs[0].color).toBeUndefined();
  });

  it('returns no arcs for an empty series', () => {
    expect(buildArcs([], DONUT_GEOMETRY.md)).toEqual([]);
  });

  it('returns no arcs when every value is zero', () => {
    expect(
      buildArcs(
        [
          { id: 'a', label: 'A', value: 0 },
          { id: 'b', label: 'B', value: 0 },
        ],
        DONUT_GEOMETRY.md,
      ),
    ).toEqual([]);
  });
});

describe('buildEmptyRingPath', () => {
  it('builds a non-empty full-ring path', () => {
    expect(buildEmptyRingPath(DONUT_GEOMETRY.md).length).toBeGreaterThan(0);
  });
});
