import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps, ReactNode } from 'react';

export type TooltipProps = {
  /**
   * The delay in milliseconds before the tooltip appears.
   * @default 200
   */
  delayDuration?: number;
} & ComponentProps<typeof TooltipPrimitive.Root>;

export type TooltipTriggerProps = {
  /**
   * The element that will trigger the tooltip (e.g., button, icon, text).
   */
  children?: ReactNode;
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   */
  className?: string;
} & ComponentProps<typeof TooltipPrimitive.Trigger>;

export type TooltipContentProps = {
  /**
   * The content to display inside the tooltip.
   */
  children?: ReactNode;
  /**
   * The side of the trigger element to position the tooltip on.
   * @default top
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * The distance in pixels between the tooltip and the trigger element.
   * @default 0
   */
  sideOffset?: number;
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   */
  className?: string;
} & ComponentProps<typeof TooltipPrimitive.Content>;
