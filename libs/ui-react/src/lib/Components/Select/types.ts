import * as React from 'react';

type Direction = 'ltr' | 'rtl';
type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;

export type SelectProps = {
  /**
   * The children of the select item
   */
  children: React.ReactNode;
  /**
   * The controlled open state of the select.
   * Must be used in conjunction with onOpenChange.
   */
  open?: boolean;
  /**
   * The value of the select when initially rendered.
   * Use when you do not need to control the state of the select.
   */
  defaultValue?: string;
  /**
   * Event handler called when the open state of the select changes.
   */
  onOpenChange?(open: boolean): void;
  /**
   * The open state of the select when it is initially rendered.
   * Use when you do not need to control its open state.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * The reading direction of the select when applicable.
   * If omitted, inherits globally from DirectionProvider or assumes LTR (left-to-right) reading mode.
   */
  dir?: Direction;
  /**
   * The name of the select.
   * Submitted with its owning form as part of a name/value pair.
   */
  name?: string;
  /**
   * When true, prevents the user from interacting with select.
   */
  disabled?: boolean;
  /**
   * Whether the select is required
   * @default false
   */
  required?: boolean;
  /**
   * The controlled value of the select.
   * Should be used in conjunction with onValueChange.
   */
  value?: string;
  /**
   * Event handler called when the value changes.
   */
  onValueChange?(value: string): void;
};

export type SelectTriggerProps = {
  /**
   * Extra class names to apply to the trigger element
   * @example className='text-error'
   */
  className?: string;
  /**
   * The label text that floats above the input when focused or filled
   * @example label='Label'
   */
  label?: string;
  /** Additional class names to apply to the label element
   * @example labelClassName='text-error'
   */
  labelClassName?: string;
  /**
   * Ref to the select trigger button element.
   */
  ref?: React.Ref<HTMLButtonElement>;
};

export type SelectContentProps = {
  /**
   * The children of the select content
   */
  children: React.ReactNode;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /**
   * Event handler called when focus moves to the trigger after closing.
   * It can be prevented by calling event.preventDefault.
   */
  onCloseAutoFocus?: (event: Event) => void;
  /**
   * Event handler called when the escape key is down.
   * It can be prevented by calling event.preventDefault.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /**
   * Event handler called when a pointer event occurs outside the bounds of the component.
   * It can be prevented by calling event.preventDefault.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
  /**
   * The positioning mode to use.
   * we are using popper by default to position the content relative to the trigger.
   * @default "popper"
   */
  position?: 'item-aligned' | 'popper';
  /**
   * The preferred side of the anchor to render against when open. Will be reversed when collisions occur and avoidCollisions is enabled.
   * This is only available when position is set to popper.
   * @default "bottom"
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * The distance in pixels from the trigger
   * @default 0
   */
  sideOffset?: number;
  /**
   * The preferred alignment against the trigger
   * @default "start"
   */
  align?: 'start' | 'center' | 'end';
  /**
   * An offset in pixels from the "start" or "end" alignment options
   * @default 0
   */
  alignOffset?: number;
  /**
   * When true, overrides the side and align preferences to prevent collisions with boundary edges
   * @default true
   */
  avoidCollisions?: boolean;
  /**
   * The element used as the collision boundary. Accepts an array of elements
   * @default []
   */
  collisionBoundary?: Element | Element[];
  /**
   * The distance in pixels from the boundary edges where collision detection should occur
   * @default 10
   */
  collisionPadding?:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number };
  /**
   * The sticky behavior on the align axis
   * @default "partial"
   */
  sticky?: 'partial' | 'always';
  /**
   * Whether to hide the content when the trigger becomes fully occluded
   * @default false
   */
  hideWhenDetached?: boolean;
  /**
   * Extra class names to apply to the content element
   * @example className='text-error'
   */
  className?: string;
  /**
   * Ref to the select content element.
   */
  ref?: React.Ref<HTMLDivElement>;
};

export type SelectGroupProps = {
  /**
   * The children of the select group
   */
  children: React.ReactNode;
};

export type SelectLabelProps = {
  /**
   * The children of the select label
   * @example children={<SelectLabel>Option</SelectLabel>}
   * @required
   */
  children: React.ReactNode;
  /**
   * The class name of the select label
   */
  className?: string;
  /**
   * Ref to the select label element.
   */
  ref?: React.Ref<HTMLDivElement>;
};

export type SelectItemTextProps = {
  /**
   * The children of the select item text
   * @example children={<SelectItemText>Option</SelectItemText>}
   * @required
   */
  children: React.ReactNode;
  /**
   * Extra class names to apply to the item text element
   * @example className='text-error'
   */
  className?: string;
  /**
   * Ref to the select item text element.
   */
  ref?: React.Ref<HTMLDivElement>;
};

export type SelectItemProps = {
  /**
   * The value of the select item
   * @example value='option1'
   * @required
   */
  value: string;
  /**
   * The children of the select item
   * @example children={<SelectItemText>Option</SelectItemText>}
   * @required
   */
  children:
    | React.ReactElement<SelectItemTextProps>
    | readonly React.ReactElement[];
  /**
   * Optional text used for typeahead purposes. Use this when the content is complex, or you have non-textual content inside.
   * @example textValue='Option'
   */
  textValue?: string;
  /**
   * The disabled state of the select item
   * @example disabled={true}
   */
  disabled?: boolean;
  /**
   * Extra class names to apply to the item element
   * @example className='text-error'
   */
  className?: string;
  /**
   * Ref to the select item element.
   */
  ref?: React.Ref<HTMLDivElement>;
};

export type SelectSeparatorProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /**
   * Extra class names to apply to the separator element
   */
  className?: string;
  /**
   * Ref to the select separator element.
   */
  ref?: React.Ref<HTMLDivElement>;
};
