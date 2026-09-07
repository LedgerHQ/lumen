import type { ComponentType, ReactNode } from 'react';
import type {
  LumenTextStyle,
  StyledPressableProps,
  StyledViewProps,
} from '../../../../styles';
import type { IconSize } from '../../symbols/Icon/types';

export type IconComponent = ComponentType<{
  size?: IconSize;
  color?: LumenTextStyle['color'];
}>;

export type ActionListItemAppearance = 'primary' | 'destructive';

export type ActionListProps = {
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

export type ActionListItemProps = {
  label: string;
  icon?: IconComponent;
  appearance?: ActionListItemAppearance;
  disabled?: boolean;
  onPress?: StyledPressableProps['onPress'];
} & Omit<StyledPressableProps, 'children' | 'onPress'>;
