import type {
  ButtonHTMLAttributes,
  ComponentPropsWithRef,
  ReactNode,
} from 'react';

/**
 * Context value for passing state to sub-components
 */
export type ListItemContextValue = {
  disabled?: boolean;
};

/**
 * Props for the ListItem root component
 */
export type ListItemProps = {
  /**
   * The content of the list item (ListItemLeading, ListItemTrailing)
   */
  children: ReactNode;
  /**
   * custom classname
   */
  className?: string;
  /**
   * Whether the list item is disabled.
   */
  disabled?: boolean;
  /**
   * Callback function when the list item is pressed.
   */
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
} & Omit<ComponentPropsWithRef<'button'>, 'children'>;

/**
 * Props for the ListItemLeading component
 */
export type ListItemLeadingProps = {
  /**
   * The content of the leading area (visual element + ListItemContent)
   */
  children: ReactNode;
  /**
   * custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

/**
 * Props for the ListItemContent component
 */
export type ListItemContentProps = {
  /**
   * The content (ListItemTitle, ListItemDescription)
   */
  children: ReactNode;
  /**
   * custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

/**
 * Props for the ListItemContentRow component
 */
export type ListItemContentRowProps = {
  /**
   * The row content (ListItemTitle or ListItemDescription alongside inline elements like Tag)
   */
  children: ReactNode;
  /**
   * custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

/**
 * Props for the ListItemTitle component
 */
export type ListItemTitleProps = {
  /**
   * The title text or custom content
   */
  children: ReactNode;
  /**
   * custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

/**
 * Props for the ListItemDescription component
 */
export type ListItemDescriptionProps = {
  /**
   * The description text or custom content
   */
  children: ReactNode;
  /**
   * custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;

/**
 * Props for the ListItemTrailing component
 */
export type ListItemTrailingProps = {
  /**
   * The trailing content (icons, switches, values, etc.)
   */
  children: ReactNode;
  /**
   * custom classname
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;
