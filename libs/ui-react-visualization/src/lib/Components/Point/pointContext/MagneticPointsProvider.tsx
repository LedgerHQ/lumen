import { useCallback, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';

import {
  MagneticPointsContextProvider,
  type MagneticPointsContextValue,
} from './magneticPointsContext';

type MagneticPointsProviderProps = {
  children: ReactNode;
};

export function MagneticPointsProvider({
  children,
}: Readonly<MagneticPointsProviderProps>) {
  const pointsRef = useRef(new Set<number>());

  const register = useCallback((dataIndex: number): void => {
    pointsRef.current.add(dataIndex);
  }, []);

  const unregister = useCallback((dataIndex: number): void => {
    pointsRef.current.delete(dataIndex);
  }, []);

  const getMagneticPoints = useCallback((): ReadonlySet<number> => {
    return pointsRef.current;
  }, []);

  const value: MagneticPointsContextValue = useMemo(
    () => ({ register, unregister, getMagneticPoints }),
    [register, unregister, getMagneticPoints],
  );

  return (
    <MagneticPointsContextProvider value={value}>
      {children}
    </MagneticPointsContextProvider>
  );
}
