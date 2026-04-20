import type {
  PopoverRootChangeEventDetails,
  Popover as PopoverNamespace,
} from '@base-ui/react/popover';
import type { ComponentPropsWithRef, ReactNode, RefObject } from 'react';

type PopoverHandle<Payload> = PopoverNamespace.Handle<Payload>;

export type PopoverWidth = 'fit' | 'fixed';
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
   * When `false`, no overlay is rendered and users can interact with the rest of the page.
   * When `true`, renders a visual overlay and sets the popover to modal mode
   * (disables scrolling and pointer events on elements behind the overlay).
   *
   * @default false
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
 * Use the `render` prop to compose with a custom component.
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
   * Render function that replaces the default button-style trigger.
   *
   * @example render={<Button {...props} label="Label" />}
   * @example render={(props) => <Button {...props} label="Label" />}
   */
  render?: PopoverNamespace.Trigger.Props['render'];
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
   * - `'fit'`: Content-fit width (default), define custom width with the `className` prop
   * - `'fixed'`: Always exactly 400px width
   *
   * @default 'fit'
   */
  width?: PopoverWidth;

  /**
   * Determines the element to focus when the popover is opened.
   *
   * - `false`: Do not move focus.
   * - `true`: Move focus based on the default behavior (first tabbable element or popup).
   * - `RefObject`: Move focus to the ref element.
   * - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`).
   *   Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
   *
   * @default false
   */
  initialFocus?:
    | boolean
    | RefObject<HTMLElement | null>
    | ((
        openType: 'mouse' | 'touch' | 'pen' | 'keyboard' | '',
      ) => boolean | void | HTMLElement | null);

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
