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
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type MenuListItemProps = {
  label: string;
  icon?: IconComponent;
  appearance?: MenuListItemAppearance;
  disabled?: boolean;
  onPress?: StyledPressableProps['onPress'];
} & Omit<StyledPressableProps, 'children' | 'onPress'>;
