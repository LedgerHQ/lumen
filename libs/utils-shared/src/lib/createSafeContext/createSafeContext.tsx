import { createContext, FC, ReactNode, useContext, useMemo } from 'react';

export function createSafeContext<ContextValue extends object>(
  rootComponentName: string,
  defaultContext?: ContextValue,
) {
  const Context = createContext<ContextValue | undefined>(defaultContext);

  const Provider: FC<{
    children: ReactNode;
    value: ContextValue;
  }> = ({ children, value: context }) => {
    // Only re-memoize when prop values change
    const memoValue = useMemo(
      () => context,
      Object.values(context ?? {}),
    ) as ContextValue;

    return <Context value={memoValue}>{children}</Context>;
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

    return (defaultContext || {}) as ContextValue;
  }

  return [Provider, useSafeContext] as const;
}
