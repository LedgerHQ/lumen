import { createContext, useContext } from 'react';

type RevealClipContextValue = {
  /**
   * The `url(#...)` reference to apply via `clipPath` on the opt-in SVG
   * elements (e.g. line path, points). `undefined` means no clip should be
   * applied — used when animation is disabled or before mount.
   */
  clipPathAttr: string | undefined;
};

export const RevealClipContext = createContext<
  RevealClipContextValue | undefined
>(undefined);

export const useRevealClip = (): string | undefined => {
  return useContext(RevealClipContext)?.clipPathAttr;
};
