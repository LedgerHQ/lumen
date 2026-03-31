import { cn } from '@ledgerhq/lumen-utils-shared';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva } from 'class-variance-authority';
import { ComponentProps } from 'react';
import {
  TooltipContentProps,
  TooltipProps,
  TooltipTriggerProps,
} from './types';

const tooltipContentVariants = cva(
  'z-tooltip w-fit rounded-xs bg-interactive px-8 py-4 body-3 text-on-interactive select-none',
  {
    variants: {
      side: {
        top: 'animate-slide-in-from-top data-[state=closed]:animate-slide-out-to-top',
        bottom:
          'animate-slide-in-from-bottom data-[state=closed]:animate-slide-out-to-bottom',
        left: 'animate-slide-in-from-left data-[state=closed]:animate-slide-out-to-left',
        right:
          'animate-slide-in-from-right data-[state=closed]:animate-slide-out-to-right',
      },
    },
    defaultVariants: {
      side: 'top',
    },
  },
);

/**
 * Provides context for all tooltip components within the application.
 *
 * This component should be placed at the root of your application or a high-level component
 * to enable tooltip functionality throughout the component tree. It manages global tooltip
 * state and configuration.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-tooltip-overview--docs Storybook}
 *
 * @example
 * import { TooltipProvider } from '@ledgerhq/lumen-ui-react';
 *
 * function App() {
 *   return (
 *     <TooltipProvider delayDuration={300}>
 *       <MyAppComponents />
 *     </TooltipProvider>
 *   );
 * }
 */
export const TooltipProvider = ({
  /**
   * The delay in milliseconds before the tooltip appears.
   * @default 200
   */
  delayDuration = 200,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) => {
  return (
    <TooltipPrimitive.Provider
      data-slot='tooltip-provider'
      delayDuration={delayDuration}
      {...props}
    />
  );
};

/**
 * The root component that manages the tooltip's open/closed state and contains the trigger and content.
 *
 * This component wraps the Radix UI Tooltip Root and automatically includes a TooltipProvider
 * if one is not already present in the component tree. It manages the tooltip's visibility
 * state and coordinates between the trigger and content components.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-tooltip-overview--docs Storybook}
 *
 * @example
 * import { Tooltip, TooltipTrigger, TooltipContent } from '@ledgerhq/lumen-ui-react';
 *
 * function MyComponent() {
 *   return (
 *     <Tooltip>
 *       <TooltipTrigger>
 *         <button>Hover me</button>
 *       </TooltipTrigger>
 *       <TooltipContent>
 *         <p>This is a tooltip!</p>
 *       </TooltipContent>
 *     </Tooltip>
 *   );
 * }
 */
export const Tooltip = ({ delayDuration = 200, ...props }: TooltipProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipPrimitive.Root data-slot='tooltip' {...props} />
    </TooltipProvider>
  );
};

/**
 * The element that triggers the tooltip to appear when interacted with.
 *
 * This component wraps any interactive element (button, link, icon, etc.) and makes it
 * the trigger for the tooltip. When users hover over or focus on this element, the
 * associated tooltip content will be displayed.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-tooltip-overview--docs Storybook}
 *
 * @example
 * import { TooltipTrigger } from '@ledgerhq/lumen-ui-react';
 *
 * <TooltipTrigger>
 *   <button>Hover me for a tooltip</button>
 * </TooltipTrigger>
 *
 * // Works with any interactive element
 * <TooltipTrigger>
 *   <InteractiveIcon icon={InfoIcon} size="sm" />
 * </TooltipTrigger>
 */
export const TooltipTrigger = ({ ...props }: TooltipTriggerProps) => {
  return <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />;
};

/**
 * The content container that displays the tooltip information.
 *
 * This component renders the actual tooltip content with custom styling and includes
 * an arrow pointer that points to the trigger element. The content is automatically
 * positioned relative to the trigger and handles collision detection to stay within
 * the viewport boundaries.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-tooltip-overview--docs Storybook}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the tooltip's core appearance (colors, padding, etc).
 *
 * @example
 * import { TooltipContent } from '@ledgerhq/lumen-ui-react';
 *
 * <TooltipContent sideOffset={8}>
 *   <p className="text-accent">This tooltip provides helpful information</p>
 * </TooltipContent>
 *
 * // With custom styling for layout
 * <TooltipContent sideOffset={12} className="max-w-xs">
 *   <div className="space-y-2">
 *     <h4 className="heading-2">Tip Title</h4>
 *     <p>Detailed explanation of the feature.</p>
 *   </div>
 * </TooltipContent>
 */
export const TooltipContent = ({
  className,
  sideOffset = 0,
  side,
  children,
  ...props
}: TooltipContentProps) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot='tooltip-content'
        side={side}
        sideOffset={sideOffset}
        className={cn(tooltipContentVariants({ side }), className)}
        {...props}
      >
        <TooltipPrimitive.Arrow className='size-10 translate-y-[calc(-50%-1px)] rotate-45 rounded-[1px] bg-interactive fill-interactive' />
        <div className='relative'>{children}</div>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};
