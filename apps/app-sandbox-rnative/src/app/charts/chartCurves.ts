import {
  curveLinear,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  type CurveFactory,
} from 'd3-shape';
import type { LineCurve } from './types';

export const getD3Curve = (curve?: LineCurve): CurveFactory => {
  switch (curve) {
    case 'linear':
      return curveLinear;
    case 'step':
      return curveStep;
    case 'stepAfter':
      return curveStepAfter;
    case 'stepBefore':
      return curveStepBefore;
    case 'natural':
    default:
      return curveNatural;
  }
};
