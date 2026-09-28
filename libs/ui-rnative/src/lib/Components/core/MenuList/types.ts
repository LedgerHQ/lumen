import type { ComponentType, ReactNode } from 'react';
import type {
  LumenTextStyle,
  StyledPressableProps,
  StyledViewProps,
} from '../../../../styles';
import type { IconSize } from '../../symbols/Icon';

export type IconComponent = ComponentType<{
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

type MenuListItemBaseProps = {
  /**
   * Text describing the action, truncated to a single line.
   */
  label: string;
  /**
   * Icon rendered before the label.
   */
  icon?: IconComponent;
  /**
   * Prevents interaction and dims the content.
   *
   * @default false
   */
  disabled?: boolean;
};

export type MenuListItemProps = {
  /**
   * Visual treatment of the label and icon. Use `red` for irreversible or
   * dangerous actions.
   *
   * @default 'base'
   */
  appearance?: MenuListItemAppearance;
  /**
   * Action to run when the item is pressed.
   */
  onPress?: StyledPressableProps['onPress'];
} & MenuListItemBaseProps &
  Omit<StyledPressableProps, 'children' | 'onPress'>;

export type MenuListSwitchItemProps = {
  /**
   * The controlled checked state of the switch.
   * @default false
   */
  checked?: boolean;
  /**
   * Sets the initial checked state for uncontrolled use.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback function called when the checked state changes.
   */
  onCheckedChange?: (checked: boolean) => void;
} & MenuListItemBaseProps &
  Omit<StyledPressableProps, 'children' | 'onPress'>;
