import { useState, useEffect, useCallback, useId } from 'react';
import { Pressable } from 'react-native';
import { useControllableState } from '../../utils';
import { SlotPressable } from '../Slot';
import { useTooltipActions } from './GlobalTooltipContext';
import {
  TooltipContentData,
  TooltipContextProvider,
  useTooltipSafeContext,
} from './TooltipContext';
import type {
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
} from './types';

/**
 * The root component that manages a specific tooltip's state.
 *
 * This component coordinates between the trigger and content components.
 * It works with GlobalTooltipProvider to ensure only one tooltip can be shown at a time.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-tooltip-overview--docs Storybook}
 *
 * @example
 * import { GlobalTooltipProvider, Tooltip, TooltipTrigger, TooltipContent, GlobalTooltipBottomSheet } from '@ledgerhq/lumen-ui-rnative';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <Tooltip>
 *         <TooltipTrigger>
 *           <Button>Press me</Button>
 *         </TooltipTrigger>
 *         <TooltipContent title="Help" content={<Text>This is a tooltip!</Text>} />
 *       </Tooltip>
 *       <GlobalTooltipBottomSheet />
 *     </ThemeProvider>
 *   );
 * }
 */
export const Tooltip = ({ children, onOpenChange }: TooltipProps) => {
  const tooltipId = useId();
  const [internalOpen, setInternalOpen] = useControllableState({
    defaultProp: false,
    onChange: onOpenChange,
  });
  const [contentData, setContentData] = useState<TooltipContentData | null>(
    null,
  );

  const setOpen = useCallback(
    (newOpen: boolean) => {
      setInternalOpen?.(newOpen);
    },
    [setInternalOpen],
  );

  return (
    <TooltipContextProvider
      tooltipId={tooltipId}
      open={internalOpen}
      setOpen={setOpen}
      contentData={contentData}
      setContentData={setContentData}
    >
      {children}
    </TooltipContextProvider>
  );
};
Tooltip.displayName = 'Tooltip';

/**
 * The trigger element that opens the tooltip when pressed.
 *
 * @example
 * <TooltipTrigger asChild>
 *   <Button>Help</Button>
 * </TooltipTrigger>
 */
export const TooltipTrigger = ({
  children,
  asChild = false,
  style,
  ...props
}: TooltipTriggerProps) => {
  const { tooltipId, setOpen, contentData } = useTooltipSafeContext({
    consumerName: 'TooltipTrigger',
    contextRequired: true,
  });
  /**
   * Use the optimized hook that doesn't subscribe to currentTooltip state
   * This prevents re-renders when other tooltips open/close
   */
  const { showTooltip } = useTooltipActions();

  const handlePress = (): void => {
    if (contentData) {
      setOpen(true);
      showTooltip({
        id: tooltipId,
        content: contentData.content,
        title: contentData.title,
        setOpen,
      });
    }
  };

  const Comp = asChild ? SlotPressable : Pressable;

  return (
    <Comp {...props} style={style} onPress={handlePress}>
      {children}
    </Comp>
  );
};
TooltipTrigger.displayName = 'TooltipTrigger';

export const TooltipContent = ({ title, content }: TooltipContentProps) => {
  const { setContentData } = useTooltipSafeContext({
    consumerName: 'TooltipContent',
    contextRequired: true,
  });

  useEffect(() => {
    setContentData({ title, content });
    return () => {
      setContentData(null);
    };
  }, [title, content, setContentData]);

  return null;
};
TooltipContent.displayName = 'TooltipContent';
