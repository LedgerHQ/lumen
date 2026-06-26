import { describe, expect, it } from 'vitest';

import { ARROW_HEIGHT, ARROW_WIDTH, GAP, LABEL_FONT_SIZE } from './constants';
import {
  buildArrowPoints,
  computeLabelX,
  computeLabelY,
  isWithinBounds,
  resolveLabel,
} from './utils';

describe('isWithinBounds', () => {
  const area = { x: 10, y: 20, width: 100, height: 50 };

  it('returns true for a point inside the area', () => {
    expect(isWithinBounds(50, 40, area)).toBe(true);
  });

  it('returns true on the top-left edge', () => {
    expect(isWithinBounds(10, 20, area)).toBe(true);
  });

  it('returns true on the bottom-right edge', () => {
    expect(isWithinBounds(110, 70, area)).toBe(true);
  });

  it('returns false when x is left of the area', () => {
    expect(isWithinBounds(9, 40, area)).toBe(false);
  });

  it('returns false when x is right of the area', () => {
    expect(isWithinBounds(111, 40, area)).toBe(false);
  });

  it('returns false when y is above the area', () => {
    expect(isWithinBounds(50, 19, area)).toBe(false);
  });

  it('returns false when y is below the area', () => {
    expect(isWithinBounds(50, 71, area)).toBe(false);
  });
});

describe('buildArrowPoints', () => {
  const cx = 100;
  const cy = 200;
  const radius = 5;
  const halfW = ARROW_WIDTH / 2;

  it('builds a downward-pointing arrow for top position', () => {
    const result = buildArrowPoints(cx, cy, radius, 'top');
    const tipY = cy - radius - GAP;
    const baseY = tipY - ARROW_HEIGHT;
    expect(result).toBe(
      `${cx},${tipY} ${cx - halfW},${baseY} ${cx + halfW},${baseY}`,
    );
  });

  it('builds an upward-pointing arrow for bottom position', () => {
    const result = buildArrowPoints(cx, cy, radius, 'bottom');
    const tipY = cy + radius + GAP;
    const baseY = tipY + ARROW_HEIGHT;
    expect(result).toBe(
      `${cx},${tipY} ${cx - halfW},${baseY} ${cx + halfW},${baseY}`,
    );
  });
});

describe('resolveLabel', () => {
  it('returns a string label as-is', () => {
    expect(resolveLabel('Peak', 0)).toBe('Peak');
  });

  it('calls a function label with dataX', () => {
    expect(resolveLabel((i) => `#${i}`, 3)).toBe('#3');
  });

  it('returns undefined for an undefined label', () => {
    expect(resolveLabel(undefined, 0)).toBeUndefined();
  });

  it('returns undefined for an empty string', () => {
    expect(resolveLabel('', 0)).toBeUndefined();
  });

  it('returns undefined when a function returns an empty string', () => {
    expect(resolveLabel(() => '', 0)).toBeUndefined();
  });
});

describe('computeLabelY', () => {
  const pixelY = 100;
  const radius = 5;

  it('positions label above the point when labelPosition is top with arrow', () => {
    const result = computeLabelY(pixelY, radius, 'top', true);
    const arrowOffset = ARROW_HEIGHT + GAP;
    expect(result).toBe(pixelY - radius - arrowOffset - GAP);
  });

  it('positions label above the point when labelPosition is top without arrow', () => {
    const result = computeLabelY(pixelY, radius, 'top', false);
    expect(result).toBe(pixelY - radius - GAP - GAP);
  });

  it('positions label below the point when labelPosition is bottom with arrow', () => {
    const result = computeLabelY(pixelY, radius, 'bottom', true);
    const arrowOffset = ARROW_HEIGHT + GAP;
    expect(result).toBe(pixelY + radius + arrowOffset + GAP + LABEL_FONT_SIZE);
  });

  it('positions label below the point when labelPosition is bottom without arrow', () => {
    const result = computeLabelY(pixelY, radius, 'bottom', false);
    expect(result).toBe(pixelY + radius + GAP + GAP + LABEL_FONT_SIZE);
  });
});

describe('computeLabelX', () => {
  const area = { x: 100, y: 0, width: 200, height: 100 };
  const halfArrow = ARROW_WIDTH / 2;

  it('centres the label on the point when clamping is disabled', () => {
    expect(
      computeLabelX(105, 'A very long label', area, 'center', true),
    ).toEqual({
      x: 105,
      textAnchor: 'middle',
    });
  });

  it('centres the label on the point when it fits inside the bounds', () => {
    expect(computeLabelX(200, 'Peak', area, 'auto', true)).toEqual({
      x: 200,
      textAnchor: 'middle',
    });
  });

  it('anchors near the left edge, offset by half the arrow width from the point', () => {
    expect(computeLabelX(105, 'Long label', area, 'auto', true)).toEqual({
      x: 105 - halfArrow,
      textAnchor: 'start',
    });
  });

  it('anchors near the right edge, offset by half the arrow width from the point', () => {
    expect(computeLabelX(295, 'Long label', area, 'auto', true)).toEqual({
      x: 295 + halfArrow,
      textAnchor: 'end',
    });
  });

  it('omits the arrow offset when no arrow is rendered', () => {
    expect(computeLabelX(105, 'Long label', area, 'auto', false)).toEqual({
      x: 105,
      textAnchor: 'start',
    });
    expect(computeLabelX(295, 'Long label', area, 'auto', false)).toEqual({
      x: 295,
      textAnchor: 'end',
    });
  });
});
