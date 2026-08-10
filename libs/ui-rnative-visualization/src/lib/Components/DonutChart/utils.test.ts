import { describe, expect, it } from '@jest/globals';

import { chartConfig, DONUT_GEOMETRY, type DonutGeometry } from '../../config';
import { getDonutViewBox, toRingLocalPoint } from './constants';
import type { DonutSegment } from './types';
import {
  buildRingSegments,
  buildPlaceholderSegments,
  findSegmentIdAtPoint,
  formatPercentLabel,
  getCenterMaxWidth,
  getSegmentPercents,
  roundPercent,
} from './utils';

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

describe('getCenterMaxWidth', () => {
  it('fits content inside the inner diameter minus the inset', () => {
    expect(getCenterMaxWidth(DONUT_GEOMETRY.md)).toBe(61 * 2 - 8);
    expect(getCenterMaxWidth(DONUT_GEOMETRY.sm)).toBe(28 * 2 - 8);
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

describe('buildRingSegments', () => {
  it('returns one ring segment per series entry in series order', () => {
    const segments = buildRingSegments(series, DONUT_GEOMETRY.md);
    expect(segments.map((a) => a.id)).toEqual([
      'bitcoin',
      'ethereum',
      'tether',
    ]);
  });

  it('carries the percent and color override per segment', () => {
    const segments = buildRingSegments(
      [{ id: 'a', label: 'A', value: 1, color: '#f7931a' }],
      DONUT_GEOMETRY.sm,
    );
    expect(segments[0].color).toBe('#f7931a');
    expect(segments[0].percent).toBe(100);
    expect(segments[0].path.length).toBeGreaterThan(0);
  });

  it('leaves color undefined when the segment has no override', () => {
    const segments = buildRingSegments(
      [{ id: 'a', label: 'A', value: 1 }],
      DONUT_GEOMETRY.md,
    );
    expect(segments[0].color).toBeUndefined();
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
    expect(segments.map((a) => a.id)).toEqual(['a', 'b']);
    expect(segments.map((a) => a.percent)).toEqual([50, 50]);
  });

  it('returns no segments for an empty series', () => {
    expect(buildRingSegments([], DONUT_GEOMETRY.md)).toEqual([]);
  });

  it('returns no segments when every value is zero', () => {
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
    segments.forEach((a) => expect(a.path).toMatch(cornerArc));
  });

  it('computes midAngle and activeTranslate per segment', () => {
    const segments = buildRingSegments(series, DONUT_GEOMETRY.md);
    const offset = DONUT_GEOMETRY.md.activeOffset;

    segments.forEach((segment) => {
      expect(segment.midAngle).toBeGreaterThanOrEqual(0);
      expect(segment.midAngle).toBeLessThanOrEqual(2 * Math.PI);
      const magnitude = Math.hypot(
        segment.activeTranslate.x,
        segment.activeTranslate.y,
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
    expect(first.activeTranslate.y).toBeLessThan(0);
  });

  it('disables active animation for a single segment', () => {
    const [segment] = buildRingSegments(
      [{ id: 'a', label: 'A', value: 1 }],
      DONUT_GEOMETRY.md,
    );
    expect(segment.activeEnabled).toBe(false);
    expect(segment.activeTranslate).toEqual({ x: 0, y: 0 });
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

describe('toRingLocalPoint', () => {
  it('maps the gesture overlay center to the segment-space origin', () => {
    const { box } = DONUT_GEOMETRY.md;
    expect(
      toRingLocalPoint({ x: box / 2, y: box / 2 }, DONUT_GEOMETRY.md),
    ).toEqual({ x: 0, y: 0 });
  });

  it('maps the overlay top-left corner outside the outer radius', () => {
    const point = toRingLocalPoint({ x: 0, y: 0 }, DONUT_GEOMETRY.md);
    const radius = Math.hypot(point.x, point.y);
    expect(radius).toBeGreaterThan(DONUT_GEOMETRY.md.outerRadius);
  });
});

describe('findSegmentIdAtPoint', () => {
  const midRadius =
    (DONUT_GEOMETRY.md.innerRadius + DONUT_GEOMETRY.md.outerRadius) / 2;
  const twoHalves: DonutSegment[] = [
    { id: 'a', label: 'A', value: 1 },
    { id: 'b', label: 'B', value: 1 },
  ];

  it('returns null inside the hole (below innerRadius)', () => {
    const segments = buildRingSegments(twoHalves, DONUT_GEOMETRY.md);
    expect(
      findSegmentIdAtPoint(segments, { x: 0, y: 0 }, DONUT_GEOMETRY.md),
    ).toBeNull();
  });

  it('returns null beyond outerRadius', () => {
    const segments = buildRingSegments(twoHalves, DONUT_GEOMETRY.md);
    expect(
      findSegmentIdAtPoint(segments, { x: 0, y: -200 }, DONUT_GEOMETRY.md),
    ).toBeNull();
  });

  it('resolves a point at the top of the ring to the first segment', () => {
    const segments = buildRingSegments(twoHalves, DONUT_GEOMETRY.md);
    expect(
      findSegmentIdAtPoint(
        segments,
        { x: 0, y: -midRadius },
        DONUT_GEOMETRY.md,
      ),
    ).toBe('a');
  });

  it('resolves a point at the bottom of the ring to the second segment', () => {
    const segments = buildRingSegments(twoHalves, DONUT_GEOMETRY.md);
    expect(
      findSegmentIdAtPoint(segments, { x: 0, y: midRadius }, DONUT_GEOMETRY.md),
    ).toBe('b');
  });

  it('resolves each series segment at its own midAngle', () => {
    const segments = buildRingSegments(series, DONUT_GEOMETRY.md);
    segments.forEach((segment) => {
      const point = {
        x: Math.sin(segment.midAngle) * midRadius,
        y: -Math.cos(segment.midAngle) * midRadius,
      };
      expect(findSegmentIdAtPoint(segments, point, DONUT_GEOMETRY.md)).toBe(
        segment.id,
      );
    });
  });

  it('returns null for an empty series', () => {
    expect(
      findSegmentIdAtPoint([], { x: 0, y: -midRadius }, DONUT_GEOMETRY.md),
    ).toBeNull();
  });

  it.each<[string, DonutGeometry]>([
    ['md', DONUT_GEOMETRY.md],
    ['sm', DONUT_GEOMETRY.sm],
  ])(
    'extends the tappable radius outward by hitSlopRadius (%s)',
    (_size, geometry) => {
      const segments = buildRingSegments(twoHalves, geometry);
      const justOutside = geometry.outerRadius + geometry.hitSlopRadius - 1;
      expect(
        findSegmentIdAtPoint(segments, { x: 0, y: -justOutside }, geometry),
      ).toBe('a');
    },
  );

  it('still rejects taps beyond the padded outer radius', () => {
    const segments = buildRingSegments(twoHalves, DONUT_GEOMETRY.md);
    const { outerRadius, hitSlopRadius } = DONUT_GEOMETRY.md;
    const wayOutside = outerRadius + hitSlopRadius + 1;
    expect(
      findSegmentIdAtPoint(
        segments,
        { x: 0, y: -wayOutside },
        DONUT_GEOMETRY.md,
      ),
    ).toBeNull();
  });

  it('extends the tappable radius inward into the hole by hitSlopRadius', () => {
    const segments = buildRingSegments(twoHalves, DONUT_GEOMETRY.md);
    const { innerRadius, hitSlopRadius } = DONUT_GEOMETRY.md;
    const justInsideHole = innerRadius - hitSlopRadius + 1;
    expect(
      findSegmentIdAtPoint(
        segments,
        { x: 0, y: -justInsideHole },
        DONUT_GEOMETRY.md,
      ),
    ).toBe('a');
  });

  it('still rejects taps deep inside the hole', () => {
    const segments = buildRingSegments(twoHalves, DONUT_GEOMETRY.md);
    expect(
      findSegmentIdAtPoint(segments, { x: 0, y: 0 }, DONUT_GEOMETRY.md),
    ).toBeNull();
  });
});
