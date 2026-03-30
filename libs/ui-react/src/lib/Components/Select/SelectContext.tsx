import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

type SelectContextValue = {
  selectedValue: string | null;
  registerSearch: () => () => void;
};

export const [SelectProvider, useSelectContext] =
  createSafeContext<SelectContextValue>('Select');
