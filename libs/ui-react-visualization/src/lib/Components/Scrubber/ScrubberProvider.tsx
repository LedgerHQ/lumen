import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useCartesianChartContext } from '../CartesianChart/context';
import { useMagneticPointsContext } from '../Point/pointContext';
import { ScrubberContextProvider } from './context';
import type { ScrubberContextValue, ScrubberProviderProps } from './types';
import {
  applyMagnetization,
  buildSortedMagnets,
  getDataIndexFromPosition,
  resolvePixelX,
} from './utils';

export function ScrubberProvider({
  children,
  svgRef,
  enableScrubbing,
  onScrubberPositionChange,
  magnetRadius = 8,
}: Readonly<ScrubberProviderProps>) {
  const { getXScale, getXAxisConfig, dataLength } = useCartesianChartContext();
  const { getMagneticPoints, version } = useMagneticPointsContext();
  const [scrubberPosition, setScrubberPosition] = useState<number | undefined>(
    undefined,
  );
  const scrubberPositionRef = useRef(scrubberPosition);
  scrubberPositionRef.current = scrubberPosition;

  const pendingPixelXRef = useRef<number | null>(null);
  const rafIdRef = useRef(0);
  const sortedMagnets = useMemo(() => {
    const magneticIndices = getMagneticPoints();
    return buildSortedMagnets({
      magneticIndices,
      getPixelForIndex: (index) =>
        resolvePixelX(index, getXScale, getXAxisConfig()),
    });
    // version is needed to re-compute the sorted magnets when the magnetic points change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, getMagneticPoints, getXScale, getXAxisConfig]);

  const setScrubberPositionAndNotify = useCallback(
    (index: number | undefined) => {
      const clamped =
        index === undefined
          ? undefined
          : Math.max(0, Math.min(index, dataLength - 1));
      setScrubberPosition(clamped);
      onScrubberPositionChange?.(clamped);
    },
    [dataLength, onScrubberPositionChange],
  );

  const updatePosition = useCallback(
    (pixelX: number) => {
      const scale = getXScale();
      if (!scale || !enableScrubbing || dataLength <= 0) return;

      const axisConfig = getXAxisConfig();

      let index = getDataIndexFromPosition(
        pixelX,
        scale,
        axisConfig,
        dataLength,
      );

      if (magnetRadius > 0) {
        index = applyMagnetization(index, pixelX, sortedMagnets, magnetRadius);
      }

      if (index !== scrubberPositionRef.current) {
        setScrubberPositionAndNotify(index);
      }
    },
    [
      enableScrubbing,
      getXScale,
      getXAxisConfig,
      dataLength,
      sortedMagnets,
      magnetRadius,
      setScrubberPositionAndNotify,
    ],
  );

  const requestUpdate = useCallback(
    (pixelX: number) => {
      pendingPixelXRef.current = pixelX;
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = 0;
          const px = pendingPixelXRef.current;
          if (px !== null) {
            pendingPixelXRef.current = null;
            updatePosition(px);
          }
        });
      }
    },
    [updatePosition],
  );

  const clearPosition = useCallback(() => {
    if (!enableScrubbing) return;
    setScrubberPositionAndNotify(undefined);
  }, [enableScrubbing, setScrubberPositionAndNotify]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const target = event.currentTarget as SVGSVGElement;
      const rect = target.getBoundingClientRect();
      requestUpdate(event.clientX - rect.left);
    },
    [requestUpdate],
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!enableScrubbing || !event.touches.length) return;
      const touch = event.touches[0];
      const target = event.currentTarget as SVGSVGElement;
      const rect = target.getBoundingClientRect();
      requestUpdate(touch.clientX - rect.left);
    },
    [enableScrubbing, requestUpdate],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!event.touches.length) return;
      event.preventDefault();
      const touch = event.touches[0];
      const target = event.currentTarget as SVGSVGElement;
      const rect = target.getBoundingClientRect();
      requestUpdate(touch.clientX - rect.left);
    },
    [requestUpdate],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enableScrubbing || dataLength <= 0) return;

      const maxIndex = dataLength - 1;
      const current = scrubberPositionRef.current ?? maxIndex;
      const step = event.shiftKey
        ? Math.min(10, Math.max(1, Math.floor(maxIndex * 0.1)))
        : 1;

      let next: number | undefined;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          next = Math.max(0, current - step);
          break;
        case 'ArrowRight':
          event.preventDefault();
          next = Math.min(maxIndex, current + step);
          break;
        case 'Home':
          event.preventDefault();
          next = 0;
          break;
        case 'End':
          event.preventDefault();
          next = maxIndex;
          break;
        case 'Escape':
          event.preventDefault();
          next = undefined;
          break;
        default:
          return;
      }

      setScrubberPositionAndNotify(next);
    },
    [enableScrubbing, dataLength, setScrubberPositionAndNotify],
  );

  const handleBlur = useCallback(() => {
    if (!enableScrubbing || scrubberPositionRef.current === undefined) return;
    clearPosition();
  }, [enableScrubbing, clearPosition]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !enableScrubbing) return;

    svg.addEventListener('mousemove', handleMouseMove);
    svg.addEventListener('mouseleave', clearPosition);
    svg.addEventListener('touchstart', handleTouchStart, { passive: false });
    svg.addEventListener('touchmove', handleTouchMove, { passive: false });
    svg.addEventListener('touchend', clearPosition);
    svg.addEventListener('touchcancel', clearPosition);
    svg.addEventListener('keydown', handleKeyDown);
    svg.addEventListener('blur', handleBlur);

    return () => {
      svg.removeEventListener('mousemove', handleMouseMove);
      svg.removeEventListener('mouseleave', clearPosition);
      svg.removeEventListener('touchstart', handleTouchStart);
      svg.removeEventListener('touchmove', handleTouchMove);
      svg.removeEventListener('touchend', clearPosition);
      svg.removeEventListener('touchcancel', clearPosition);
      svg.removeEventListener('keydown', handleKeyDown);
      svg.removeEventListener('blur', handleBlur);
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    };
  }, [
    svgRef,
    enableScrubbing,
    handleMouseMove,
    clearPosition,
    handleTouchStart,
    handleTouchMove,
    handleKeyDown,
    handleBlur,
  ]);

  const contextValue: ScrubberContextValue = useMemo(
    () => ({
      enableScrubbing,
      scrubberPosition,
      onScrubberPositionChange: setScrubberPositionAndNotify,
    }),
    [enableScrubbing, scrubberPosition, setScrubberPositionAndNotify],
  );

  return (
    <ScrubberContextProvider value={contextValue}>
      {children}
    </ScrubberContextProvider>
  );
}
