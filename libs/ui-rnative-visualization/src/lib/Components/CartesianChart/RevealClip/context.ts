import { createContext, useContext } from 'react';

type RevealClipContextValue = {
  clipPathAttr: string;
};

export const RevealClipContext = createContext<
  RevealClipContextValue | undefined
>(undefined);

export const useRevealClip = (): string | undefined => {
  return useContext(RevealClipContext)?.clipPathAttr;
};
