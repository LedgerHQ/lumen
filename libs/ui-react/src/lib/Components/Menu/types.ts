import type * as React from 'react';

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;
type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;

/**
 * Props for the Menu root component.
 *
 * The root component contains all parts of a dropdown menu.
 */
export type MenuProps = {
  /**
   * The content of the dropdown menu (trigger and content components).
   */
  children?: React.ReactNode;

  /**
   * The controlled open state of the dropdown menu.
   * Must be used in conjunction with `onOpenChange`.
   */
  open?: boolean;

  /**
   * The open state of the dropdown menu when it is initially rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: boolean;

  /**
   * Event handler called when the open state changes.
   *
   * @param open - The new open state
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * The modality of the dropdown menu.
   * When set to `true`, interaction with outside elements will be disabled
   * and only menu content will be visible to screen readers.
   *
   * @default true
   */
  modal?: boolean;
};

/**
 * Props for the Menu trigger component.
 *
 * The button that toggles the dropdown menu.
 * By default renders a button element.
 */
export type MenuTriggerProps = {
  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior.
   *
   * Use this when you need to trigger the menu from a custom component.
   */
  asChild?: boolean;
} & React.ComponentPropsWithRef<'button'>;

/**
 * Props for the Menu content component.
 *
 * The component that pops out when the dropdown menu is open.
 */
export type MenuContentProps = {
  /**
   * Additional CSS class names to apply to the content.
   */
  className?: string;

  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior.
   */
  asChild?: boolean;

  /**
   * When `true`, keyboard navigation will loop from last item to first, and vice versa.
   *
   * @default false
   */
  loop?: boolean;

  /**
   * Event handler called when focus moves back after closing.
   * Can be prevented by calling `event.preventDefault`.
   */
  onCloseAutoFocus?: (event: Event) => void;

  /**
   * Event handler called when the escape key is down.
   * Can be prevented by calling `event.preventDefault`.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Event handler called when a pointer event occurs outside the bounds of the component.
   * Can be prevented by calling `event.preventDefault`.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

  /**
   * Event handler called when focus moves outside the bounds of the component.
   * Can be prevented by calling `event.preventDefault`.
   */
  onFocusOutside?: (event: FocusOutsideEvent) => void;

  /**
   * Event handler called when an interaction (pointer or focus) happens outside the bounds of the component.
   * Can be prevented by calling `event.preventDefault`.
   */
  onInteractOutside?: (
    event: PointerDownOutsideEvent | FocusOutsideEvent,
  ) => void;

  /**
   * The preferred side of the trigger to render against when open.
   * Will be reversed when collisions occur and `avoidCollisions` is enabled.
   *
   * @default 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * The distance in pixels from the trigger.
   *
   * @default 0
   */
  sideOffset?: number;

  /**
   * The preferred alignment against the trigger.
   * May change when collisions occur.
   *
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';

  /**
   * An offset in pixels from the "start" or "end" alignment options.
   *
   * @default 0
   */
  alignOffset?: number;

  /**
   * When `true`, overrides the side and align preferences to prevent collisions with boundary edges.
   *
   * @default true
   */
  avoidCollisions?: boolean;

  /**
   * The element used as the collision boundary.
   *
   * @default []
   */
  collisionBoundary?: Element | null | Array<Element | null>;

  /**
   * The distance in pixels from the boundary edges where collision detection should occur.
   *
   * @default 0
   */
  collisionPadding?:
    | number
    | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;

  /**
   * The sticky behavior on the align axis.
   * "partial" will keep the content in the boundary as long as the trigger is at least partially in the boundary,
   * whilst "always" will keep the content in the boundary regardless.
   *
   * @default 'partial'
   */
  sticky?: 'partial' | 'always';

  /**
   * Whether to hide the content when the trigger becomes fully occluded.
   *
   * @default false
   */
  hideWhenDetached?: boolean;
} & React.ComponentPropsWithRef<'div'>;

/**
 * Props for a Menu item component.
 *
 * The component that contains the dropdown menu items.
 */
export type MenuItemProps = {
  /**
   * Additional CSS class names to apply to the item.
   */
  className?: string;

  /**
   * When `true`, the item will have left padding for alignment with labeled items.
   */
  inset?: boolean;

  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior.
   */
  asChild?: boolean;

  /**
   * When `true`, prevents the user from interacting with the item.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Event handler called when the user selects an item (via mouse or keyboard).
   * Calling `event.preventDefault` in this handler will prevent the dropdown menu from closing when selecting that item.
   */
  onSelect?: (event: Event) => void;

  /**
   * Optional text used for typeahead purposes.
   * By default, the typeahead behavior will use the `.textContent` of the item.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;
} & React.ComponentPropsWithRef<'div'>;

/**
 * Props for a Menu checkbox item component.
 *
 * An item that can be controlled and rendered like a checkbox.
 */
export type MenuCheckboxItemProps = {
  /**
   * The controlled checked state of the item.
   * Must be used in conjunction with `onCheckedChange`.
   */
  checked?: boolean | 'indeterminate';

  /**
   * Event handler called when the checked state changes.
   *
   * @param checked - The new checked state
   */
  onCheckedChange?: (checked: boolean) => void;
} & Omit<MenuItemProps, 'onSelect'>;

/**
 * Props for a Menu radio item component.
 *
 * An item that can be controlled and rendered like a radio button.
 * Must be used within a `MenuRadioGroup`.
 */
export type MenuRadioItemProps = {
  /**
   * The unique value of the item.
   *
   * @required
   */
  value: string;
} & Omit<MenuItemProps, 'onSelect'>;

/**
 * Props for a Menu label component.
 *
 * Used to render a label for a group of items.
 * It won't be focusable using arrow keys.
 */
export type MenuLabelProps = {
  /**
   * Additional CSS class names to apply to the label.
   */
  className?: string;

  /**
   * When `true`, the label will have left padding for alignment with items.
   */
  inset?: boolean;

  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior.
   */
  asChild?: boolean;
} & React.ComponentPropsWithRef<'div'>;

/**
 * Props for a Menu separator component.
 *
 * Used to visually separate items in the dropdown menu.
 */
export type MenuSeparatorProps = {
  /**
   * Additional CSS class names to apply to the separator.
   */
  className?: string;

  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior.
   */
  asChild?: boolean;
} & React.ComponentPropsWithRef<'div'>;

/**
 * Props for a Menu group component.
 *
 * Used to group multiple items together.
 */
export type MenuGroupProps = {
  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior.
   */
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

/**
 * Props for a Menu radio group component.
 *
 * Used to group multiple radio items together.
 */
export type MenuRadioGroupProps = {
  /**
   * The controlled value of the radio item to check.
   * Should be used in conjunction with `onValueChange`.
   */
  value?: string;

  /**
   * Event handler called when the value changes.
   *
   * @param value - The value of the radio item that was selected
   */
  onValueChange?: (value: string) => void;

  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior.
   */
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<'div'>;

/**
 * Props for a Menu sub component.
 *
 * Contains all the parts of a submenu.
 */
export type MenuSubProps = {
  /**
   * The content of the submenu (trigger and content components).
   */
  children?: React.ReactNode;

  /**
   * The controlled open state of the submenu.
   * Must be used in conjunction with `onOpenChange`.
   */
  open?: boolean;

  /**
   * The open state of the submenu when it is initially rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen?: boolean;

  /**
   * Event handler called when the open state changes.
   *
   * @param open - The new open state
   */
  onOpenChange?: (open: boolean) => void;
};

/**
 * Props for a Menu sub trigger component.
 *
 * An item that opens a submenu. Must be rendered inside `MenuSub`.
 */
export type MenuSubTriggerProps = {
  /**
   * Additional CSS class names to apply to the sub trigger.
   */
  className?: string;

  /**
   * When `true`, the sub trigger will have left padding for alignment with labeled items.
   */
  inset?: boolean;

  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior.
   */
  asChild?: boolean;

  /**
   * When `true`, prevents the user from interacting with the item.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional text used for typeahead purposes.
   * By default, the typeahead behavior will use the `.textContent` of the item.
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue?: string;
} & React.ComponentPropsWithRef<'div'>;

/**
 * Props for a Menu sub content component.
 *
 * The component that pops out when a submenu is open.
 * Must be rendered inside `MenuSub`.
 */
export type MenuSubContentProps = {
  /**
   * Additional CSS class names to apply to the sub content.
   */
  className?: string;
} & Omit<
  MenuContentProps,
  | 'side'
  | 'sideOffset'
  | 'align'
  | 'onCloseAutoFocus'
  | 'onEscapeKeyDown'
  | 'onPointerDownOutside'
  | 'onFocusOutside'
  | 'onInteractOutside'
>;
