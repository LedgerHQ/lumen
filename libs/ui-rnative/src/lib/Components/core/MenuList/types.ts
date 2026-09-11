import type { ComponentType, ReactNode } from 'react';
import type {
  LumenTextStyle,
  StyledPressableProps,
  StyledViewProps,
} from '../../../../styles';
import type { IconSize } from '../../symbols/Icon';

type IconComponent = ComponentType<{
  size?: IconSize;
  color?: LumenTextStyle['color'];
}>;

export type MenuListItemAppearance = 'base' | 'red';

export type MenuListProps = {
  /**
   * The `MenuListItem`s that make up the menu.
   */
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type MenuListItemProps = {
  /**
   * Text describing the action, truncated to a single line.
   */
  label: string;
  /**
   * Icon rendered before the label.
   */
  icon?: IconComponent;
  /**
   * Visual treatment of the label and icon. Use `red` for irreversible or
   * dangerous actions.
   *
   * @default 'base'
   */
  appearance?: MenuListItemAppearance;
  /**
   * Prevents interaction and dims the content.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Action to run when the item is pressed.
   */
  onPress?: StyledPressableProps['onPress'];
} & Omit<StyledPressableProps, 'children' | 'onPress'>;
