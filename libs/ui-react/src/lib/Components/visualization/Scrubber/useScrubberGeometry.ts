import { useMemo } from 'react';

import { chartConfig } from '../../config';
import type { DrawingArea } from '../../utils/types';
import { useCartesianChartContext } from '../CartesianChart/context';

import { useScrubberContext } from './context';
import type { ScrubberProps } from './types';
import {
  computeOverlayRect,
  resolvePixelX,
  resolvePixelY,
  resolveTooltipPayload,
  type OverlayRect,
  type ScrubberTooltipPayload,
} from './utils';

const { color } = chartConfig;

type Beacon = { id: string; stroke: string; pixelY: number };

type ScrubberGeometry = {
  pixelX: number;
  drawingArea: DrawingArea;
  beacons: Beacon[];
  overlay: OverlayRect;
  tooltipPayload: ScrubberTooltipPayload | undefined;
};

type UseScrubberGeometryParams = {
  showBeacons: boolean;
  tooltip: ScrubberProps['tooltip'];
};

/**
 * Resolves the scrubber's chart geometry: reads the scrubber and chart
 * contexts, projects the active data index to the line's `pixelX`, and derives
 * the per-series beacons, the future-data overlay rect, and the tooltip
 * payload. Returns `null` when no scrubber position is active or the position
 * cannot be projected.
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
    if (scrubberPosition === undefined || !showBeacons) return [];
    return series
      .map((s) => {
        const seriesData = seriesMap.get(s.id)?.data;
        const pixelY = resolvePixelY(scrubberPosition, seriesData, getYScale);
        if (pixelY === undefined) return null;
        return { id: s.id, stroke: s.stroke || color.stroke, pixelY };
      })
      .filter((b): b is Beacon => b !== null);
  }, [scrubberPosition, showBeacons, series, seriesMap, getYScale]);

  const tooltipPayload = useMemo(() => {
    if (scrubberPosition === undefined) return undefined;
    return resolveTooltipPayload(tooltip, scrubberPosition);
  }, [scrubberPosition, tooltip]);

  if (scrubberPosition === undefined || pixelX === undefined) {
    return null;
  }

  return {
    pixelX,
    drawingArea,
    beacons,
    overlay: computeOverlayRect(pixelX, drawingArea),
    tooltipPayload,
  };
};
