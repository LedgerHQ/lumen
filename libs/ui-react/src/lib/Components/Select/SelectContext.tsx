import { createContext, useContext } from 'react';

type SelectContextValue = {
  selectedValue: string;
};

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

export const useSelectContext = (): SelectContextValue => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error(
      'useSelectContext must be used within a <Select> component',
    );
  }
  return context;
};

export const SelectProvider = SelectContext.Provider;
