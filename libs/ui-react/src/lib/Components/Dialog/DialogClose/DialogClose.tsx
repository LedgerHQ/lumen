import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogCloseProps } from '../types';

/**
 * A button that closes the dialog when interacted with.
 *
 * This component wraps any interactive element and makes it dismiss the dialog
 * when clicked. It is typically used inside the dialog content to provide
 * an explicit close action, such as a "Cancel" or "Done" button.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/containment-dialog-overview--docs Storybook}
 *
 * @example
 * import { DialogClose, Button } from '@ledgerhq/lumen-ui-react';
 *
 * <DialogClose asChild>
 *   <Button>Cancel</Button>
 * </DialogClose>
 */
export function DialogClose(props: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot='dialog-close' {...props} />;
}
