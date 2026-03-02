import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

type SelectContextValue = {
  selectedValue: string;
};

export const [SelectProvider, useSelectContext] =
  createSafeContext<SelectContextValue>('Select');
