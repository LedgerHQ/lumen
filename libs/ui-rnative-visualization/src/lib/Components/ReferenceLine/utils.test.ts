import { describe, expect, it } from '@jest/globals';

import { getNumericScale } from '../../utils/scales/scales';
import type { DrawingArea } from '../../utils/types';

import {
  computeHorizontalLabelCoordinates,
  computeVerticalLabelCoordinates,
  isPixelWithinDrawingArea,
  resolvePixel,
} from './utils';

const drawingArea: DrawingArea = { x: 20, y: 10, width: 360, height: 180 };

const linearScale = getNumericScale({
  scaleType: 'linear',
  domain: { min: 0, max: 100 },
  range: { min: drawingArea.x, max: drawingArea.x + drawingArea.width },
});

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
  const pixel = 100;

  it('positions label at the end (right edge) with textAnchor start', () => {
    const result = computeHorizontalLabelCoordinates({
      pixel,
      labelPosition: 'end',
      drawingArea,
    });
    expect(result.x).toBe(380);
    expect(result.y).toBe(100);
    expect(result.textAnchor).toBe('start');
    expect(result.dominantBaseline).toBe('hanging');
  });

  it('positions label at the start (left edge) with textAnchor end', () => {
    const result = computeHorizontalLabelCoordinates({
      pixel,
      labelPosition: 'start',
      drawingArea,
    });
    expect(result.x).toBe(20);
    expect(result.textAnchor).toBe('end');
  });

  it('positions label at center with textAnchor middle', () => {
    const result = computeHorizontalLabelCoordinates({
      pixel,
      labelPosition: 'center',
      drawingArea,
    });
    expect(result.x).toBe(200);
    expect(result.textAnchor).toBe('middle');
  });

  it('applies dx offset', () => {
    const result = computeHorizontalLabelCoordinates({
      pixel,
      labelPosition: 'end',
      drawingArea,
      dx: -8,
    });
    expect(result.x).toBe(372);
  });

  it('applies dy offset', () => {
    const result = computeHorizontalLabelCoordinates({
      pixel,
      labelPosition: 'end',
      drawingArea,
      dy: -4,
    });
    expect(result.y).toBe(96);
  });

  it('defaults dominantBaseline to hanging (verticalAlignment=end)', () => {
    const result = computeHorizontalLabelCoordinates({
      pixel,
      labelPosition: 'end',
      drawingArea,
    });
    expect(result.dominantBaseline).toBe('hanging');
  });

  it('overrides dominantBaseline with verticalAlignment=start', () => {
    const result = computeHorizontalLabelCoordinates({
      pixel,
      labelPosition: 'end',
      drawingArea,
      verticalAlignment: 'start',
    });
    expect(result.dominantBaseline).toBe('auto');
  });

  it('overrides dominantBaseline with verticalAlignment=center', () => {
    const result = computeHorizontalLabelCoordinates({
      pixel,
      labelPosition: 'end',
      drawingArea,
      verticalAlignment: 'center',
    });
    expect(result.dominantBaseline).toBe('central');
  });
});

describe('computeVerticalLabelCoordinates', () => {
  const pixel = 150;

  it('positions label at start (top) with dominant-baseline auto', () => {
    const result = computeVerticalLabelCoordinates({
      pixel,
      labelPosition: 'start',
      drawingArea,
    });
    expect(result.x).toBe(150);
    expect(result.y).toBe(10);
    expect(result.textAnchor).toBe('middle');
    expect(result.dominantBaseline).toBe('auto');
  });

  it('positions label at end (bottom) with dominant-baseline hanging', () => {
    const result = computeVerticalLabelCoordinates({
      pixel,
      labelPosition: 'end',
      drawingArea,
    });
    expect(result.y).toBe(190);
    expect(result.dominantBaseline).toBe('hanging');
  });

  it('positions label at center with dominant-baseline central', () => {
    const result = computeVerticalLabelCoordinates({
      pixel,
      labelPosition: 'center',
      drawingArea,
    });
    expect(result.y).toBe(100);
    expect(result.dominantBaseline).toBe('central');
  });

  it('applies dx offset', () => {
    const result = computeVerticalLabelCoordinates({
      pixel,
      labelPosition: 'start',
      drawingArea,
      dx: 4,
    });
    expect(result.x).toBe(154);
  });

  it('applies dy offset', () => {
    const result = computeVerticalLabelCoordinates({
      pixel,
      labelPosition: 'start',
      drawingArea,
      dy: 6,
    });
    expect(result.y).toBe(16);
  });

  it('defaults textAnchor to middle (horizontalAlignment=center)', () => {
    const result = computeVerticalLabelCoordinates({
      pixel,
      labelPosition: 'start',
      drawingArea,
    });
    expect(result.textAnchor).toBe('middle');
  });

  it('overrides textAnchor with horizontalAlignment=start', () => {
    const result = computeVerticalLabelCoordinates({
      pixel,
      labelPosition: 'start',
      drawingArea,
      horizontalAlignment: 'start',
    });
    expect(result.textAnchor).toBe('end');
  });

  it('overrides textAnchor with horizontalAlignment=end', () => {
    const result = computeVerticalLabelCoordinates({
      pixel,
      labelPosition: 'start',
      drawingArea,
      horizontalAlignment: 'end',
    });
    expect(result.textAnchor).toBe('start');
  });
});

describe('resolvePixel', () => {
  it('returns a pixel value for a data value within bounds', () => {
    const result = resolvePixel({
      dataValue: 50,
      scale: linearScale,
      axis: 'x',
      drawingArea,
    });
    expect(typeof result).toBe('number');
  });

  it('returns undefined when scale is missing', () => {
    expect(
      resolvePixel({
        dataValue: 50,
        scale: undefined,
        axis: 'x',
        drawingArea,
      }),
    ).toBeUndefined();
  });

  it('returns undefined when pixel falls outside drawing area', () => {
    expect(
      resolvePixel({
        dataValue: 200,
        scale: linearScale,
        axis: 'x',
        drawingArea,
      }),
    ).toBeUndefined();
  });

  it('resolves data index through numeric axisConfig.data', () => {
    const atIndex = resolvePixel({
      dataValue: 50,
      scale: linearScale,
      axis: 'x',
      drawingArea,
    });
    const throughData = resolvePixel({
      dataValue: 1,
      scale: linearScale,
      axis: 'x',
      drawingArea,
      axisConfig: { data: [0, 50, 100] },
    });
    expect(throughData).toBe(atIndex);
  });

  it('uses index directly when axisConfig.data contains strings', () => {
    const withoutConfig = resolvePixel({
      dataValue: 2,
      scale: linearScale,
      axis: 'x',
      drawingArea,
    });
    const withStringData = resolvePixel({
      dataValue: 2,
      scale: linearScale,
      axis: 'x',
      drawingArea,
      axisConfig: { data: ['a', 'b', 'c'] },
    });
    expect(withStringData).toBe(withoutConfig);
  });

  it('returns undefined when data index is out of bounds', () => {
    expect(
      resolvePixel({
        dataValue: 10,
        scale: linearScale,
        axis: 'x',
        drawingArea,
        axisConfig: { data: [1, 2, 3] },
      }),
    ).toBeUndefined();
  });
});
