import type { ComponentType, ReactNode } from 'react';
import type { StyledViewProps } from '../../../styles';
import type { IconSize } from '../Icon';
import type { BoxProps } from '../Utility';

type IconComponent = ComponentType<{
  size?: IconSize;
}>;

export type TabBarValue = string;

export type TabBarProps<T extends TabBarValue = TabBarValue> = {
  /**
   * The value of the currently active tab.
   */
  active: T;
  /**
   * The callback function called when a tab is pressed.
   */
  onTabPress: (active: T) => void;
  /**
   * The tab items to display.
   */
  children: ReactNode;
} & Omit<BoxProps, 'children'>;

export type TabBarItemProps<T extends TabBarValue = TabBarValue> = {
  /**
   * The unique identifier for the tab item.
   */
  value: T;
  /**
   * The display label for the tab item.
   * If not provided, the icon will be centered.
   */
  label?: string;
  /**
   * The icon component to display when the tab is inactive.
   */
  icon?: IconComponent;
  /**
   * The icon component to display when the tab is active.
   * If not provided, the inactive icon will be used.
   */
  activeIcon?: IconComponent;
} & Omit<StyledViewProps, 'children'>;
