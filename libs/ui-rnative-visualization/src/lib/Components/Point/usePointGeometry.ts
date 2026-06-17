import { useEffect, useMemo } from 'react';
import type { useAnimatedProps } from 'react-native-reanimated';

import { projectPoint } from '../../utils/scales/scales';
import type { DrawingArea } from '../../utils/types';
import type { BaseAxisProps } from '../Axis';
import { useCartesianChartContext } from '../CartesianChart/context';
import { useRevealFadeProps } from '../CartesianChart/RevealAnimation';
import { useMagneticPointsContext } from './pointContext';
import type { MagneticPointsContextValue } from './pointContext/magneticPointsContext';
import { isWithinBounds, resolveDataXToIndex } from './utils';

type Pixel = { x: number; y: number };

type UsePointGeometryParams = {
  dataX: number;
  dataY: number;
  magnetic: boolean;
};

type PointGeometry = {
  pixel: Pixel | undefined;
  drawingArea: DrawingArea;
  fadeProps: ReturnType<typeof useAnimatedProps>;
  isVisible: boolean;
};

/**
 * Resolves a point's chart geometry and behaviour: projects its data
 * coordinates to pixels, registers it as a magnetic snap target when enabled,
 * exposes the reveal-animation props, and reports whether it falls inside the
 * drawing area.
 */
export const usePointGeometry = ({
  dataX,
  dataY,
  magnetic,
}: UsePointGeometryParams): PointGeometry => {
  const { getXScale, getYScale, getXAxisConfig, drawingArea } =
    useCartesianChartContext();
  const magneticContext = useMagneticPointsContext();

  useMagneticRegistration(magnetic, dataX, getXAxisConfig, magneticContext);

  const xScale = getXScale();
  const yScale = getYScale();

  const pixel = useMemo(() => {
    if (!xScale || !yScale) return undefined;
    return projectPoint(dataX, dataY, xScale, yScale);
  }, [dataX, dataY, xScale, yScale]);

  const fadeProps = useRevealFadeProps();

  const isVisible =
    pixel !== undefined && isWithinBounds(pixel.x, pixel.y, drawingArea);

  return { pixel, drawingArea, fadeProps, isVisible };
};

/**
 * Registers/unregisters a data index as a magnetic snap target
 * when the Point has `magnetic` enabled.
 */
export const useMagneticRegistration = (
  magnetic: boolean,
  dataX: number,
  getXAxisConfig: () => BaseAxisProps | undefined,
  { register, unregister }: MagneticPointsContextValue,
): void => {
  useEffect(() => {
    if (!magnetic) return;
    const index = resolveDataXToIndex(dataX, getXAxisConfig());
    if (index === undefined) return;
    register(index);
    return () => unregister(index);
  }, [magnetic, dataX, getXAxisConfig, register, unregister]);
};
