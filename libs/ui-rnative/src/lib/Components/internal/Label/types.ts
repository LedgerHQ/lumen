import type { TextProps } from '../../primitives';

export type LabelProps = {
  /**
   * The disabled state of the label.
   */
  disabled?: boolean;
} & Omit<TextProps, 'typography'>;
