import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type { TagProps } from '../Tag/types';

export type BaseTagVariant = 'tag' | 'media';

export type BaseTagProps = Omit<TagProps, 'icon'> & {
  variant: BaseTagVariant;
  consumerName: string;
  renderIcon?: (style: StyleProp<TextStyle>) => ReactNode;
};
