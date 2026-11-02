import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type { StyledViewProps } from '../../../../styles';

/**
 * Props shared by every tag flavor. Lives here so `core` tags build on `internal`.
 */
export type BaseTagSharedProps = {
  /**
   * The appearance of the tag.
   */
  appearance?:
    | 'base'
    | 'gray'
    | 'accent'
    | 'accent-subtle'
    | 'success'
    | 'error'
    | 'warning'
    | 'white';
  /**
   * The label of the tag.
   */
  label: string;
  /**
   * The size of the tag.
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /**
   * When `true`, prevents the user from interacting with the tag.
   *
   * @default false
   */
  disabled?: boolean;
} & StyledViewProps;

export type BaseTagVariant = 'tag' | 'media';

export type BaseTagProps = BaseTagSharedProps & {
  variant: BaseTagVariant;
  consumerName: string;
  renderIcon?: (style: StyleProp<TextStyle>) => ReactNode;
};
