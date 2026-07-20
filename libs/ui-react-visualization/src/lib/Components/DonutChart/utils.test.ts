import { describe, expect, it } from 'vitest';

import type { DonutSegment } from './types';

import {
  buildArcs,
  buildEmptyRingPath,
  DONUT_GEOMETRY,
  getSegmentPercents,
  resolveSegmentColor,
} from './utils';

const series: DonutSegment[] = [
  { id: 'a', label: 'A', value: 50 },
  { id: 'b', label: 'B', value: 30 },
  { id: 'c', label: 'C', value: 20 },
];

describe('DONUT_GEOMETRY', () => {
  it('matches the Figma box sizes (md=168, sm=80)', () => {
    expect(DONUT_GEOMETRY.md.box).toBe(168);
    expect(DONUT_GEOMETRY.sm.box).toBe(80);
  });
});

describe('getSegmentPercents', () => {
  it('computes percent from the sum of values', () => {
    expect(getSegmentPercents(series)).toEqual([50, 30, 20]);
  });

  it('returns zeros when the total is zero', () => {
    expect(
      getSegmentPercents([
        { id: 'a', label: 'A', value: 0 },
        { id: 'b', label: 'B', value: 0 },
      ]),
    ).toEqual([0, 0]);
  });

  it('returns an empty array for an empty series', () => {
    expect(getSegmentPercents([])).toEqual([]);
  });

  it('treats negative values as zero', () => {
    expect(
      getSegmentPercents([
        { id: 'a', label: 'A', value: -10 },
        { id: 'b', label: 'B', value: 10 },
      ]),
    ).toEqual([0, 100]);
  });
});

describe('resolveSegmentColor', () => {
  it('uses the color override when present', () => {
    expect(
      resolveSegmentColor({ id: 'a', label: 'A', value: 1, color: '#ff0000' }),
    ).toBe('#ff0000');
  });

  it('falls back to the neutral default when no color is set', () => {
    expect(resolveSegmentColor({ id: 'a', label: 'A', value: 1 })).toContain(
      'background-muted-strong',
    );
  });
});

describe('buildArcs', () => {
  it('returns one arc per segment in series order', () => {
    const arcs = buildArcs(series, DONUT_GEOMETRY.md);
    expect(arcs.map((a) => a.id)).toEqual(['a', 'b', 'c']);
  });

  it('produces a non-empty path per segment', () => {
    const arcs = buildArcs(series, DONUT_GEOMETRY.md);
    arcs.forEach((a) => expect(a.path).toMatch(/^M/));
  });

  it('carries the percent for each segment', () => {
    const arcs = buildArcs(series, DONUT_GEOMETRY.md);
    expect(arcs.map((a) => a.percent)).toEqual([50, 30, 20]);
  });

  it('returns an empty array for an empty series', () => {
    expect(buildArcs([], DONUT_GEOMETRY.md)).toEqual([]);
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

  it('returns an empty array when the total is zero', () => {
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

  it('computes midAngle and hoverTranslate per segment', () => {
    const arcs = buildArcs(series, DONUT_GEOMETRY.md);
    const offset = DONUT_GEOMETRY.md.hoverOffset;

    arcs.forEach((arc) => {
      expect(arc.midAngle).toBeGreaterThanOrEqual(0);
      expect(arc.midAngle).toBeLessThanOrEqual(2 * Math.PI);
      const magnitude = Math.hypot(arc.hoverTranslate.x, arc.hoverTranslate.y);
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
    expect(first.hoverTranslate.y).toBeLessThan(0);
  });

  it('disables hover animation for a single segment', () => {
    const [arc] = buildArcs(
      [{ id: 'a', label: 'A', value: 1 }],
      DONUT_GEOMETRY.md,
    );
    expect(arc.hoverEnabled).toBe(false);
    expect(arc.hoverTranslate).toEqual({ x: 0, y: 0 });
  });
});

describe('buildEmptyRingPath', () => {
  it('produces a full-ring path', () => {
    expect(buildEmptyRingPath(DONUT_GEOMETRY.md)).toMatch(/^M/);
  });
});
