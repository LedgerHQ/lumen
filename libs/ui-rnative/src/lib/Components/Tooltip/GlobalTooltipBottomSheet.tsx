import React, { useCallback, useEffect } from 'react';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetView,
  useBottomSheetRef,
} from '../BottomSheet';
import { useGlobalTooltipSafeContext } from './GlobalTooltipContext';

/**
 * BottomSheet component that displays tooltip content.
 * This should be placed at the root level inside GestureHandlerRootView.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-tooltip-overview--docs Storybook}
 *
 * @example
 * import { GlobalTooltipProvider, GlobalTooltipBottomSheet } from '@ledgerhq/lumen-ui-rnative';
 *
 * function App() {
 *   return (
 *     <GestureHandlerRootView>
 *       <YourAppContent />
 *       <GlobalTooltipBottomSheet />
 *     </GestureHandlerRootView>
 *   );
 * }
 */
export const GlobalTooltipBottomSheet: React.FC = () => {
  const bottomSheetRef = useBottomSheetRef();
  /**
   * This is the only component that subscribes to currentTooltip
   * All other components use refs to avoid re-renders
   */
  const { currentTooltip, hideTooltipRef } = useGlobalTooltipSafeContext({
    consumerName: 'useGlobalTooltipBottomSheetContext',
    contextRequired: true,
  });

  useEffect(() => {
    if (currentTooltip) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [currentTooltip, bottomSheetRef]);

  const handleClose = useCallback(() => {
    currentTooltip?.setOpen?.(false);
    hideTooltipRef.current();
  }, [hideTooltipRef, currentTooltip?.setOpen]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={null}
      backdropPressBehavior='close'
      onClose={handleClose}
      maxDynamicContentSize='fullWithOffset'
      enableDynamicSizing
      enablePanDownToClose
    >
      <BottomSheetView>
        {(currentTooltip?.title || currentTooltip?.content) && (
          <BottomSheetHeader
            title={currentTooltip.title}
            appearance='expanded'
            description={currentTooltip.content}
          />
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};
