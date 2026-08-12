import type { ReactNode } from 'react';
import type { PressableProps } from 'react-native';

export type TooltipProps = {
  /**
   * The children components (TooltipTrigger and TooltipContent).
   */
  children: ReactNode;
  /**
   * Callback when open state changes.
   */
  onOpenChange?: (open: boolean) => void;
};

export type TooltipTriggerProps = {
  /**
   * The element that will trigger the tooltip (e.g., button, icon, text).
   */
  children: ReactNode;
  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & Omit<PressableProps, 'children'>;

export type TooltipContentProps = {
  /**
   * The title of the tooltip (optional).
   */
  title?: string;
  /**
   * The content to display inside the tooltip.
   */
  content: ReactNode;
};
