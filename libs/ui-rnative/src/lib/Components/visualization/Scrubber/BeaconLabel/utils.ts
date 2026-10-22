import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

import { chartConfig } from '../../config';
import type { DrawingArea } from '../../utils/types';
import { safeGetBBoxWidth } from '../DefaultScrubberTooltip/utils';
import type { SvgBBoxElement } from '../types';

const { beaconLabel, scrubber } = chartConfig;

/**
 * Stacks labels top to bottom around their beacons, pushing them apart so they
 * never overlap, then back up so the last one stays inside the drawing area.
 * Expects `beaconYs` sorted ascending and returns the top edge of each label.
 */
export const computeBeaconLabelYs = (
  beaconYs: number[],
  drawingArea: DrawingArea,
): number[] => {
  const { height, rowGap } = beaconLabel;
  const ys = beaconYs.map((y) => y - height / 2);

  for (let i = 1; i < ys.length; i++) {
    ys[i] = Math.max(ys[i], ys[i - 1] + height + rowGap);
  }

  let limit = drawingArea.y + drawingArea.height - height;
  for (let i = ys.length - 1; i >= 0; i--) {
    ys[i] = Math.min(ys[i], limit);
    limit = ys[i] - height - rowGap;
  }

  return ys;
};

/**
 * Places a label to the right of the beacon, flipping to the left when it
 * would overflow the drawing area.
 */
export const computeBeaconLabelX = (
  pixelX: number,
  width: number,
  drawingArea: DrawingArea,
): number => {
  const offset = scrubber.beaconRadius + beaconLabel.gap;
  const fitsRight =
    pixelX + offset + width <= drawingArea.x + drawingArea.width;

  return fitsRight ? pixelX + offset : pixelX - offset - width;
};

/**
 * Measures the rendered width of an SVG element through the async `getBBox`
 * bridge. Re-measures after every render, and ignores results that resolve
 * after the element changed or unmounted.
 */
export const useMeasuredWidth = (): [
  RefObject<SvgBBoxElement | null>,
  number,
] => {
  const ref = useRef<SvgBBoxElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let canceled = false;
    void safeGetBBoxWidth(ref.current).then((measured) => {
      if (!canceled) {
        setWidth(measured);
      }
    });
    return () => {
      canceled = true;
    };
  });

  return [ref, width];
};
