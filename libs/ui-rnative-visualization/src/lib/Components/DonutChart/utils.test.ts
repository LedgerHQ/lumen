import { describe, expect, it } from '@jest/globals';

import { DONUT_GEOMETRY, getDonutViewBox } from './constants';
import type { DonutSegment } from './types';
import { buildArcs, buildEmptyRingPath, getSegmentPercents } from './utils';

const series: DonutSegment[] = [
  { id: 'bitcoin', label: 'Bitcoin', value: 50 },
  { id: 'ethereum', label: 'Ethereum', value: 30 },
  { id: 'tether', label: 'Tether', value: 20 },
];

describe('DONUT_GEOMETRY', () => {
  it('matches the Figma box sizes (md=168, sm=80)', () => {
    expect(DONUT_GEOMETRY.md.box).toBe(168);
    expect(DONUT_GEOMETRY.sm.box).toBe(80);
  });
});

describe('getDonutViewBox', () => {
  it('pads the viewBox by activeOffset on every side', () => {
    expect(getDonutViewBox(DONUT_GEOMETRY.md)).toBe(
      `-3.36 -3.36 174.72 174.72`,
    );
    expect(getDonutViewBox(DONUT_GEOMETRY.sm)).toBe(`-2 -2 84 84`);
  });
});

describe('getSegmentPercents', () => {
  it('computes percent from the summed value', () => {
    expect(getSegmentPercents(series)).toEqual([50, 30, 20]);
  });

  it('returns an empty array for an empty series', () => {
    expect(getSegmentPercents([])).toEqual([]);
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

  it('drops zero and negative segments while keeping positive ones', () => {
    const arcs = buildArcs(
      [
        { id: 'a', label: 'A', value: 50 },
        { id: 'zero', label: 'Zero', value: 0 },
        { id: 'neg', label: 'Neg', value: -10 },
        { id: 'b', label: 'B', value: 50 },
      ],
      DONUT_GEOMETRY.md,
    );
    expect(arcs.map((a) => a.id)).toEqual(['a', 'b']);
    expect(arcs.map((a) => a.percent)).toEqual([50, 50]);
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

  it('rounds the corners of both halves of an equal 2-segment ring', () => {
    const cornerArc = new RegExp(`A${DONUT_GEOMETRY.md.cornerRadius},`);
    const arcs = buildArcs(
      [
        { id: 'a', label: 'A', value: 1 },
        { id: 'b', label: 'B', value: 1 },
      ],
      DONUT_GEOMETRY.md,
    );
    arcs.forEach((a) => expect(a.path).toMatch(cornerArc));
  });

  it('computes midAngle and activeTranslate per segment', () => {
    const arcs = buildArcs(series, DONUT_GEOMETRY.md);
    const offset = DONUT_GEOMETRY.md.activeOffset;

    arcs.forEach((arc) => {
      expect(arc.midAngle).toBeGreaterThanOrEqual(0);
      expect(arc.midAngle).toBeLessThanOrEqual(2 * Math.PI);
      const magnitude = Math.hypot(
        arc.activeTranslate.x,
        arc.activeTranslate.y,
      );
      expect(magnitude).toBeCloseTo(offset);
    });
  });

  it("pushes the first slice radially upward from 12 o'clock", () => {
    const [first] = buildArcs(
      [
        { id: 'a', label: 'A', value: 1 },
        { id: 'b', label: 'B', value: 1 },
      ],
      DONUT_GEOMETRY.md,
    );
    expect(first.activeTranslate.y).toBeLessThan(0);
  });

  it('disables active animation for a single segment', () => {
    const [arc] = buildArcs(
      [{ id: 'a', label: 'A', value: 1 }],
      DONUT_GEOMETRY.md,
    );
    expect(arc.activeEnabled).toBe(false);
    expect(arc.activeTranslate).toEqual({ x: 0, y: 0 });
  });
});

describe('buildEmptyRingPath', () => {
  it('builds a non-empty full-ring path', () => {
    expect(buildEmptyRingPath(DONUT_GEOMETRY.md).length).toBeGreaterThan(0);
  });
});
