import type {
  AriaAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  HTMLAttributes,
} from 'react';

type ButtonA11yOptions<T extends HTMLElement = HTMLElement> = {
  onClick?: MouseEventHandler<T>;
  disabled?: boolean;
};

type ButtonA11yProps<T extends HTMLElement = HTMLElement> = Pick<
  HTMLAttributes<T>,
  'role' | 'tabIndex' | 'onKeyDown' | 'onClick'
> &
  Pick<AriaAttributes, 'aria-disabled'>;

/**
 * Returns props to make a non-button element (e.g. `<div>`) behave like a
 * button: `role="button"`, `tabIndex`, keyboard activation on Enter/Space,
 * and the original `onClick` passthrough.
 *
 * When `disabled` is `true`, the element gets `aria-disabled`, is removed
 * from the tab order, and click/keyboard handlers are omitted.
 *
 * Returns `undefined` when `onClick` is falsy so it can be used inline:
 * ```tsx
 * <div {...getButtonA11yProps({ onClick, disabled })} />
 * ```
 */
export const getButtonA11yProps = <T extends HTMLElement = HTMLElement>({
  onClick,
  disabled,
}: ButtonA11yOptions<T>): ButtonA11yProps<T> | undefined => {
  if (disabled) {
    return {
      role: 'button',
      tabIndex: -1,
      'aria-disabled': true,
    };
  }

  const onKeyDown: KeyboardEventHandler<T> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent<T>);
    }
  };

  return {
    role: 'button',
    tabIndex: 0,
    onKeyDown,
    onClick,
  };
};
