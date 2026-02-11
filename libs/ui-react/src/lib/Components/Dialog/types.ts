import { ReactNode } from 'react';

export type DialogHeight = 'hug' | 'fixed';

export type DialogProps = {
  /**
   * The content to display inside the dialog.
   */
  children?: ReactNode;
  /**
   * Callback function to handle open state change.
   * @param open - The new open state of the dialog.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * The open state of the dialog.
   * @default false
   */
  open?: boolean;
  /**
   * The default open state of the dialog.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * The height behavior of the dialog.
   * - `hug`: Content-fit height up to max 560px (default)
   * - `fixed`: Always exactly 560px height
   * @default 'hug'
   */
  height?: DialogHeight;
  /**
   * Whether to render the dialog in modal mode.
   * When true, interaction with outside elements is disabled.
   * @default true
   */
  modal?: boolean;
};

export type DialogTriggerProps = {
  /**
   * The element that will trigger the dialog (e.g., button, icon, text).
   */
  children?: ReactNode;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean;
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   */
  className?: string;
};

export type DialogOverlayProps = {
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   */
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
};

export type DialogContentProps = {
  /**
   * The content to display inside the dialog.
   */
  children?: ReactNode;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   */
  asChild?: boolean;
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   */
  className?: string;
  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented by calling `event.preventDefault()`.
   */
  onOpenAutoFocus?: (event: Event) => void;
  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented by calling `event.preventDefault()`.
   */
  onCloseAutoFocus?: (event: Event) => void;
  /**
   * Event handler called when the escape key is pressed.
   * Can be prevented by calling `event.preventDefault()`.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /**
   * Event handler called when a pointer event occurs outside the dialog.
   * Can be prevented by calling `event.preventDefault()`.
   */
  onPointerDownOutside?: (event: CustomEvent) => void;
  /**
   * Event handler called when any interaction occurs outside the dialog.
   * Can be prevented by calling `event.preventDefault()`.
   */
  onInteractOutside?: (event: CustomEvent) => void;
};

export type DialogHeaderProps = {
  /**
   * The appearance variant of the header.
   * @default 'compact'
   */
  appearance?: 'compact' | 'extended';
  /**
   * The main title to display in the header.
   */
  title?: string;
  /**
   * Optional description text to show below or beside the title.
   */
  description?: string;
  /**
   * Callback function to handle close action.
   */
  onClose: () => void;
  /**
   * Optional callback for back navigation.
   */
  onBack?: () => void;
  /**
   * Additional custom CSS classes to apply.
   */
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;

export type DialogBodyProps = {
  /**
   * The content to display inside the dialog body.
   */
  children?: ReactNode;
  /**
   * Additional custom CSS classes to apply.
   */
  className?: string;
  /**
   * The width of the scrollbar
   * 'none' will keep the same DialogBody width and hide the scrollbar.
   * @default 'none'
   */
  scrollbarWidth?: 'none' | 'auto';
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;

export type DialogFooterProps = {
  /**
   * The content to display inside the dialog footer.
   */
  children?: ReactNode;
  /**
   * Additional custom CSS classes to apply.
   */
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;
