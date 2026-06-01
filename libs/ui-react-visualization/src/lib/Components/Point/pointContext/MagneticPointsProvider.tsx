import { useCallback, useMemo, useRef, useState } from 'react';
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
  const [version, setVersion] = useState(0);

  const register = useCallback((dataIndex: number): void => {
    if (pointsRef.current.has(dataIndex)) return;
    pointsRef.current.add(dataIndex);
    setVersion((v) => v + 1);
  }, []);

  const unregister = useCallback((dataIndex: number): void => {
    if (!pointsRef.current.has(dataIndex)) return;
    pointsRef.current.delete(dataIndex);
    setVersion((v) => v + 1);
  }, []);

  const getMagneticPoints = useCallback((): ReadonlySet<number> => {
    return pointsRef.current;
  }, []);

  const value: MagneticPointsContextValue = useMemo(
    () => ({ register, unregister, getMagneticPoints, version }),
    [register, unregister, getMagneticPoints, version],
  );

  return (
    <MagneticPointsContextProvider value={value}>
      {children}
    </MagneticPointsContextProvider>
  );
}
