import { describe, expect, it } from '@jest/globals';

import type { DonutGeometry } from './constants';
import { DONUT_GEOMETRY, getDonutViewBox, toRingLocalPoint } from './constants';
import type { DonutSegment } from './types';
import {
  buildArcs,
  buildEmptyRingPath,
  findSegmentIdAtPoint,
  getSegmentPercents,
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

describe('toRingLocalPoint', () => {
  it('maps the gesture overlay center to the arc-space origin', () => {
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
    const arcs = buildArcs(twoHalves, DONUT_GEOMETRY.md);
    expect(
      findSegmentIdAtPoint(arcs, { x: 0, y: 0 }, DONUT_GEOMETRY.md),
    ).toBeNull();
  });

  it('returns null beyond outerRadius', () => {
    const arcs = buildArcs(twoHalves, DONUT_GEOMETRY.md);
    expect(
      findSegmentIdAtPoint(arcs, { x: 0, y: -200 }, DONUT_GEOMETRY.md),
    ).toBeNull();
  });

  it('resolves a point at the top of the ring to the first slice', () => {
    const arcs = buildArcs(twoHalves, DONUT_GEOMETRY.md);
    expect(
      findSegmentIdAtPoint(arcs, { x: 0, y: -midRadius }, DONUT_GEOMETRY.md),
    ).toBe('a');
  });

  it('resolves a point at the bottom of the ring to the second slice', () => {
    const arcs = buildArcs(twoHalves, DONUT_GEOMETRY.md);
    expect(
      findSegmentIdAtPoint(arcs, { x: 0, y: midRadius }, DONUT_GEOMETRY.md),
    ).toBe('b');
  });

  it('resolves each series segment at its own midAngle', () => {
    const arcs = buildArcs(series, DONUT_GEOMETRY.md);
    arcs.forEach((arc) => {
      const point = {
        x: Math.sin(arc.midAngle) * midRadius,
        y: -Math.cos(arc.midAngle) * midRadius,
      };
      expect(findSegmentIdAtPoint(arcs, point, DONUT_GEOMETRY.md)).toBe(arc.id);
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
      const arcs = buildArcs(twoHalves, geometry);
      const justOutside = geometry.outerRadius + geometry.hitSlopRadius - 1;
      expect(
        findSegmentIdAtPoint(arcs, { x: 0, y: -justOutside }, geometry),
      ).toBe('a');
    },
  );

  it('still rejects taps beyond the padded outer radius', () => {
    const arcs = buildArcs(twoHalves, DONUT_GEOMETRY.md);
    const { outerRadius, hitSlopRadius } = DONUT_GEOMETRY.md;
    const wayOutside = outerRadius + hitSlopRadius + 1;
    expect(
      findSegmentIdAtPoint(arcs, { x: 0, y: -wayOutside }, DONUT_GEOMETRY.md),
    ).toBeNull();
  });

  it('extends the tappable radius inward into the hole by hitSlopRadius', () => {
    const arcs = buildArcs(twoHalves, DONUT_GEOMETRY.md);
    const { innerRadius, hitSlopRadius } = DONUT_GEOMETRY.md;
    const justInsideHole = innerRadius - hitSlopRadius + 1;
    expect(
      findSegmentIdAtPoint(
        arcs,
        { x: 0, y: -justInsideHole },
        DONUT_GEOMETRY.md,
      ),
    ).toBe('a');
  });

  it('still rejects taps deep inside the hole', () => {
    const arcs = buildArcs(twoHalves, DONUT_GEOMETRY.md);
    expect(
      findSegmentIdAtPoint(arcs, { x: 0, y: 0 }, DONUT_GEOMETRY.md),
    ).toBeNull();
  });
});
