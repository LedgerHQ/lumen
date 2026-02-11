import { HTMLAttributes } from 'react';
import { DiscriminatedSpotProps } from '../Spot';

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
  children: React.ReactNode;
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
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  /**
   * Ref to the list item button element.
   */
  ref?: React.Ref<HTMLButtonElement>;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

/**
 * Props for the ListItemLeading component
 */
export type ListItemLeadingProps = {
  /**
   * The content of the leading area (visual element + ListItemContent)
   */
  children: React.ReactNode;
  /**
   * custom classname
   */
  className?: string;
  /**
   * Ref to the list item leading element.
   */
  ref?: React.Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for the ListItemContent component
 */
export type ListItemContentProps = {
  /**
   * The content (ListItemTitle, ListItemDescription)
   */
  children: React.ReactNode;
  /**
   * custom classname
   */
  className?: string;
  /**
   * Ref to the list item content element.
   */
  ref?: React.Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for the ListItemTitle component
 */
export type ListItemTitleProps = {
  /**
   * The title text or custom content
   */
  children: React.ReactNode;
  /**
   * custom classname
   */
  className?: string;
  /**
   * Ref to the list item title element.
   */
  ref?: React.Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for the ListItemDescription component
 */
export type ListItemDescriptionProps = {
  /**
   * The description text or custom content
   */
  children: React.ReactNode;
  /**
   * custom classname
   */
  className?: string;
  /**
   * Ref to the list item description element.
   */
  ref?: React.Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for the ListItemTrailing component
 */
export type ListItemTrailingProps = {
  /**
   * The trailing content (icons, switches, values, etc.)
   */
  children: React.ReactNode;
  /**
   * custom classname
   */
  className?: string;
  /**
   * Ref to the list item trailing element.
   */
  ref?: React.Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for ListItemSpot when appearance is 'icon'
 */
export type ListItemSpotProps = DiscriminatedSpotProps &
  HTMLAttributes<HTMLDivElement>;

/**
 * Props for the ListItemTruncate component
 * Used to truncate text that should when ListItemDescription or ListItemTitle contain custom content
 */
export type ListItemTruncateProps = {
  /**
   * The content to truncate
   */
  children: React.ReactNode;
  /**
   * custom classname
   */
  className?: string;
  /**
   * Ref to the list item truncate element.
   */
  ref?: React.Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for the ListItemIcon component
 */
export type ListItemIconProps = {
  /**
   * The icon component to render
   */
  icon: React.ComponentType<any>;
  /**
   * custom classname
   */
  className?: string;
  /**
   * Ref to the list item icon element.
   */
  ref?: React.Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;
