import { PrimitiveShadowTokens } from '../types';
import { primitiveColorTokens } from './primitive.colors';

const defaultColor = primitiveColorTokens.dark.grey['050-10'];
const darkerColor = primitiveColorTokens.dark.grey['050-20'];

export const primitiveShadowTokens = {
  sm: [
    {
      offsetX: 0,
      offsetY: 1,
      blurRadius: 2,
      spreadDistance: -1,
      color: defaultColor,
    },
    {
      offsetX: 0,
      offsetY: 1,
      blurRadius: 3,
      spreadDistance: 0,
      color: defaultColor,
    },
  ],
  md: [
    {
      offsetX: 0,
      offsetY: 2,
      blurRadius: 4,
      spreadDistance: -2,
      color: defaultColor,
    },
    {
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadDistance: -1,
      color: defaultColor,
    },
  ],
  lg: [
    {
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadDistance: -4,
      color: defaultColor,
    },
    {
      offsetX: 0,
      offsetY: 10,
      blurRadius: 15,
      spreadDistance: -3,
      color: defaultColor,
    },
  ],
  xl: [
    {
      offsetX: 0,
      offsetY: 8,
      blurRadius: 10,
      spreadDistance: -6,
      color: defaultColor,
    },
    {
      offsetX: 0,
      offsetY: 20,
      blurRadius: 25,
      spreadDistance: -5,
      color: defaultColor,
    },
  ],
  '2xl': [
    {
      offsetX: 0,
      offsetY: 25,
      blurRadius: 50,
      spreadDistance: -12,
      color: darkerColor,
    },
  ],
} as const satisfies PrimitiveShadowTokens;
