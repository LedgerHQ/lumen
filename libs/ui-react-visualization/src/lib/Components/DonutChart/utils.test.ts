import { describe, expect, it } from 'vitest';

import { chartConfig } from '../../config';
import type { DonutSegment } from './types';

import {
  applyMinSegmentShare,
  buildPlaceholderSegments,
  buildRingSegments,
  DONUT_GEOMETRY,
  formatPercentLabel,
  getDonutViewBox,
  getSegmentPercents,
  resolveSegmentColor,
  roundPercent,
} from './utils';

const series: DonutSegment[] = [
  { id: 'a', label: 'A', value: 50 },
  { id: 'b', label: 'B', value: 30 },
  { id: 'c', label: 'C', value: 20 },
];

describe('getDonutViewBox', () => {
  it('pads the viewBox by hoverOffset on every side, matching the RN ring', () => {
    expect(getDonutViewBox(DONUT_GEOMETRY.md)).toBe(
      `-3.36 -3.36 174.72 174.72`,
    );
    expect(getDonutViewBox(DONUT_GEOMETRY.sm)).toBe(`-2 -2 84 84`);
  });
});

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

describe('roundPercent', () => {
  it('keeps up to 1 decimal and drops the rest', () => {
    expect(roundPercent(7.24)).toBe(7.2);
    expect(roundPercent(7.26)).toBe(7.3);
  });

  it('absorbs float artifacts', () => {
    expect(roundPercent((7 / 100) * 100)).toBe(7);
  });
});

describe('formatPercentLabel', () => {
  it('suffixes the rounded percent', () => {
    expect(formatPercentLabel(30)).toBe('30%');
    expect(formatPercentLabel(7.254)).toBe('7.3%');
  });

  it('never leaks a float artifact into the label', () => {
    expect(formatPercentLabel((7 / 100) * 100)).toBe('7%');
  });

  it('flags a share too small to round rather than calling it zero', () => {
    expect(formatPercentLabel(0.00001)).toBe('<0.1%');
    expect(formatPercentLabel(0.04)).toBe('<0.1%');
  });

  it('rounds up to a real label as soon as it can', () => {
    expect(formatPercentLabel(0.05)).toBe('0.1%');
  });

  it('reads 0% only for an exact zero', () => {
    expect(formatPercentLabel(0)).toBe('0%');
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

describe('applyMinSegmentShare', () => {
  it('leaves the shares alone when every value is already big enough', () => {
    expect(applyMinSegmentShare([50, 30, 20], 0.1)).toEqual([0.5, 0.3, 0.2]);
  });

  it('lifts values under the minimum and still sums to 1', () => {
    const shares = applyMinSegmentShare([98, 1, 1], 0.1);
    expect(shares[0]).toBeCloseTo(0.8, 10);
    expect(shares[1]).toBeCloseTo(0.1, 10);
    expect(shares[2]).toBeCloseTo(0.1, 10);
    expect(shares.reduce((sum, share) => sum + share, 0)).toBeCloseTo(1, 10);
  });

  it('keeps the segments that shrink in proportion to each other', () => {
    const [a, b] = applyMinSegmentShare([60, 39, 1], 0.1);
    expect(a / b).toBeCloseTo(60 / 39, 10);
  });

  it('repeats until a segment shrunk under the minimum is lifted too', () => {
    // A single pass would leave the two 16s at ~0.122, under the minimum.
    const shares = applyMinSegmentShare([60, 16, 16, 7, 1], 0.15);
    expect(shares[0]).toBeCloseTo(0.4, 10);
    shares.slice(1).forEach((share) => expect(share).toBeCloseTo(0.15, 10));
  });

  it('caps the minimum at an equal split so it stays satisfiable', () => {
    applyMinSegmentShare([1, 1, 1e-9], 0.9).forEach((share) =>
      expect(share).toBeCloseTo(1 / 3, 10),
    );
  });

  it('survives a minimum that leaves no segment to take from', () => {
    // Every share lands on exactly 1/4, so the last pass divides by zero.
    const shares = applyMinSegmentShare([1, 1, 1, 1e-9], 1 / 4);
    shares.forEach((share) => expect(share).toBeCloseTo(0.25, 10));
    expect(shares.reduce((sum, share) => sum + share, 0)).toBeCloseTo(1, 10);
  });

  it('returns zeros when there is nothing to distribute', () => {
    expect(applyMinSegmentShare([], 0.1)).toEqual([]);
    expect(applyMinSegmentShare([0, 0], 0.1)).toEqual([0, 0]);
  });
});

describe('buildRingSegments', () => {
  it('returns one ring segment per series entry in series order', () => {
    const segments = buildRingSegments(series, DONUT_GEOMETRY.md);
    expect(segments.map((s) => s.id)).toEqual(['a', 'b', 'c']);
  });

  it('produces a non-empty path per segment', () => {
    const segments = buildRingSegments(series, DONUT_GEOMETRY.md);
    segments.forEach((s) => expect(s.path).toMatch(/^M/));
  });

  it('carries the percent for each segment', () => {
    const segments = buildRingSegments(series, DONUT_GEOMETRY.md);
    expect(segments.map((s) => s.percent)).toEqual([50, 30, 20]);
  });

  it('returns an empty array for an empty series', () => {
    expect(buildRingSegments([], DONUT_GEOMETRY.md)).toEqual([]);
  });

  it('drops zero and negative segments while keeping positive ones', () => {
    const segments = buildRingSegments(
      [
        { id: 'a', label: 'A', value: 50 },
        { id: 'zero', label: 'Zero', value: 0 },
        { id: 'neg', label: 'Neg', value: -10 },
        { id: 'b', label: 'B', value: 50 },
      ],
      DONUT_GEOMETRY.md,
    );
    expect(segments.map((s) => s.id)).toEqual(['a', 'b']);
    expect(segments.map((s) => s.percent)).toEqual([50, 50]);
  });

  it('returns an empty array when the total is zero', () => {
    expect(
      buildRingSegments(
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
    const segments = buildRingSegments(
      [
        { id: 'a', label: 'A', value: 1 },
        { id: 'b', label: 'B', value: 1 },
      ],
      DONUT_GEOMETRY.md,
    );
    segments.forEach((s) => expect(s.path).toMatch(cornerArc));
  });

  describe('with a value too small to see', () => {
    const geometry = DONUT_GEOMETRY.md;
    const midRadius = (geometry.innerRadius + geometry.outerRadius) / 2;
    const withDust: DonutSegment[] = [
      { id: 'dust', label: 'Dust', value: 0.00001 },
      { id: 'a', label: 'A', value: 50 },
      { id: 'b', label: 'B', value: 50 },
    ];

    it('draws it at the minimum visible arc instead of vanishing', () => {
      const [dust] = buildRingSegments(withDust, geometry);
      // The first segment starts at 12 o'clock, so its span is twice its
      // midAngle; the gap it reserves comes off that span.
      const visibleSpan = dust.midAngle * 2 - geometry.padAngle;
      expect(visibleSpan).toBeCloseTo(
        geometry.minSegmentArcLength / midRadius,
        6,
      );
      expect(dust.path).toMatch(/^M/);
    });

    it('leaves the reported percent untouched', () => {
      const [dust] = buildRingSegments(withDust, geometry);
      expect(dust.percent).toBeLessThan(0.001);
      expect(formatPercentLabel(dust.percent)).toBe('<0.1%');
    });

    it('keeps the two equal segments mirrored about the sliver', () => {
      const [dust, a, b] = buildRingSegments(withDust, geometry);
      expect((a.midAngle + b.midAngle) / 2).toBeCloseTo(
        Math.PI + dust.midAngle,
        10,
      );
    });
  });

  it('computes midAngle and hoverTranslate per segment', () => {
    const segments = buildRingSegments(series, DONUT_GEOMETRY.md);
    const offset = DONUT_GEOMETRY.md.hoverOffset;

    segments.forEach((segment) => {
      expect(segment.midAngle).toBeGreaterThanOrEqual(0);
      expect(segment.midAngle).toBeLessThanOrEqual(2 * Math.PI);
      const magnitude = Math.hypot(
        segment.hoverTranslate.x,
        segment.hoverTranslate.y,
      );
      expect(magnitude).toBeCloseTo(offset);
    });
  });

  it("pushes the first segment radially upward from 12 o'clock", () => {
    const [first] = buildRingSegments(
      [
        { id: 'a', label: 'A', value: 1 },
        { id: 'b', label: 'B', value: 1 },
      ],
      DONUT_GEOMETRY.md,
    );
    expect(first.hoverTranslate.y).toBeLessThan(0);
  });

  it('disables hover animation for a single segment', () => {
    const [segment] = buildRingSegments(
      [{ id: 'a', label: 'A', value: 1 }],
      DONUT_GEOMETRY.md,
    );
    expect(segment.hoverEnabled).toBe(false);
    expect(segment.hoverTranslate).toEqual({ x: 0, y: 0 });
  });
});

describe('buildPlaceholderSegments', () => {
  const { segmentValues } = chartConfig.donut.placeholder;

  it('returns one index-named segment per configured placeholder value', () => {
    const segments = buildPlaceholderSegments(DONUT_GEOMETRY.md);
    expect(segments).toHaveLength(segmentValues.length);
    expect(segments.map((segment) => segment.id)).toEqual(
      segmentValues.map((_, index) => `placeholder-${index}`),
    );
  });

  it('produces a non-empty path per placeholder segment', () => {
    const segments = buildPlaceholderSegments(DONUT_GEOMETRY.md);
    segments.forEach((segment) => expect(segment.path).toMatch(/^M/));
  });

  it('computes midAngle per placeholder segment', () => {
    const segments = buildPlaceholderSegments(DONUT_GEOMETRY.md);
    segments.forEach((segment) => {
      expect(segment.midAngle).toBeGreaterThanOrEqual(0);
      expect(segment.midAngle).toBeLessThanOrEqual(2 * Math.PI);
    });
  });
});
