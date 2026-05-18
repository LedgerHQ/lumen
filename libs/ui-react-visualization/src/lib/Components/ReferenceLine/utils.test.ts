import { describe, expect, it } from 'vitest';

import type { DrawingArea } from '../../utils/types';

import {
  computeHorizontalLabelCoordinates,
  computeVerticalLabelCoordinates,
  isPixelWithinDrawingArea,
  resolveDataValue,
} from './utils';

const drawingArea: DrawingArea = { x: 20, y: 10, width: 360, height: 180 };

describe('isPixelWithinDrawingArea', () => {
  describe('x axis', () => {
    it('returns true when pixel is at the left edge', () => {
      expect(isPixelWithinDrawingArea(20, 'x', drawingArea)).toBe(true);
    });

    it('returns true when pixel is at the right edge', () => {
      expect(isPixelWithinDrawingArea(380, 'x', drawingArea)).toBe(true);
    });

    it('returns true when pixel is within bounds', () => {
      expect(isPixelWithinDrawingArea(200, 'x', drawingArea)).toBe(true);
    });

    it('returns false when pixel is before the left edge', () => {
      expect(isPixelWithinDrawingArea(19, 'x', drawingArea)).toBe(false);
    });

    it('returns false when pixel is past the right edge', () => {
      expect(isPixelWithinDrawingArea(381, 'x', drawingArea)).toBe(false);
    });
  });

  describe('y axis', () => {
    it('returns true when pixel is at the top edge', () => {
      expect(isPixelWithinDrawingArea(10, 'y', drawingArea)).toBe(true);
    });

    it('returns true when pixel is at the bottom edge', () => {
      expect(isPixelWithinDrawingArea(190, 'y', drawingArea)).toBe(true);
    });

    it('returns true when pixel is within bounds', () => {
      expect(isPixelWithinDrawingArea(100, 'y', drawingArea)).toBe(true);
    });

    it('returns false when pixel is above the top edge', () => {
      expect(isPixelWithinDrawingArea(9, 'y', drawingArea)).toBe(false);
    });

    it('returns false when pixel is below the bottom edge', () => {
      expect(isPixelWithinDrawingArea(191, 'y', drawingArea)).toBe(false);
    });
  });
});

describe('computeHorizontalLabelCoordinates', () => {
  const yPixel = 100;

  it('positions label at the right edge with textAnchor end', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
    );
    expect(result.x).toBe(380);
    expect(result.y).toBe(100);
    expect(result.textAnchor).toBe('end');
    expect(result.dominantBaseline).toBe('auto');
  });

  it('positions label at the left edge with textAnchor start', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'left',
      drawingArea,
    );
    expect(result.x).toBe(20);
    expect(result.textAnchor).toBe('start');
  });

  it('positions label at center with textAnchor middle', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'center',
      drawingArea,
    );
    expect(result.x).toBe(200);
    expect(result.textAnchor).toBe('middle');
  });

  it('applies dx offset', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
      { dx: -8 },
    );
    expect(result.x).toBe(372);
  });

  it('applies dy offset', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
      { dy: -4 },
    );
    expect(result.y).toBe(96);
  });

  it('defaults dominantBaseline to auto (verticalAlignment=bottom)', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
    );
    expect(result.dominantBaseline).toBe('auto');
  });

  it('overrides dominantBaseline with verticalAlignment=top', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
      { verticalAlignment: 'top' },
    );
    expect(result.dominantBaseline).toBe('hanging');
  });

  it('overrides dominantBaseline with verticalAlignment=middle', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
      { verticalAlignment: 'middle' },
    );
    expect(result.dominantBaseline).toBe('central');
  });
});

describe('computeVerticalLabelCoordinates', () => {
  const xPixel = 150;

  it('positions label at the top with dominant-baseline hanging', () => {
    const result = computeVerticalLabelCoordinates(xPixel, 'top', drawingArea);
    expect(result.x).toBe(150);
    expect(result.y).toBe(10);
    expect(result.textAnchor).toBe('middle');
    expect(result.dominantBaseline).toBe('hanging');
  });

  it('positions label at the bottom with dominant-baseline auto', () => {
    const result = computeVerticalLabelCoordinates(
      xPixel,
      'bottom',
      drawingArea,
    );
    expect(result.y).toBe(190);
    expect(result.dominantBaseline).toBe('auto');
  });

  it('positions label at the middle with dominant-baseline central', () => {
    const result = computeVerticalLabelCoordinates(
      xPixel,
      'middle',
      drawingArea,
    );
    expect(result.y).toBe(100);
    expect(result.dominantBaseline).toBe('central');
  });

  it('applies dx offset', () => {
    const result = computeVerticalLabelCoordinates(xPixel, 'top', drawingArea, {
      dx: 4,
    });
    expect(result.x).toBe(154);
  });

  it('applies dy offset', () => {
    const result = computeVerticalLabelCoordinates(xPixel, 'top', drawingArea, {
      dy: 6,
    });
    expect(result.y).toBe(16);
  });

  it('defaults textAnchor to middle (horizontalAlignment=center)', () => {
    const result = computeVerticalLabelCoordinates(xPixel, 'top', drawingArea);
    expect(result.textAnchor).toBe('middle');
  });

  it('overrides textAnchor with horizontalAlignment=left', () => {
    const result = computeVerticalLabelCoordinates(xPixel, 'top', drawingArea, {
      horizontalAlignment: 'left',
    });
    expect(result.textAnchor).toBe('start');
  });

  it('overrides textAnchor with horizontalAlignment=right', () => {
    const result = computeVerticalLabelCoordinates(xPixel, 'top', drawingArea, {
      horizontalAlignment: 'right',
    });
    expect(result.textAnchor).toBe('end');
  });
});

describe('resolveDataValue', () => {
  it('returns the axis value when data contains numbers', () => {
    expect(resolveDataValue(2, { data: [100, 200, 300, 400] })).toBe(300);
  });

  it('returns the index when data contains strings', () => {
    expect(resolveDataValue(2, { data: ['a', 'b', 'c', 'd'] })).toBe(2);
  });

  it('returns the index when no axis config is provided', () => {
    expect(resolveDataValue(5)).toBe(5);
    expect(resolveDataValue(5, undefined)).toBe(5);
  });

  it('returns the index when axis config has no data', () => {
    expect(resolveDataValue(3, {})).toBe(3);
  });

  it('returns undefined when index is out of bounds in numeric data', () => {
    expect(resolveDataValue(10, { data: [1, 2, 3] })).toBeUndefined();
  });
});
