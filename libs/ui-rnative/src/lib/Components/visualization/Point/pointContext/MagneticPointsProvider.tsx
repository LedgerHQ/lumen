import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import {
  MagneticRegistryProvider,
  MagneticSnapshotProvider,
  type MagneticRegistryValue,
  type MagneticSnapshotValue,
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

  const registry: MagneticRegistryValue = useMemo(
    () => ({ register, unregister }),
    [register, unregister],
  );

  const snapshot: MagneticSnapshotValue = useMemo(
    () => ({ version, getMagneticPoints }),
    [version, getMagneticPoints],
  );

  return (
    <MagneticRegistryProvider value={registry}>
      <MagneticSnapshotProvider value={snapshot}>
        {children}
      </MagneticSnapshotProvider>
    </MagneticRegistryProvider>
  );
}
