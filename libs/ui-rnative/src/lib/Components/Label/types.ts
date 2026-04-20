import type { TextProps } from '../Utility';

export type LabelProps = {
  /**
   * The disabled state of the label.
   */
  disabled?: boolean;
} & Omit<TextProps, 'typography'>;
