import { describe, expect, it } from 'vitest';

import { computeLineLabelX, computeLineLabelY } from './lineLabelPosition';

const area = { x: 10, y: 30, width: 200, height: 100 };

describe('computeLineLabelX', () => {
  it('centers the label on the line', () => {
    expect(computeLineLabelX(100, 40, area)).toBe(80);
  });

  it('clamps to the left edge of the drawing area', () => {
    expect(computeLineLabelX(15, 40, area)).toBe(area.x);
  });

  it('clamps to the right edge of the drawing area', () => {
    expect(computeLineLabelX(205, 40, area)).toBe(area.x + area.width - 40);
  });
});

describe('computeLineLabelY', () => {
  it('places the label above the drawing area', () => {
    const layout = { gap: 8, height: 16 };
    expect(computeLineLabelY(area, layout)).toBe(area.y - 8 - 16);
  });
});
