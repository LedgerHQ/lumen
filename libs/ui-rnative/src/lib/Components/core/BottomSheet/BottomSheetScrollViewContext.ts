import { createContext, useContext } from 'react';

// Lives in its own module so BottomSheetHeader can read it without importing Scrollables (which imports the header).
export const BottomSheetScrollViewContext = createContext(false);

export const useIsInsideScrollView = (): boolean =>
  useContext(BottomSheetScrollViewContext);
