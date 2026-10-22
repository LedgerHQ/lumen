import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
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
 * Measures an SVG element once per `signature` (`null` skips).
 */
export const useMeasuredWidth = (
  signature: string | null,
): [RefObject<SvgBBoxElement | null>, number] => {
  const ref = useRef<SvgBBoxElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (signature === null) {
      return;
    }
    let canceled = false;
    const frame = requestAnimationFrame(() => {
      void safeGetBBoxWidth(ref.current).then((measured) => {
        if (!canceled) setWidth(measured);
      });
    });
    return () => {
      canceled = true;
      cancelAnimationFrame(frame);
    };
  }, [signature]);

  return [ref, width];
};

export type TextFont = {
  family: string;
  size: number;
  weight: string | number | undefined;
};

const charWidths = new Map<string, number>();
const listeners = new Set<() => void>();
let version = 0;

const charKey = (font: TextFont, char: string): string =>
  `${font.family}|${font.size}|${font.weight}|${char}`;

export const getMissingChars = (text: string, font: TextFont): string[] =>
  [...new Set(text)].filter((c) => !charWidths.has(charKey(font, c)));

export const saveCharWidths = (
  font: TextFont,
  widths: Record<string, number>,
): void => {
  for (const [char, width] of Object.entries(widths)) {
    charWidths.set(charKey(font, char), width);
  }
  version += 1;
  listeners.forEach((listener) => listener());
};

export const computeTextWidth = (
  text: string,
  font: TextFont,
): number | undefined => {
  let width = 0;
  for (const char of text) {
    const charWidth = charWidths.get(charKey(font, char));
    if (charWidth === undefined) {
      return undefined;
    }
    width += charWidth;
  }
  return width;
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useTextWidth = (
  text: string,
  font: TextFont,
): number | undefined => {
  useSyncExternalStore(subscribe, () => version);
  return computeTextWidth(text, font);
};
