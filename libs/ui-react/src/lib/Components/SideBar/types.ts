import { HTMLAttributes, ReactNode } from 'react';
import { IconSize } from '../Icon/types';

/**
 * Context value for passing state to SideBar sub-components
 */
export type SideBarContextValue = {
  /** Whether the sidebar is collapsed */
  collapsed: boolean;
  /** Function to update the collapsed state */
  setCollapsed: (value: boolean) => void;
  /** The value of the currently active item */
  active: string;
  /** Function to update the active item */
  onActiveChange: (value: string) => void;
};

/**
 * Props for the SideBar root component
 */
export type SideBarProps = {
  /**
   * Controlled collapsed state. When provided, the component becomes controlled.
   */
  collapsed?: boolean;
  /**
   * Default collapsed state for uncontrolled mode.
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Callback fired when the collapsed state changes.
   */
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * The value of the currently active item.
   * When provided, the component becomes controlled for selection.
   */
  active?: string;
  /**
   * Default active item value for uncontrolled mode.
   */
  defaultActive?: string;
  /**
   * Callback fired when the active item changes.
   */
  onActiveChange?: (value: string) => void;
  /**
   * The children of the sidebar (SideBarLeading, SideBarTrailing).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for the sidebar container.
   */
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

/**
 * Props for the SideBarLeading component (top section)
 */
export type SideBarLeadingProps = {
  /**
   * The content of the leading section (typically SideBarItem components).
   */
  children: ReactNode;
  /**
   * Additional CSS classes for the leading container.
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for the SideBarTrailing component (bottom section)
 */
export type SideBarTrailingProps = {
  /**
   * The content of the trailing section (typically SideBarItem components).
   */
  children?: ReactNode;
  /**
   * Additional CSS classes for the trailing container.
   */
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Props for the SideBarItem component
 */
export type SideBarItemProps = {
  /**
   * Unique identifier for this item. Used to determine which item is active.
   */
  value: string;
  /**
   * The icon component to display when inactive.
   */
  icon: ReactNode;
  /**
   * The icon component to display when the item is active.
   */
  activeIcon: React.ComponentType<{ size?: IconSize; className?: string }>;
  /**
   * Optional label next to the icon when expanded. Can be a string or a ReactNode (e.g., with Tag).
   * When omitted, only the icon is shown. When collapsed, use `tooltipContent` for tooltip content.
   */
  label?: ReactNode;
  /**
   * Content shown in the tooltip when collapsed. Can be a string or ReactNode. If not provided and `label` is set, `label` is used.
   */
  tooltipContent?: ReactNode;
  /**
   * Whether the item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional click handler. Called before `onActiveChange`.
   * Use this for analytics tracking, custom navigation, or side effects.
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Additional CSS classes for the item.
   */
  className?: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'>;

/**
 * Internal props for the collapse toggle component
 */
export type SideBarCollapseToggleProps = {
  /**
   * Additional CSS classes for the toggle.
   */
  className?: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>;
