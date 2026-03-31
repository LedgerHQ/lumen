import { PrimitiveMotionTokens } from '../types';

export const primitiveMotionTokens = {
  durations: {
    75: 75,
    100: 100,
    150: 150,
    200: 200,
    300: 300,
    500: 500,
    700: 700,
    1000: 1000,
    2000: 2000,
  },
  delays: {
    75: 75,
    100: 100,
    150: 150,
    200: 200,
    300: 300,
    500: 500,
    1000: 1000,
    2000: 2000,
  },
  easings: {
    linear: [0, 0, 1, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
  },
} satisfies PrimitiveMotionTokens;
