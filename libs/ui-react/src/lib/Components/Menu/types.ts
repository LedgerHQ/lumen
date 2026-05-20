import type { Menu as MenuNamespace } from '@base-ui/react/menu';
import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';

type MenuRootChangeEventDetails = MenuNamespace.Root.ChangeEventDetails;

/**
 * Props for the Menu root component.
 *
 * The root component contains all parts of a dropdown menu.
 */
export type MenuProps = {
  /**
   * The content of the dropdown menu (trigger and content components).
   */
  children?: ReactNode;

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
   * @param eventDetails - Additional details about the event that caused the change
   */
  onOpenChange?: (
    open: boolean,
    eventDetails: MenuRootChangeEventDetails,
  ) => void;
};

/**
 * Props for the Menu trigger component.
 *
 * The button that toggles the dropdown menu.
 * By default renders a button element.
 */
export type MenuTriggerProps = {
  /**
   * Render prop that replaces the default button-style trigger.
   * Merges menu trigger behavior onto your component without an extra wrapper element.
   *
   * @example render={<IconButton icon={MoreVertical} aria-label="Open Menu" />}
   * @example render={(props) => <IconButton {...props} icon={MoreVertical} aria-label="Open Menu" />}
   */
  render: MenuNamespace.Trigger.Props['render'];
} & Omit<ComponentPropsWithRef<'button'>, 'children'>;

/**
 * Props for the Menu content component.
 *
 * The component that pops out when the dropdown menu is open.
 */
export type MenuContentProps = {
  /**
   * Additional CSS class names to apply to the popup.
   */
  className?: string;

  /**
   * The content to display inside the menu popup.
   */
  children?: ReactNode;

  /**
   * The preferred side of the trigger to render against when open.
   *
   * @default 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * The distance in pixels from the trigger.
   *
   * @default 4
   */
  sideOffset?: number;

  /**
   * The preferred alignment against the trigger.
   *
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';

  /**
   * An offset in pixels from the "start" or "end" alignment options.
   * @default 0
   */
  alignOffset?: number;

  /**
   * Whether to maintain the popup in the viewport after the anchor element
   * has been scrolled out of view.
   *
   * @default true
   */
  sticky?: boolean;
};

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
  label?: string;

  /**
   * Whether the menu closes when this item is clicked.
   *
   * @default true
   */
  closeOnClick?: boolean;
} & ComponentPropsWithRef<'div'>;

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
  checked?: boolean;

  /**
   * The checked state of the item when it is initially rendered.
   * Use when you do not need to control its checked state.
   *
   * @default false
   */
  defaultChecked?: boolean;

  /**
   * Event handler called when the checked state changes.
   *
   * @param checked - The new checked state
   */
  onCheckedChange?: (checked: boolean) => void;
} & MenuItemProps;

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
} & MenuItemProps;

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
} & ComponentPropsWithRef<'div'>;

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
} & ComponentPropsWithRef<'div'>;

/**
 * Props for a Menu group component.
 *
 * Used to group multiple items together.
 */
export type MenuGroupProps = ComponentPropsWithoutRef<'div'>;

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
} & ComponentPropsWithoutRef<'div'>;

/**
 * Props for a Menu sub component.
 *
 * Contains all the parts of a submenu.
 */
export type MenuSubProps = {
  /**
   * The content of the submenu (trigger and content components).
   */
  children?: ReactNode;

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
  label?: string;
} & ComponentPropsWithRef<'div'>;

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

  /**
   * The content to display inside the submenu popup.
   */
  children?: ReactNode;
};
