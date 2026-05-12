import { describe, expect, it } from 'vitest';

import type { DrawingArea } from '../../utils/types';

import {
  computeHorizontalLabelCoordinates,
  computeVerticalLabelCoordinates,
  isPixelWithinDrawingArea,
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
      0,
      0,
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
      0,
      0,
    );
    expect(result.x).toBe(20);
    expect(result.textAnchor).toBe('start');
  });

  it('positions label at center with textAnchor middle', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'center',
      drawingArea,
      0,
      0,
    );
    expect(result.x).toBe(200);
    expect(result.textAnchor).toBe('middle');
  });

  it('applies labelDx offset', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
      -8,
      0,
    );
    expect(result.x).toBe(372);
  });

  it('applies labelDy offset', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
      0,
      -4,
    );
    expect(result.y).toBe(96);
  });

  it('defaults dominantBaseline to auto (verticalAlignment=bottom)', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
      0,
      0,
    );
    expect(result.dominantBaseline).toBe('auto');
  });

  it('overrides dominantBaseline with verticalAlignment=top', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
      0,
      0,
      undefined,
      'top',
    );
    expect(result.dominantBaseline).toBe('hanging');
  });

  it('overrides dominantBaseline with verticalAlignment=middle', () => {
    const result = computeHorizontalLabelCoordinates(
      yPixel,
      'right',
      drawingArea,
      0,
      0,
      undefined,
      'middle',
    );
    expect(result.dominantBaseline).toBe('central');
  });
});

describe('computeVerticalLabelCoordinates', () => {
  const xPixel = 150;

  it('positions label at the top with dominant-baseline hanging', () => {
    const result = computeVerticalLabelCoordinates(
      xPixel,
      'top',
      drawingArea,
      0,
      0,
    );
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
      0,
      0,
    );
    expect(result.y).toBe(190);
    expect(result.dominantBaseline).toBe('auto');
  });

  it('positions label at the middle with dominant-baseline central', () => {
    const result = computeVerticalLabelCoordinates(
      xPixel,
      'middle',
      drawingArea,
      0,
      0,
    );
    expect(result.y).toBe(100);
    expect(result.dominantBaseline).toBe('central');
  });

  it('applies labelDx offset', () => {
    const result = computeVerticalLabelCoordinates(
      xPixel,
      'top',
      drawingArea,
      4,
      0,
    );
    expect(result.x).toBe(154);
  });

  it('applies labelDy offset', () => {
    const result = computeVerticalLabelCoordinates(
      xPixel,
      'top',
      drawingArea,
      0,
      6,
    );
    expect(result.y).toBe(16);
  });

  it('defaults textAnchor to middle (horizontalAlignment=center)', () => {
    const result = computeVerticalLabelCoordinates(
      xPixel,
      'top',
      drawingArea,
      0,
      0,
    );
    expect(result.textAnchor).toBe('middle');
  });

  it('overrides textAnchor with horizontalAlignment=left', () => {
    const result = computeVerticalLabelCoordinates(
      xPixel,
      'top',
      drawingArea,
      0,
      0,
      'left',
    );
    expect(result.textAnchor).toBe('start');
  });

  it('overrides textAnchor with horizontalAlignment=right', () => {
    const result = computeVerticalLabelCoordinates(
      xPixel,
      'top',
      drawingArea,
      0,
      0,
      'right',
    );
    expect(result.textAnchor).toBe('end');
  });
});
