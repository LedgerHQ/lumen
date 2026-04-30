import type { FC, ReactNode } from 'react';
import { createContext, useContext, useRef } from 'react';
import { shallowEqual } from '../shallowEqual';

export function createSafeContext<ContextValue extends object>(
  rootComponentName: string,
  defaultContext?: ContextValue,
) {
  const Context = createContext<ContextValue | undefined>(defaultContext);

  const Provider: FC<{
    children: ReactNode;
    value: ContextValue;
  }> = ({ children, value }) => {
    const ref = useRef(value);

    if (!shallowEqual(ref.current, value)) {
      ref.current = value;
    }

    return <Context.Provider value={ref.current}>{children}</Context.Provider>;
  };

  Provider.displayName = rootComponentName + 'Provider';

  function useSafeContext<ContextRequired extends boolean = boolean>({
    consumerName,
    contextRequired,
  }: {
    consumerName: string;
    contextRequired: ContextRequired;
  }): ContextRequired extends true ? ContextValue : Partial<ContextValue> {
    const context = useContext(Context);

    if (context) {
      return context;
    }
    if (contextRequired) {
      throw new Error(
        `${consumerName} must be used within ${rootComponentName}`,
      );
    }

    return (defaultContext ?? {}) as ContextValue;
  }

  return [Provider, useSafeContext] as const;
}
