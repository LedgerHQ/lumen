import { startTransition as reactStartTransition } from 'react';
import { RuntimeConstants } from '../constants';

export const startTransition = (callback: React.TransitionFunction): void => {
  if (RuntimeConstants.isBrowser) {
    // Proxy to react.startTransition
    reactStartTransition(callback);
  } else {
    // Pass-through function
    callback();
  }
};
