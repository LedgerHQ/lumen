import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverContextValue,
} from './types';

const [PopoverContextProvider, usePopoverContext] =
  createSafeContext<PopoverContextValue>('Popover');

const popoverContentVariants = cva(
  ['overflow-hidden rounded-md bg-canvas-sheet p-16 outline-none', 'shadow-xl'],
  {
    variants: {
      width: {
        hug: '',
        fixed: 'w-400',
      },
      side: {
        top: [
          'data-open:animate-slide-in-from-top',
          'data-closed:animate-slide-out-to-top',
        ],
        bottom: [
          'data-open:animate-slide-in-from-bottom',
          'data-closed:animate-slide-out-to-bottom',
        ],
        left: [
          'data-open:animate-slide-in-from-left',
          'data-closed:animate-slide-out-to-left',
        ],
        right: [
          'data-open:animate-slide-in-from-right',
          'data-closed:animate-slide-out-to-right',
        ],
      },
    },
    defaultVariants: {
      width: 'hug',
    },
  },
);

const overlayStyles = cn(
  'fixed inset-0 z-dialog-overlay bg-canvas-overlay-subtle',
  'data-open:animate-fade-in',
  'data-closed:animate-fade-out',
);

/**
 * The root component that manages the popover's open/closed state and
 * provides configuration to child components via context.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-popover-overview--docs Storybook}
 *
 * @example
 * import { Popover, PopoverTrigger, PopoverContent } from '@ledgerhq/lumen-ui-react';
 *
 * function MyComponent() {
 *   return (
 *     <Popover>
 *       <PopoverTrigger>
 *         <button>Open</button>
 *       </PopoverTrigger>
 *       <PopoverContent sideOffset={4} align="start">
 *         <p>Popover content</p>
 *       </PopoverContent>
 *     </Popover>
 *   );
 * }
 */
const Popover = <Payload,>({
  open,
  defaultOpen,
  onOpenChange,
  overlay = false,
  handle,
  children,
}: PopoverProps<Payload>) => {
  return (
    <PopoverContextProvider value={{ overlay }}>
      <PopoverPrimitive.Root
        data-slot='popover'
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={overlay}
        handle={handle}
      >
        {children}
      </PopoverPrimitive.Root>
    </PopoverContextProvider>
  );
};

/**
 * A button that opens the popover. Renders a `<button>` element by default.
 *
 * Use the `render` prop to compose with a custom component.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-popover-overview--docs Storybook}
 */
const PopoverTrigger = <Payload,>({
  handle,
  payload,
  render,
  className,
  ...props
}: PopoverTriggerProps<Payload>) => (
  <PopoverPrimitive.Trigger
    data-slot='popover-trigger'
    handle={handle}
    payload={payload}
    render={render}
    nativeButton={false}
    className={className}
    {...props}
  />
);
PopoverTrigger.displayName = 'PopoverTrigger';

/**
 * The content panel of the popover. Internally renders the Portal,
 * optional Backdrop, Positioner, and Popup.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-popover-overview--docs Storybook}
 */
const PopoverContent = ({
  side = 'bottom',
  sideOffset = 8,
  align = 'start',
  width = 'hug',
  className,
  children,
}: PopoverContentProps) => {
  const { overlay } = usePopoverContext({
    consumerName: 'PopoverContent',
    contextRequired: true,
  });

  return (
    <PopoverPrimitive.Portal>
      {overlay && (
        <PopoverPrimitive.Backdrop
          data-slot='popover-overlay'
          className={overlayStyles}
        />
      )}
      <PopoverPrimitive.Positioner
        data-slot='popover-positioner'
        className='z-menu'
        side={side}
        sideOffset={sideOffset}
        align={align}
      >
        <PopoverPrimitive.Popup
          data-slot='popover-content'
          className={cn(popoverContentVariants({ width, side }), className)}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
};

/**
 * Creates a handle for connecting a `Popover` with detached `PopoverTrigger` components.
 *
 * @example
 * const handle = createPopoverHandle<{ id: string }>();
 *
 * <PopoverTrigger handle={handle} payload={{ id: '123' }}>
 *   <button>Open from outside</button>
 * </PopoverTrigger>
 *
 * <Popover handle={handle}>
 *   {({ payload }) => (
 *     <PopoverContent>
 *       <p>Item: {payload?.id}</p>
 *     </PopoverContent>
 *   )}
 * </Popover>
 */
const createPopoverHandle = PopoverPrimitive.createHandle;

export { Popover, PopoverTrigger, PopoverContent, createPopoverHandle };
