import { IconSize } from '../Icon/types';

export type TagProps = {
  /**
   * The appearance of the tag.
   * @default accent
   */
  appearance?: 'base' | 'gray' | 'accent' | 'success' | 'error' | 'warning';
  /**
   * The size of the tag.
   * @default md
   */
  size?: 'sm' | 'md';
  /**
   * Icon component to render.
   */
  icon?: React.ComponentType<{ size?: IconSize; className?: string }>;
  /**
   * Label text to display.
   * @required
   */
  label: string;
  /**
   * When `true`, prevents the user from interacting with the tag.
   *
   * @default false
   */
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>;
