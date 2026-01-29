import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import React, { useState, useRef, useMemo, ReactNode } from 'react';
import { SelectData } from './types';

type GlobalSelectBottomSheetContextValue = {
  currentSelect: SelectData | null;
  showSelectRef: React.MutableRefObject<(data: SelectData) => void>;
  hideSelectRef: React.MutableRefObject<() => void>;
};

const [GlobalSelectContextProvider, _useGlobalSelectSafeContext] =
  createSafeContext<GlobalSelectBottomSheetContextValue>('GlobalSelectContext');

export const useGlobalSelectSafeContext = _useGlobalSelectSafeContext;

/**
 * Hook that provides select actions without subscribing to state changes.
 * This prevents unnecessary re-renders when selects open/close.
 *
 * Use this hook in components that only need to show/hide selects
 * but don't need to know which select is currently active.
 */
export const useSelectActions = (): {
  showSelect: (data: SelectData) => void;
  hideSelect: () => void;
} => {
  const context = useGlobalSelectSafeContext({
    consumerName: 'useSelectActions',
    contextRequired: true,
  });

  return useMemo(
    () => ({
      showSelect: context.showSelectRef.current,
      hideSelect: context.hideSelectRef.current,
    }),
    [context.showSelectRef, context.hideSelectRef],
  );
};

type GlobalSelectProviderProps = {
  children: ReactNode;
};

/**
 * Global provider for the select bottom sheet system.
 * This should wrap your app at the root level and include GlobalSelectBottomSheet.
 *
 * @example
 * import { GlobalSelectProvider, GlobalSelectBottomSheet } from '@ledgerhq/lumen-ui-rnative';
 *
 * function App() {
 *   return (
 *     <GlobalSelectProvider>
 *       <YourAppContent />
 *       <GlobalSelectBottomSheet />
 *     </GlobalSelectProvider>
 *   );
 * }
 */
export const GlobalSelectProvider = ({
  children,
}: GlobalSelectProviderProps) => {
  const [currentSelect, setCurrentSelect] = useState<SelectData | null>(null);
  const showSelectRef = useRef<(data: SelectData) => void>(() => {
    return;
  });
  const hideSelectRef = useRef<() => void>(() => {
    return;
  });

  /**
   * Update the ref implementations when needed
   * These closures capture the current setCurrentSelect
   */
  showSelectRef.current = (data: SelectData) => {
    setCurrentSelect(data);
  };

  hideSelectRef.current = () => {
    setCurrentSelect(null);
  };

  /**
   * Memoize the context value - only currentSelect changes cause re-renders
   * The refs themselves never change
   */
  const contextValue = useMemo(
    () => ({
      currentSelect,
      showSelectRef,
      hideSelectRef,
    }),
    [currentSelect],
  );

  return (
    <GlobalSelectContextProvider value={contextValue}>
      {children}
    </GlobalSelectContextProvider>
  );
};
