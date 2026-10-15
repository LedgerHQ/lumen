import { useMemo } from 'react';

import { useCartesianChartContext } from '../CartesianChart/context';
import { chartConfig } from '../config';
import type { DrawingArea } from '../utils/types';

import { useScrubberContext } from './context';
import type { ScrubberProps } from './types';
import {
  computeOverlayRect,
  resolveLastIndex,
  resolvePixelX,
  resolvePixelY,
  resolveTooltipPayload,
  type OverlayRect,
  type ScrubberTooltipPayload,
} from './utils';

const { color } = chartConfig;

type Beacon = { id: string; stroke: string; pixelX: number; pixelY: number };

type ScrubberGeometry = {
  beacons: Beacon[];
  scrubbing?: {
    pixelX: number;
    drawingArea: DrawingArea;
    overlay: OverlayRect;
    tooltipPayload: ScrubberTooltipPayload | undefined;
  };
};

type UseScrubberGeometryParams = {
  showBeacons: boolean;
  tooltip: ScrubberProps['tooltip'];
};

/**
 * Resolves the scrubber's chart geometry: reads the scrubber and chart
 * contexts, projects the active data index to the line's `pixelX`, and derives
 * the per-series beacons, the future-data overlay rect, and the tooltip
 * payload. While idle, beacons sit at the end of each series. Returns `null`
 * when there is nothing to draw.
 */
export const useScrubberGeometry = ({
  showBeacons,
  tooltip,
}: UseScrubberGeometryParams): ScrubberGeometry | null => {
  const { scrubberPosition } = useScrubberContext();
  const {
    getXScale,
    getXAxisConfig,
    getYScale,
    drawingArea,
    series,
    seriesMap,
  } = useCartesianChartContext();

  const pixelX = useMemo(() => {
    if (scrubberPosition === undefined) return undefined;
    return resolvePixelX(scrubberPosition, getXScale, getXAxisConfig());
  }, [scrubberPosition, getXScale, getXAxisConfig]);

  const beacons = useMemo(() => {
    if (!showBeacons) {
      return [];
    }
    return series
      .map((s) => {
        const seriesData = seriesMap.get(s.id)?.data;
        const index = scrubberPosition ?? resolveLastIndex(seriesData);
        if (index === undefined) {
          return null;
        }
        const pixelX = resolvePixelX(index, getXScale, getXAxisConfig());
        const pixelY = resolvePixelY(index, seriesData, getYScale);
        if (pixelX === undefined || pixelY === undefined) {
          return null;
        }
        return { id: s.id, stroke: s.stroke || color.stroke, pixelX, pixelY };
      })
      .filter((b): b is Beacon => b !== null);
  }, [
    scrubberPosition,
    showBeacons,
    series,
    seriesMap,
    getXScale,
    getXAxisConfig,
    getYScale,
  ]);

  const tooltipPayload = useMemo(() => {
    if (scrubberPosition === undefined) return undefined;
    return resolveTooltipPayload(tooltip, scrubberPosition);
  }, [scrubberPosition, tooltip]);

  if (scrubberPosition === undefined || pixelX === undefined) {
    return beacons.length > 0 ? { beacons } : null;
  }

  return {
    beacons,
    scrubbing: {
      pixelX,
      drawingArea,
      overlay: computeOverlayRect(pixelX, drawingArea),
      tooltipPayload,
    },
  };
};
