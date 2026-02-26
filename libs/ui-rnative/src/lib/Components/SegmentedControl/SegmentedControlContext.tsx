import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

export type SegmentedControlContextValue = {
  selectedValue: string;
  onSelectedChange: (value: string) => void;
};

const [SegmentedControlContextProvider, _useSegmentedControlSafeContext] =
  createSafeContext<SegmentedControlContextValue>('SegmentedControl');

export const useSegmentedControlContext = () =>
  _useSegmentedControlSafeContext({
    consumerName: 'SegmentedControlButton',
    contextRequired: true,
  });

export { SegmentedControlContextProvider };
