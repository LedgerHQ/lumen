import type { ReactNode } from 'react';

const isStringOrNumber = (element: ReactNode) =>
  typeof element === 'string' || typeof element === 'number';

export const isTextChildren = (element: ReactNode) => {
  const isArray = Array.isArray(element);
  return isArray ? element.every(isStringOrNumber) : isStringOrNumber(element);
};
