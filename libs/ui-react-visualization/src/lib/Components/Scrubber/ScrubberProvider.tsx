import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCartesianChartContext } from '../CartesianChart/context';
import { ScrubberContextProvider } from './context';
import type { ScrubberContextValue, ScrubberProviderProps } from './types';
import { getDataIndexFromPosition } from './utils';

export function ScrubberProvider({
  children,
  svgRef,
  enableScrubbing,
  onScrubberPositionChange,
}: ScrubberProviderProps) {
  const { getXScale, getXAxisConfig, dataLength } = useCartesianChartContext();
  const [scrubberPosition, setScrubberPosition] = useState<number | undefined>(
    undefined,
  );

  const updatePosition = useCallback(
    (pixelX: number) => {
      const scale = getXScale();
      if (!scale || !enableScrubbing) return;

      const index = getDataIndexFromPosition(
        pixelX,
        scale,
        getXAxisConfig(),
        dataLength,
      );

      if (index !== scrubberPosition) {
        setScrubberPosition(index);
        onScrubberPositionChange?.(index);
      }
    },
    [
      enableScrubbing,
      getXScale,
      getXAxisConfig,
      dataLength,
      scrubberPosition,
      onScrubberPositionChange,
    ],
  );

  const clearPosition = useCallback(() => {
    if (!enableScrubbing) return;
    setScrubberPosition(undefined);
    onScrubberPositionChange?.(undefined);
  }, [enableScrubbing, onScrubberPositionChange]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const target = event.currentTarget as SVGSVGElement;
      const rect = target.getBoundingClientRect();
      updatePosition(event.clientX - rect.left);
    },
    [updatePosition],
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!enableScrubbing || !event.touches.length) return;
      const touch = event.touches[0];
      const target = event.currentTarget as SVGSVGElement;
      const rect = target.getBoundingClientRect();
      updatePosition(touch.clientX - rect.left);
    },
    [enableScrubbing, updatePosition],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!event.touches.length) return;
      event.preventDefault();
      const touch = event.touches[0];
      const target = event.currentTarget as SVGSVGElement;
      const rect = target.getBoundingClientRect();
      updatePosition(touch.clientX - rect.left);
    },
    [updatePosition],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enableScrubbing) return;

      const maxIndex = dataLength - 1;
      const current = scrubberPosition ?? maxIndex;
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

      if (next !== scrubberPosition) {
        setScrubberPosition(next);
        onScrubberPositionChange?.(next);
      }
    },
    [enableScrubbing, dataLength, scrubberPosition, onScrubberPositionChange],
  );

  const handleBlur = useCallback(() => {
    if (!enableScrubbing || scrubberPosition === undefined) return;
    clearPosition();
  }, [enableScrubbing, scrubberPosition, clearPosition]);

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
      onScrubberPositionChange: setScrubberPosition,
    }),
    [enableScrubbing, scrubberPosition],
  );

  return (
    <ScrubberContextProvider value={contextValue}>
      {children}
    </ScrubberContextProvider>
  );
}
