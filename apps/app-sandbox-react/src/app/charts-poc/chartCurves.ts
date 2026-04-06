import {
  curveLinear,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from '@visx/curve';
import {
  curveLinear as d3CurveLinear,
  curveNatural as d3CurveNatural,
  curveStep as d3CurveStep,
  curveStepAfter as d3CurveStepAfter,
  curveStepBefore as d3CurveStepBefore,
  type CurveFactory,
} from 'd3-shape';
import type { LineCurve } from './types';

export function getVisxCurve(curve?: LineCurve): CurveFactory {
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
}

export function getD3Curve(curve?: LineCurve): CurveFactory {
  switch (curve) {
    case 'linear':
      return d3CurveLinear;
    case 'step':
      return d3CurveStep;
    case 'stepAfter':
      return d3CurveStepAfter;
    case 'stepBefore':
      return d3CurveStepBefore;
    case 'natural':
    default:
      return d3CurveNatural;
  }
}

/** Recharts `<Line type=… />` / `<Area type=… />` */
export function getRechartsLineType(
  curve?: LineCurve,
): 'linear' | 'natural' | 'step' | 'stepBefore' | 'stepAfter' {
  switch (curve) {
    case 'linear':
      return 'linear';
    case 'step':
      return 'step';
    case 'stepAfter':
      return 'stepAfter';
    case 'stepBefore':
      return 'stepBefore';
    case 'natural':
    default:
      return 'natural';
  }
}

/** Victory `interpolation` prop */
export function getVictoryInterpolation(
  curve?: LineCurve,
): 'linear' | 'natural' | 'step' | 'stepAfter' | 'stepBefore' {
  switch (curve) {
    case 'linear':
      return 'linear';
    case 'step':
      return 'step';
    case 'stepAfter':
      return 'stepAfter';
    case 'stepBefore':
      return 'stepBefore';
    case 'natural':
    default:
      return 'natural';
  }
}
