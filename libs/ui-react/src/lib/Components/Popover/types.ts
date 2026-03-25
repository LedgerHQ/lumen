import type {
  PopoverRootChangeEventDetails,
  Popover as PopoverNamespace,
} from '@base-ui/react/popover';
import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

type PopoverHandle<Payload> = PopoverNamespace.Handle<Payload>;

export type PopoverWidth = 'hug' | 'fixed';
export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type PopoverAlign = 'start' | 'center' | 'end';

/**
 * Props for the Popover root component.
 *
 * Groups all parts of the popover and provides configuration
 * that flows down to child components via context.
 */
export type PopoverProps<Payload = unknown> = {
  /**
   * The controlled open state of the popover.
   * Must be used in conjunction with `onOpenChange`.
   */
  open?: boolean;

  /**
   * The open state of the popover when it is initially rendered.
   * Use when you do not need to control its open state.
   *
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Event handler called when the open state changes.
   *
   * @param open - The new open state
   * @param eventDetails - Additional details about the event that caused the change
   */
  onOpenChange?: (
    open: boolean,
    eventDetails: PopoverRootChangeEventDetails,
  ) => void;

  /**
   * Whether to show a backdrop overlay and block outside interactions.
   * When `true`, renders a visual overlay and sets the popover to modal mode
   * (disables scrolling and pointer events on elements behind the overlay).
   * When `false`, no overlay is rendered and users can interact with the rest of the page.
   *
   * @default true
   */
  overlay?: boolean;

  /**
   * A handle to associate the popover with a detached trigger.
   * Created via `createPopoverHandle()`.
   */
  handle?: PopoverHandle<Payload>;

  /**
   * The content of the popover. Can be a regular React node or a render function
   * that receives the `payload` from the active trigger.
   */
  children?: ReactNode | ((arg: { payload: Payload | undefined }) => ReactNode);
};

/**
 * Props for the PopoverTrigger component.
 *
 * A button that opens the popover. Renders a `<button>` element by default.
 */
export type PopoverTriggerProps<Payload = unknown> = {
  /**
   * A handle to associate this trigger with a popover defined elsewhere.
   * Created via `createPopoverHandle()`.
   */
  handle?: PopoverHandle<Payload>;

  /**
   * A payload to pass to the popover when it is opened.
   * Accessible through the render function children of `Popover`.
   */
  payload?: Payload;

  /**
   * Allows you to replace the component's HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement`.
   */
  render?: ReactElement;
} & Omit<ComponentPropsWithRef<'button'>, 'children'>;

/**
 * Props for the PopoverContent component.
 *
 * Renders the popover popup panel with Portal, optional Backdrop,
 * Positioner, and Popup internally.
 */
export type PopoverContentProps = {
  /**
   * The preferred side of the trigger to position the popover against.
   * May automatically change to avoid collisions.
   *
   * @default 'bottom'
   */
  side?: PopoverSide;

  /**
   * The distance in pixels from the trigger.
   *
   * @default 8
   */
  sideOffset?: number;

  /**
   * The preferred alignment against the trigger.
   * May change when collisions occur.
   *
   * @default 'start'
   */
  align?: PopoverAlign;

  /**
   * The width behavior of the popover content panel.
   * - `'hug'`: Content-fit width up to max 400px (default)
   * - `'fixed'`: Always exactly 400px width
   *
   * @default 'hug'
   */
  width?: PopoverWidth;

  /**
   * Additional CSS class names to apply to the popup panel.
   */
  className?: string;

  /**
   * The content to display inside the popover panel.
   */
  children?: ReactNode;
};

/**
 * Internal context value passed from Popover root to PopoverContent.
 */
export type PopoverContextValue = {
  overlay: boolean;
};
