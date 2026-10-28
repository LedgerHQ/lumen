import { chartConfig } from '../../config';
import type { DrawingArea } from '../../utils/types';

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

  if (ys.length === 0) {
    return ys;
  }

  ys[0] = Math.max(ys[0], drawingArea.y);
  for (let i = 1; i < ys.length; i++) {
    ys[i] = Math.max(ys[i], ys[i - 1] + height + rowGap);
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

  return fitsRight
    ? pixelX + offset
    : Math.max(drawingArea.x, pixelX - offset - width);
};
