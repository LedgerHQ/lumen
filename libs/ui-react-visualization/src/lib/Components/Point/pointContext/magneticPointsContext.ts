import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

export type MagneticPointsContextValue = {
  register: (dataIndex: number) => void;
  unregister: (dataIndex: number) => void;
  version: number;
  getMagneticPoints: () => ReadonlySet<number>;
};

const [MagneticPointsContextProvider, _useMagneticPointsSafeContext] =
  createSafeContext<MagneticPointsContextValue>('MagneticPoints');

export const useMagneticPointsContext = (): MagneticPointsContextValue =>
  _useMagneticPointsSafeContext({
    consumerName: 'useMagneticPointsContext',
    contextRequired: true,
  });

export { MagneticPointsContextProvider };
