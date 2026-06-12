import { createContext, useContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { useAnimatedProps } from 'react-native-reanimated';

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
 * Raw shared opacity value for the point/accessory fade. Returns `undefined`
 * when the reveal animation is disabled. Prefer {@link useRevealFadeProps} in
 * components; this is the low-level primitive for custom needs.
 */
export const usePointReveal = (): SharedValue<number> | undefined => {
  return useContext(RevealAnimationContext)?.pointOpacity;
};

/**
 * Ready-to-use animated props for accessory components (e.g. `Point`) that
 * fade in with the reveal instead of being clipped. Spread directly onto any
 * animated SVG element via `animatedProps`
 */
export const useRevealFadeProps = (): ReturnType<typeof useAnimatedProps> => {
  const pointOpacity = usePointReveal();
  return useAnimatedProps(
    () => ({ opacity: pointOpacity?.value ?? 1 }),
    [pointOpacity],
  );
};
