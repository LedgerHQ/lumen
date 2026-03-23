import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

export type ButtonLayout = { x: number; width: number };

export type SegmentedControlContextValue = {
  selectedValue: string;
  onSelectedChange: (value: string) => void;
  disabled: boolean;
  tabLayout: 'hug' | 'fixed';
  registerButtonLayout: (value: string, layout: ButtonLayout) => void;
};

const [SegmentedControlContextProvider, _useSegmentedControlSafeContext] =
  createSafeContext<SegmentedControlContextValue>('SegmentedControl');

export const useSegmentedControlContext = () =>
  _useSegmentedControlSafeContext({
    consumerName: 'SegmentedControlButton',
    contextRequired: true,
  });

export { SegmentedControlContextProvider };
