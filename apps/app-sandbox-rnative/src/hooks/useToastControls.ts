import type { ToastPosition } from '@ledgerhq/lumen-ui-rnative';
import { createContext, useContext } from 'react';

type ToastControls = {
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
};

const ToastControlsContext = createContext<ToastControls | null>(null);

export const ToastControlsProvider = ToastControlsContext.Provider;

export const useToastControls = () => {
  const context = useContext(ToastControlsContext);

  if (!context) {
    throw new Error(
      'useToastControls must be used within a ToastControlsProvider',
    );
  }

  return context;
};
