import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

type SelectContextValue = {
  selectedValue: string | null;
  registerSearch: () => () => void;
  isGrouped: boolean;
};

export const [SelectProvider, useSelectContext] =
  createSafeContext<SelectContextValue>('Select');
