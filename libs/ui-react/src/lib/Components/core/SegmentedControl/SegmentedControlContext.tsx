import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import type { SegmentedControlProps } from './types';

export type SegmentedControlContextValue = {
  selectedValue: string;
  onSelectedChange: (value: string) => void;
  disabled: boolean;
  tabLayout: SegmentedControlProps['tabLayout'];
};

const [SegmentedControlContextProvider, _useSegmentedControlSafeContext] =
  createSafeContext<SegmentedControlContextValue>('SegmentedControl');

export const useSegmentedControlContext = () =>
  _useSegmentedControlSafeContext({
    consumerName: 'SegmentedControlButton',
    contextRequired: true,
  });

export { SegmentedControlContextProvider };
