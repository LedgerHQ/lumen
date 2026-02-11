import React from 'react';
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
} & Omit<React.ComponentPropsWithRef<'button'>, 'children'>;

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
} & React.ComponentPropsWithRef<'div'>;

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
} & React.ComponentPropsWithRef<'div'>;

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
} & React.ComponentPropsWithRef<'div'>;

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
} & React.ComponentPropsWithRef<'div'>;

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
} & React.ComponentPropsWithRef<'div'>;

/**
 * Props for ListItemSpot when appearance is 'icon'
 */
export type ListItemSpotProps = DiscriminatedSpotProps &
  React.ComponentPropsWithRef<'div'>;

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
} & React.ComponentPropsWithRef<'div'>;

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
} & React.ComponentPropsWithRef<'div'>;
