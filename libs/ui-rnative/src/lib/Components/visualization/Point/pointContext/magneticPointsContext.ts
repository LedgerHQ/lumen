import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

/**
 * Stable registration API for magnetic points. Its identity never changes for
 * the provider's lifetime, so consumers (every `Point`) do not re-render when
 * the magnetic set changes — only when they mount/unmount.
 */
export type MagneticRegistryValue = {
  register: (dataIndex: number) => void;
  unregister: (dataIndex: number) => void;
};

/**
 * Mutable snapshot of the registered magnetic points. Changes on every
 * register/unregister (via `version`) and is consumed only by the scrubber,
 * which needs to recompute its snap targets when the set changes.
 */
export type MagneticSnapshotValue = {
  version: number;
  getMagneticPoints: () => ReadonlySet<number>;
};

const [MagneticRegistryProvider, _useMagneticRegistrySafeContext] =
  createSafeContext<MagneticRegistryValue>('MagneticRegistry');

const [MagneticSnapshotProvider, _useMagneticSnapshotSafeContext] =
  createSafeContext<MagneticSnapshotValue>('MagneticSnapshot');

export const useMagneticRegistry = (): MagneticRegistryValue =>
  _useMagneticRegistrySafeContext({
    consumerName: 'useMagneticRegistry',
    contextRequired: true,
  });

export const useMagneticSnapshot = (): MagneticSnapshotValue =>
  _useMagneticSnapshotSafeContext({
    consumerName: 'useMagneticSnapshot',
    contextRequired: true,
  });

export { MagneticRegistryProvider, MagneticSnapshotProvider };
