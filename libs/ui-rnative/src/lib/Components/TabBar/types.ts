import { ComponentType, ReactElement } from 'react';
import { IconSize } from '../Icon';
import { BoxProps } from '../Utility';
import { TabBarItem } from './TabBar';

type IconComponent = ComponentType<{
  size?: IconSize;
  className?: string;
}>;

export type TabBarItemProps = {
  /**
   * The unique identifier for the tab item.
   */
  value: string;
  /**
   * The display label for the tab item.
   * If not provided, the value will be used as the label.
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
};

export type TabBarChild = ReactElement<TabBarItemProps, typeof TabBarItem>;
export type TabBarChildren = [TabBarChild, TabBarChild, ...TabBarChild[]];

export type TabBarProps = {
  /**
   * The value of the currently active tab.
   */
  active: string;
  /**
   * The callback function called when a tab is pressed.
   */
  onTabPress: (active: string) => void;
  /**
   * The tab items to display. Requires at least two TabBarItem children.
   */
  children: TabBarChildren;
} & Omit<BoxProps, 'children'>;
