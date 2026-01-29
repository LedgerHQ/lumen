import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from 'react';

export type TooltipData = {
  id: string;
  title?: string;
  content: ReactNode;
  setOpen?: (open: boolean) => void;
};

type GlobalTooltipBottomSheetContextValue = {
  currentTooltip: TooltipData | null;
  showTooltipRef: React.MutableRefObject<(data: TooltipData) => void>;
  hideTooltipRef: React.MutableRefObject<() => void>;
};

const [GlobalTooltipContextProvider, _useGlobalTooltipSafeContext] =
  createSafeContext<GlobalTooltipBottomSheetContextValue>(
    'GlobalTooltipContext',
  );

export const useGlobalTooltipSafeContext = _useGlobalTooltipSafeContext;

/**
 * Hook that provides tooltip actions without subscribing to state changes.
 * This prevents unnecessary re-renders when tooltips open/close.
 *
 * Use this hook in components that only need to show/hide tooltips
 * but don't need to know which tooltip is currently active.
 */
export const useTooltipActions = (): {
  showTooltip: (data: TooltipData) => void;
  hideTooltip: () => void;
} => {
  const context = useGlobalTooltipSafeContext({
    consumerName: 'useTooltipActions',
    contextRequired: true,
  });

  // Return stable functions from refs - won't cause re-renders
  return useMemo(
    () => ({
      showTooltip: context.showTooltipRef.current,
      hideTooltip: context.hideTooltipRef.current,
    }),
    // These refs never change, so this memo never invalidates
    [context.showTooltipRef, context.hideTooltipRef],
  );
};

type GlobalTooltipProviderProps = {
  children: ReactNode;
};

/**
 * Global provider for the tooltips bottom sheet system.
 * This should wrap your app at the root level and include GlobalTooltipBottomSheet.
 *
 * @example
 * import { GlobalTooltipProvider, GlobalTooltipBottomSheet } from '@ledgerhq/lumen-ui-rnative';
 *
 * function App() {
 *   return (
 *     <GlobalTooltipProvider>
 *       <YourAppContent />
 *       <GlobalTooltipBottomSheet />
 *     </GlobalTooltipProvider>
 *   );
 * }
 */
export const GlobalTooltipProvider = ({
  children,
}: GlobalTooltipProviderProps) => {
  const [currentTooltip, setCurrentTooltip] = useState<TooltipData | null>(
    null,
  );

  /**
   * Store callbacks in refs so they have stable references
   * Components that use these refs won't re-render when currentTooltip changes
   */
  const showTooltipRef = useRef<(data: TooltipData) => void>(() => {
    return;
  });
  const hideTooltipRef = useRef<() => void>(() => {
    return;
  });

  /**
   * Update the ref implementations when needed
   * These closures capture the current setCurrentTooltip
   */
  showTooltipRef.current = useCallback((data: TooltipData) => {
    setCurrentTooltip(data);
  }, []);

  hideTooltipRef.current = useCallback(() => {
    setCurrentTooltip(null);
  }, []);

  /**
   * Memoize the context value - only currentTooltip changes cause re-renders
   * The refs themselves never change
   */
  const contextValue = useMemo(
    () => ({
      currentTooltip,
      showTooltipRef,
      hideTooltipRef,
    }),
    [currentTooltip],
  );

  return (
    <GlobalTooltipContextProvider value={contextValue}>
      {children}
    </GlobalTooltipContextProvider>
  );
};
