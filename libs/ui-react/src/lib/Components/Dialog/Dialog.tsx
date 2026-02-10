import { cn, createSafeContext } from '@ledgerhq/lumen-utils-shared';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import * as React from 'react';
import { DialogHeader } from './DialogHeader/DialogHeader';
import {
  DialogBodyProps,
  DialogContentProps,
  DialogFooterProps,
  DialogHeight,
  DialogOverlayProps,
  DialogProps,
  DialogTriggerProps,
} from './types';

const [DialogContextProvider, useDialogContext] = createSafeContext<{
  height: DialogHeight;
}>('Dialog');

const dialogContentVariants = cva(
  [
    'flex w-400 max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl bg-canvas-sheet pb-24',
    'fixed top-[50%] left-[50%] z-dialog-content translate-[-50%]',
    'data-[state=closed]:animate-content-hide data-[state=open]:animate-content-show',
  ],
  {
    variants: {
      height: {
        hug: 'max-h-560',
        fixed: 'h-560',
      },
    },
    defaultVariants: {
      height: 'hug',
    },
  },
);
/**
 * The root component that manages the dialog's open/closed state and contains the trigger and content.
 *
 * This component wraps the Radix UI Dialog Root. It manages the dialog's visibility
 * state and coordinates between the trigger and content components.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-dialog-overview--docs Storybook}
 *
 * @example
 * import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, Button } from '@ledgerhq/lumen-ui-react';
 *
 * function MyComponent() {
 *   return (
 *     <Dialog>
 *       <DialogTrigger asChild>
 *         <Button>Open Dialog</Button>
 *       </DialogTrigger>
 *       <DialogContent>
 *         <DialogHeader
 *           appearance='compact'
 *           title='Dialog Title'
 *           description='Dialog Description'
 *           onBack={() => {}}
 *           onClose={() => {}}
 *         />
 *         <DialogBody>
 *           <p>This is a dialog!</p>
 *         </DialogBody>
 *       </DialogContent>
 *     </Dialog>
 *   );
 * }
 */
export function Dialog({ height = 'hug', ...props }: DialogProps) {
  return (
    <DialogContextProvider value={{ height }}>
      <DialogPrimitive.Root data-slot='dialog' {...props} />
    </DialogContextProvider>
  );
}

/**
 * The element that triggers the dialog to appear when interacted with.
 *
 * This component wraps any interactive element (button, link, icon, etc.) and makes it
 * the trigger for the dialog. When users click on this element, the
 * associated dialog content will be displayed.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-dialog-overview--docs Storybook}
 *
 * @example
 * import { DialogTrigger, Button } from '@ledgerhq/lumen-ui-react';
 *
 * <DialogTrigger asChild>
 *   <Button>Click me for a dialog</Button>
 * </DialogTrigger>
 */
export function DialogTrigger({ ...props }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />;
}

/**
 * A portal component that renders the dialog content into a new DOM context.
 *
 * This component is used internally by DialogContent to render the dialog
 * outside of the normal DOM hierarchy, typically at the body level to avoid
 * styling conflicts and ensure proper stacking context.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-dialog-overview--docs Storybook}
 *
 * @example
 * // Used internally
 * <DialogPortal container={document.getElementById('portal-root')}>
 *   // content
 * </DialogPortal>
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />;
}

/**
 * The overlay that covers the background when the dialog is open.
 *
 * This component renders a semi-transparent overlay behind the dialog content
 * to dim the background and focus attention on the dialog. It also prevents
 * interaction with underlying elements.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-dialog-overview--docs Storybook}
 *
 * @warning The `className` prop should only be used for layout adjustments.
 * Do not use it to modify the overlay's core appearance (colors, opacity, etc).
 *
 * @example
 * <DialogOverlay className="bg-opacity-50" />
 */
const DialogOverlay = ({
  ref,
  className,
  ...props
}: DialogOverlayProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot='dialog-overlay'
      className={cn(
        className,
        'fixed inset-0 z-dialog-overlay bg-canvas-overlay backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
      )}
      {...props}
    />
  );
};
DialogOverlay.displayName = 'DialogOverlay';

/**
 * The content container that displays the dialog information.
 *
 * This component renders the actual dialog content with custom styling.
 * The content is automatically positioned in the center of the viewport.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-dialog-overview--docs Storybook}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the dialog's core appearance (colors, padding, etc).
 *
 * @example
 * import { DialogContent } from '@ledgerhq/lumen-ui-react';
 *
 * <DialogContent>
 *   <p>This is a dialog!</p>
 * </DialogContent>
 *
 * // With custom styling for layout
 * <DialogContent className="max-w-md">
 *   <div className="space-y-4">
 *     <h4 className="heading-5-semi-bold">Dialog Title</h4>
 *     <p>Detailed content here.</p>
 *   </div>
 * </DialogContent>
 */
export function DialogContent({
  className,
  children,
  ...props
}: DialogContentProps) {
  const { height } = useDialogContext({
    consumerName: 'DialogContent',
    contextRequired: true,
  });

  return (
    <DialogPortal data-slot='dialog-portal'>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot='dialog-content'
        className={cn(dialogContentVariants({ height }), className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * The scrollable body area of the dialog.
 *
 * This component provides a scrollable container that expands to fill the
 * remaining space between the header and footer. Use it when you have
 * content that may overflow the dialog height.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-dialog-overview--docs Storybook}
 *
 * @example
 * <DialogContent>
 *   <DialogHeader title="Title" onClose={handleClose} />
 *   <DialogBody>
 *     <p>Scrollable content here</p>
 *   </DialogBody>
 *   <DialogFooter>
 *     <Button>Action</Button>
 *   </DialogFooter>
 * </DialogContent>
 */
export const DialogBody = ({
  ref,
  className,
  children,
  scrollbarWidth = 'none',
  style,
  ...props
}: DialogBodyProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const { height } = useDialogContext({
    consumerName: 'DialogBody',
    contextRequired: true,
  });
  return (
    <div
      ref={ref}
      data-slot='dialog-body'
      style={{ scrollbarWidth, ...style }}
      className={cn(
        '-mb-24 flex min-h-0 grow flex-col overflow-y-auto px-24 pb-24',
        height === 'hug' ? 'basis-auto' : 'basis-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
DialogBody.displayName = 'DialogBody';

/**
 * The fixed footer area of the dialog.
 *
 * This component provides a fixed container at the bottom of the dialog
 * for actions like buttons. It stays in place while the body content scrolls.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-dialog-overview--docs Storybook}
 *
 * @example
 * <DialogContent>
 *   <DialogHeader title="Title" onClose={handleClose} />
 *   <DialogBody>
 *     <p>Content</p>
 *   </DialogBody>
 *   <DialogFooter>
 *     <Button>Cancel</Button>
 *     <Button>Confirm</Button>
 *   </DialogFooter>
 * </DialogContent>
 */
export const DialogFooter = ({
  ref,
  className,
  children,
  ...props
}: DialogFooterProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  return (
    <div
      ref={ref}
      data-slot='dialog-footer'
      className={cn('flex shrink-0 justify-end gap-8 px-24 pt-24', className)}
      {...props}
    >
      {children}
    </div>
  );
};
DialogFooter.displayName = 'DialogFooter';

export { DialogHeader };
