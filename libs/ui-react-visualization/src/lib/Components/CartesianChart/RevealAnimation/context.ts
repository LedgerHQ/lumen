import { createContext, useContext } from 'react';
import type { CSSProperties } from 'react';

import type { RevealAnimationContextValue } from './types';

export const RevealAnimationContext = createContext<
  RevealAnimationContextValue | undefined
>(undefined);

/**
 * Clip-path attribute for path-based consumers (e.g. `Line`).
 * Returns `undefined` when the reveal animation is disabled.
 */
export const usePathReveal = (): string | undefined => {
  return useContext(RevealAnimationContext)?.clipPathAttr;
};

/**
 * Opacity fade-in style for accessory consumers (e.g. `Point`). Returns
 * `undefined` when the reveal animation is disabled, leaving the consumer fully
 * visible.
 */
export const usePointReveal = (): CSSProperties | undefined => {
  return useContext(RevealAnimationContext)?.getPointRevealStyle();
};
